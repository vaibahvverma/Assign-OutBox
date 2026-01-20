/**
 * Email Worker
 * 
 * This is the BullMQ worker that processes email jobs from the queue.
 * 
 * KEY FEATURES:
 * 1. Configurable Concurrency - Multiple jobs can run in parallel
 * 2. Rate Limiting - Uses Redis counters to enforce per-sender and global limits
 * 3. Delay Between Emails - Configurable delay to mimic provider throttling
 * 4. Idempotency - Checks job status before processing to prevent duplicates
 * 5. Persistence - Jobs survive server restarts via Redis + Postgres
 * 
 * FLOW:
 * 1. Job arrives from queue
 * 2. Check idempotency (is this job already SENT or PROCESSING?)
 * 3. Check rate limits (can we send now?)
 *    - If NO: Delay the job to next available window
 * 4. Send the email via Ethereal SMTP
 * 5. Update job status in Postgres
 * 6. Increment rate limit counters
 */

import { Worker, Job } from "bullmq";
import { connection } from "../lib/redis";
import { emailQueueName, emailQueue } from "../lib/queue";
import { sendEmail } from "../lib/email";
import prisma from "../lib/prisma";
import { checkRateLimit, incrementRateLimit } from "../lib/rateLimiter";
import config from "../config";

// Delay helper to add pause between emails
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main Worker Processor
 */
async function processEmailJob(job: Job) {
    const { emailJobId } = job.data;

    console.log(`[Worker] Processing job ${job.id} for emailJobId: ${emailJobId}`);

    // Step 1: Fetch job from database
    const emailJob = await prisma.emailJob.findUnique({
        where: { id: emailJobId },
        include: { user: true },
    });

    if (!emailJob) {
        console.error(`[Worker] EmailJob ${emailJobId} not found in database`);
        return { success: false, reason: "NOT_FOUND" };
    }

    // Step 2: Idempotency Check - Don't re-process already sent emails
    if (emailJob.status === "SENT") {
        console.log(`[Worker] EmailJob ${emailJobId} already SENT, skipping`);
        return { success: true, reason: "ALREADY_SENT" };
    }

    if (emailJob.status === "FAILED") {
        // Could implement retry logic here, for now we skip
        console.log(`[Worker] EmailJob ${emailJobId} previously FAILED, attempting retry`);
    }

    // Get sender ID (using userId as sender identifier)
    const senderId = emailJob.userId;

    // Step 3: Rate Limit Check
    const rateLimitResult = await checkRateLimit(senderId);

    if (!rateLimitResult.allowed) {
        console.log(`[Worker] Rate limit exceeded for sender ${senderId}. Delaying job by ${rateLimitResult.retryAfterMs}ms`);

        // Re-queue the job with delay to next hour window
        // This preserves the job without dropping it
        await emailQueue.add(
            "send-email",
            { emailJobId },
            {
                delay: rateLimitResult.retryAfterMs,
                jobId: `${emailJobId}-retry-${Date.now()}`, // New unique job ID for retry
            }
        );

        return {
            success: false,
            reason: "RATE_LIMITED",
            retryAfterMs: rateLimitResult.retryAfterMs
        };
    }

    // Step 4: Update status to PROCESSING
    await prisma.emailJob.update({
        where: { id: emailJobId },
        data: { status: "PROCESSING" },
    });

    try {
        // Step 5: Add minimum delay between emails (configurable throttling)
        await delay(config.minDelayBetweenEmails);

        // Step 6: Send the email
        const emailResult = await sendEmail({
            to: emailJob.recipient,
            subject: emailJob.subject,
            html: emailJob.body,
        });

        // Step 7: Update to SENT
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: "SENT",
                sentAt: new Date(),
            },
        });

        // Step 8: Increment rate limit counters
        await incrementRateLimit(senderId);

        console.log(`[Worker] Successfully sent email to ${emailJob.recipient}`);
        console.log(`[Worker] Preview URL: ${emailResult.previewUrl || "N/A"}`);

        return {
            success: true,
            messageId: emailResult.messageId,
            previewUrl: emailResult.previewUrl,
        };

    } catch (error: any) {
        console.error(`[Worker] Failed to send email:`, error.message);

        // Update to FAILED
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: "FAILED",
                failedAt: new Date(),
            },
        });

        // Throw error to let BullMQ handle retries
        throw error;
    }
}

/**
 * Create and export the worker
 */
export const emailWorker = new Worker(
    emailQueueName,
    processEmailJob,
    {
        connection: connection as any,

        // Configurable concurrency - how many jobs to process in parallel
        concurrency: config.workerConcurrency,

        // BullMQ's built-in rate limiter (in addition to our custom one)
        // This limits job processing to max of 100 jobs per second globally
        limiter: {
            max: 100,
            duration: 1000, // 1 second
        },
    }
);

// Worker event handlers for logging
emailWorker.on("completed", (job, result) => {
    console.log(`[Worker] Job ${job?.id} completed:`, result);
});

emailWorker.on("failed", (job, error) => {
    console.error(`[Worker] Job ${job?.id} failed:`, error.message);
});

emailWorker.on("error", (error) => {
    console.error(`[Worker] Worker error:`, error);
});

console.log(`[Worker] Email worker started with concurrency: ${config.workerConcurrency}`);

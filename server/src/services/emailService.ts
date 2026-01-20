/**
 * Email Service (Application Layer)
 * 
 * This service handles the business logic for email scheduling.
 * 
 * KEY FEATURES:
 * 1. Single email scheduling
 * 2. Bulk email scheduling (from CSV data)
 * 3. Recovery on restart - re-queues pending jobs
 * 4. Status tracking
 */

import prisma from "../lib/prisma";
import { emailQueue } from "../lib/queue";

interface ScheduleEmailDTO {
    recipient: string;
    subject: string;
    body: string;
    scheduledAt?: string | Date;
    delay?: number;
    userId?: string;
}

interface BulkScheduleDTO {
    recipients: string[];
    subject: string;
    body: string;
    startTime: Date;
    delayBetweenEmails: number; // ms between each email
    hourlyLimit: number;
    userId?: string;
}

export class EmailService {
    /**
     * Schedule a single email
     */
    static async scheduleEmail(data: ScheduleEmailDTO) {
        console.log("[EmailService] scheduleEmail called with:", data);

        // Get or create user
        const user = await prisma.user.upsert({
            where: { email: data.userId || "demo@user.com" },
            update: {},
            create: { email: data.userId || "demo@user.com", name: "Demo User" }
        });
        console.log("[EmailService] User created/found:", user.id);

        let sendTime = new Date();
        if (data.scheduledAt) {
            sendTime = new Date(data.scheduledAt);
        }
        if (data.delay) {
            sendTime = new Date(Date.now() + data.delay);
        }

        // Create job in database first (source of truth)
        const emailJob = await prisma.emailJob.create({
            data: {
                recipient: data.recipient,
                subject: data.subject,
                body: data.body,
                scheduledAt: sendTime,
                userId: user.id,
                status: "SCHEDULED"
            },
        });

        // Add to BullMQ queue
        const delayMs = sendTime.getTime() - Date.now();
        await emailQueue.add(
            "send-email",
            { emailJobId: emailJob.id },
            {
                delay: delayMs > 0 ? delayMs : 0,
                jobId: emailJob.id, // Use same ID for tracking
            }
        );

        return emailJob;
    }

    /**
     * Schedule multiple emails in bulk
     * 
     * This is used when user uploads a CSV of recipients.
     * Each email is staggered by `delayBetweenEmails` to respect rate limits.
     */
    static async scheduleBulkEmails(data: BulkScheduleDTO) {
        const user = await prisma.user.upsert({
            where: { email: data.userId || "demo@user.com" },
            update: {},
            create: { email: data.userId || "demo@user.com", name: "Demo User" }
        });

        const jobs = [];
        let currentTime = new Date(data.startTime).getTime();

        for (let i = 0; i < data.recipients.length; i++) {
            const recipient = data.recipients[i];

            // Calculate send time with staggered delay
            const sendTime = new Date(currentTime + (i * data.delayBetweenEmails));

            // Create job in database
            const emailJob = await prisma.emailJob.create({
                data: {
                    recipient,
                    subject: data.subject,
                    body: data.body,
                    scheduledAt: sendTime,
                    userId: user.id,
                    status: "SCHEDULED"
                },
            });

            // Add to queue with delay
            const delayMs = sendTime.getTime() - Date.now();
            await emailQueue.add(
                "send-email",
                { emailJobId: emailJob.id },
                {
                    delay: delayMs > 0 ? delayMs : 0,
                    jobId: emailJob.id,
                }
            );

            jobs.push(emailJob);
        }

        return {
            totalScheduled: jobs.length,
            firstSendAt: data.startTime,
            lastSendAt: new Date(currentTime + ((data.recipients.length - 1) * data.delayBetweenEmails)),
            jobs,
        };
    }

    /**
     * Get all emails (scheduled + sent)
     */
    static async getAllEmails(userId?: string) {
        const where = userId ? { userId } : {};

        return prisma.emailJob.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { user: true },
        });
    }

    /**
     * Get scheduled emails only
     */
    static async getScheduledEmails(userId?: string) {
        return prisma.emailJob.findMany({
            where: {
                status: "SCHEDULED",
                ...(userId ? { userId } : {}),
            },
            orderBy: { scheduledAt: "asc" },
        });
    }

    /**
     * Get sent emails only
     */
    static async getSentEmails(userId?: string) {
        return prisma.emailJob.findMany({
            where: {
                status: { in: ["SENT", "FAILED"] },
                ...(userId ? { userId } : {}),
            },
            orderBy: { sentAt: "desc" },
        });
    }

    /**
     * Recovery on Restart
     * 
     * This function should be called when the server starts.
     * It finds all SCHEDULED jobs that haven't been processed yet
     * and re-adds them to the BullMQ queue.
     * 
     * WHY THIS WORKS:
     * - BullMQ stores jobs in Redis, which persists across restarts
     * - But if Redis was also restarted, jobs would be lost
     * - Postgres is the source of truth
     * - This function syncs Postgres -> Redis queue
     */
    static async recoverPendingJobs() {
        console.log("[Recovery] Checking for pending jobs...");

        const pendingJobs = await prisma.emailJob.findMany({
            where: {
                status: { in: ["SCHEDULED", "PROCESSING"] },
            },
        });

        console.log(`[Recovery] Found ${pendingJobs.length} pending jobs`);

        for (const job of pendingJobs) {
            // Reset PROCESSING back to SCHEDULED (was interrupted)
            if (job.status === "PROCESSING") {
                await prisma.emailJob.update({
                    where: { id: job.id },
                    data: { status: "SCHEDULED" },
                });
            }

            // Calculate remaining delay
            const delayMs = job.scheduledAt.getTime() - Date.now();

            // Check if job already exists in queue
            const existingJob = await emailQueue.getJob(job.id);
            if (!existingJob) {
                // Re-add to queue
                await emailQueue.add(
                    "send-email",
                    { emailJobId: job.id },
                    {
                        delay: delayMs > 0 ? delayMs : 0,
                        jobId: job.id,
                    }
                );
                console.log(`[Recovery] Re-queued job ${job.id}`);
            }
        }

        console.log("[Recovery] Complete");
        return pendingJobs.length;
    }
}

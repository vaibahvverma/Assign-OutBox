/**
 * Email Controller
 * 
 * HTTP endpoints for email scheduling and management.
 * 
 * ENDPOINTS:
 * - POST /api/schedule - Schedule single email
 * - POST /api/schedule/bulk - Schedule multiple emails
 * - GET /api/emails - Get all emails
 * - GET /api/emails/scheduled - Get scheduled emails only
 * - GET /api/emails/sent - Get sent emails only
 */

import { Request, Response } from "express";
import { z } from "zod";
import { EmailService } from "../services/emailService";
import { getRateLimitStatus } from "../lib/rateLimiter";

// Validation schemas
const scheduleSchema = z.object({
    recipient: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1),
    scheduledAt: z.string().optional(),
    delay: z.number().optional(),
});

const bulkScheduleSchema = z.object({
    recipients: z.array(z.string().email()).min(1),
    subject: z.string().min(1),
    body: z.string().min(1),
    startTime: z.string(), // ISO date string
    delayBetweenEmails: z.number().default(2000), // Default 2 seconds
    hourlyLimit: z.number().default(50),
});

/**
 * Schedule a single email
 */
export const scheduleEmail = async (req: Request, res: Response) => {
    try {
        const validatedData = scheduleSchema.parse(req.body);

        const emailJob = await EmailService.scheduleEmail(validatedData);

        res.json({
            success: true,
            jobId: emailJob.id,
            scheduledAt: emailJob.scheduledAt,
            message: "Email scheduled successfully"
        });
    } catch (error: any) {
        console.error("[Controller] Schedule error:", error);

        if (error.name === "ZodError") {
            res.status(400).json({ error: "Validation error", details: error.errors });
        } else {
            res.status(500).json({ error: "Failed to schedule email" });
        }
    }
};

/**
 * Schedule multiple emails in bulk
 */
export const scheduleBulkEmails = async (req: Request, res: Response) => {
    try {
        const validatedData = bulkScheduleSchema.parse(req.body);

        const result = await EmailService.scheduleBulkEmails({
            ...validatedData,
            startTime: new Date(validatedData.startTime),
        });

        res.json({
            success: true,
            totalScheduled: result.totalScheduled,
            firstSendAt: result.firstSendAt,
            lastSendAt: result.lastSendAt,
            message: `${result.totalScheduled} emails scheduled successfully`
        });
    } catch (error: any) {
        console.error("[Controller] Bulk schedule error:", error);

        if (error.name === "ZodError") {
            res.status(400).json({ error: "Validation error", details: error.errors });
        } else {
            res.status(500).json({ error: "Failed to schedule emails" });
        }
    }
};

/**
 * Get all emails
 */
export const getEmails = async (req: Request, res: Response) => {
    try {
        const emails = await EmailService.getAllEmails();
        res.json(emails);
    } catch (error) {
        console.error("[Controller] Get emails error:", error);
        res.status(500).json({ error: "Failed to fetch emails" });
    }
};

/**
 * Get scheduled emails only
 */
export const getScheduledEmails = async (req: Request, res: Response) => {
    try {
        const emails = await EmailService.getScheduledEmails();
        res.json(emails);
    } catch (error) {
        console.error("[Controller] Get scheduled error:", error);
        res.status(500).json({ error: "Failed to fetch scheduled emails" });
    }
};

/**
 * Get sent emails only
 */
export const getSentEmails = async (req: Request, res: Response) => {
    try {
        const emails = await EmailService.getSentEmails();
        res.json(emails);
    } catch (error) {
        console.error("[Controller] Get sent error:", error);
        res.status(500).json({ error: "Failed to fetch sent emails" });
    }
};

/**
 * Get current rate limit status
 */
export const getRateLimits = async (req: Request, res: Response) => {
    try {
        const senderId = req.query.senderId as string || "demo@user.com";
        const status = await getRateLimitStatus(senderId);
        res.json(status);
    } catch (error) {
        console.error("[Controller] Rate limit error:", error);
        res.status(500).json({ error: "Failed to fetch rate limits" });
    }
};

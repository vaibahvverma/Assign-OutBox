/**
 * API Routes
 */

import { Router } from "express";
import {
    scheduleEmail,
    scheduleBulkEmails,
    getEmails,
    getScheduledEmails,
    getSentEmails,
    getRateLimits,
} from "../controllers/emailController";

const router = Router();

// Email Scheduling
router.post("/schedule", scheduleEmail);
router.post("/schedule/bulk", scheduleBulkEmails);

// Email Listing
router.get("/emails", getEmails);
router.get("/emails/scheduled", getScheduledEmails);
router.get("/emails/sent", getSentEmails);

// Rate Limits
router.get("/rate-limits", getRateLimits);

export default router;

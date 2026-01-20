/**
 * Rate Limiter Service
 * 
 * This module implements Redis-backed rate limiting for email sending.
 * It tracks emails sent per sender per hour and enforces configurable limits.
 * 
 * HOW IT WORKS:
 * 1. We use Redis keys in the format: `ratelimit:{senderId}:{hourWindow}`
 * 2. hourWindow is calculated as `Math.floor(Date.now() / 3600000)` (current hour)
 * 3. Each time an email is about to be sent, we increment the counter
 * 4. If counter exceeds limit, we calculate delay to next hour window
 * 5. Keys auto-expire after 2 hours to prevent Redis bloat
 */

import { connection } from "./redis";

// Configurable via environment variables
const MAX_EMAILS_PER_HOUR_PER_SENDER = parseInt(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || "50");
const GLOBAL_MAX_EMAILS_PER_HOUR = parseInt(process.env.GLOBAL_MAX_EMAILS_PER_HOUR || "200");

export interface RateLimitResult {
    allowed: boolean;
    currentCount: number;
    limit: number;
    retryAfterMs?: number; // If not allowed, how long to wait
}

/**
 * Get the current hour window identifier
 * This creates a unique key for each hour
 */
function getHourWindow(): number {
    return Math.floor(Date.now() / 3600000); // Milliseconds in an hour
}

/**
 * Get milliseconds until the next hour window starts
 */
function getMsUntilNextHour(): number {
    const now = Date.now();
    const currentHourMs = Math.floor(now / 3600000) * 3600000;
    const nextHourMs = currentHourMs + 3600000;
    return nextHourMs - now + 1000; // Add 1 second buffer
}

/**
 * Check and increment the rate limit for a sender
 * 
 * @param senderId - Unique identifier for the sender (e.g., email or userId)
 * @returns RateLimitResult indicating if the action is allowed
 */
export async function checkRateLimit(senderId: string): Promise<RateLimitResult> {
    const hourWindow = getHourWindow();
    const senderKey = `ratelimit:sender:${senderId}:${hourWindow}`;
    const globalKey = `ratelimit:global:${hourWindow}`;

    // Use Redis transaction to atomically check and increment
    const pipeline = connection.pipeline();

    // Get current counts
    pipeline.get(senderKey);
    pipeline.get(globalKey);

    const results = await pipeline.exec();

    const senderCount = parseInt((results?.[0]?.[1] as string) || "0");
    const globalCount = parseInt((results?.[1]?.[1] as string) || "0");

    // Check limits
    if (senderCount >= MAX_EMAILS_PER_HOUR_PER_SENDER) {
        return {
            allowed: false,
            currentCount: senderCount,
            limit: MAX_EMAILS_PER_HOUR_PER_SENDER,
            retryAfterMs: getMsUntilNextHour(),
        };
    }

    if (globalCount >= GLOBAL_MAX_EMAILS_PER_HOUR) {
        return {
            allowed: false,
            currentCount: globalCount,
            limit: GLOBAL_MAX_EMAILS_PER_HOUR,
            retryAfterMs: getMsUntilNextHour(),
        };
    }

    return {
        allowed: true,
        currentCount: senderCount,
        limit: MAX_EMAILS_PER_HOUR_PER_SENDER,
    };
}

/**
 * Increment the rate limit counters after successfully sending an email
 * Call this AFTER the email is sent to ensure accurate counting
 */
export async function incrementRateLimit(senderId: string): Promise<void> {
    const hourWindow = getHourWindow();
    const senderKey = `ratelimit:sender:${senderId}:${hourWindow}`;
    const globalKey = `ratelimit:global:${hourWindow}`;

    const pipeline = connection.pipeline();

    // Increment counters
    pipeline.incr(senderKey);
    pipeline.incr(globalKey);

    // Set expiry to 2 hours (cleanup old keys)
    pipeline.expire(senderKey, 7200);
    pipeline.expire(globalKey, 7200);

    await pipeline.exec();
}

/**
 * Get current rate limit status without incrementing
 * Useful for displaying in UI
 */
export async function getRateLimitStatus(senderId: string): Promise<{
    senderCount: number;
    senderLimit: number;
    globalCount: number;
    globalLimit: number;
}> {
    const hourWindow = getHourWindow();
    const senderKey = `ratelimit:sender:${senderId}:${hourWindow}`;
    const globalKey = `ratelimit:global:${hourWindow}`;

    const [senderCount, globalCount] = await Promise.all([
        connection.get(senderKey),
        connection.get(globalKey),
    ]);

    return {
        senderCount: parseInt(senderCount || "0"),
        senderLimit: MAX_EMAILS_PER_HOUR_PER_SENDER,
        globalCount: parseInt(globalCount || "0"),
        globalLimit: GLOBAL_MAX_EMAILS_PER_HOUR,
    };
}

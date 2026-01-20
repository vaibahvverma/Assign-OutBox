/**
 * Configuration Module
 * 
 * Centralizes all configurable values for the email scheduler.
 * All values can be overridden via environment variables.
 */

import dotenv from "dotenv";
dotenv.config();

export const config = {
    // Server
    port: parseInt(process.env.PORT || "4000"),

    // Database
    databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/outbox",

    // Redis
    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: parseInt(process.env.REDIS_PORT || "6379"),

    // Worker Configuration
    workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || "5"),

    // Rate Limiting
    maxEmailsPerHourPerSender: parseInt(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || "50"),
    globalMaxEmailsPerHour: parseInt(process.env.GLOBAL_MAX_EMAILS_PER_HOUR || "200"),

    // Delay between emails (in milliseconds)
    // This mimics provider throttling (e.g., 2 seconds between sends)
    minDelayBetweenEmails: parseInt(process.env.MIN_DELAY_BETWEEN_EMAILS || "2000"),

    // Google OAuth
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

    // Frontend URL for CORS
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

export default config;

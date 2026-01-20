import IORedis from "ioredis";

// Support both REDIS_URL (for Upstash/cloud) and individual host/port (for local)
const redisUrl = process.env.REDIS_URL;

let connection: IORedis;

if (redisUrl) {
    // Use REDIS_URL for cloud Redis (Upstash, Redis Cloud, etc.)
    // For Upstash, use rediss:// (with TLS)
    connection = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        tls: redisUrl.startsWith("rediss://") ? {} : undefined,
    });
} else {
    // Use host/port for local development
    connection = new IORedis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        maxRetriesPerRequest: null,
    });
}

export { connection };

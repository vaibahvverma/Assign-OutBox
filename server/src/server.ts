/**
 * Server Entry Point
 * 
 * Main Express server setup with:
 * - CORS for frontend
 * - API routes
 * - Worker startup
 * - Job recovery on restart
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env first
dotenv.config();

import router from "./routes";
import { EmailService } from "./services/emailService";
import "./worker/emailWorker"; // Start worker

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - Allow frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());

// API Routes
app.use("/api", router);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, async () => {
    console.log(`[Server] Running on port ${PORT}`);

    // Recover pending jobs on startup
    // This ensures jobs aren't lost if server was restarted
    try {
        const recoveredCount = await EmailService.recoverPendingJobs();
        console.log(`[Server] Recovered ${recoveredCount} pending jobs`);
    } catch (error) {
        console.error("[Server] Recovery failed:", error);
    }
});

export default app;

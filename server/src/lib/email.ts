/**
 * Email Service
 * 
 * Handles sending emails via Ethereal (fake SMTP for testing).
 * In production, replace with real SMTP provider (SendGrid, AWS SES, etc.)
 * 
 * ETHEREAL EMAIL:
 * - Creates test account on-the-fly if credentials not provided
 * - Provides preview URLs to view sent emails in browser
 * - Perfect for development and testing
 */

import nodemailer from "nodemailer";

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

interface SendEmailResult {
    messageId: string;
    previewUrl: string | false;
}

// Cache the transporter to avoid creating new accounts every time
let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
    if (cachedTransporter) {
        return cachedTransporter;
    }

    // Check for pre-configured SMTP credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        cachedTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Create Ethereal test account
        console.log("[Email] Creating Ethereal test account...");
        const testAccount = await nodemailer.createTestAccount();

        cachedTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log(`[Email] Ethereal account created: ${testAccount.user}`);
    }

    return cachedTransporter;
}

/**
 * Send an email
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const { to, subject, html, from = '"OutBox Scheduler" <scheduler@outbox.io>' } = params;

    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`[Email] Sent: ${info.messageId}`);
    if (previewUrl) {
        console.log(`[Email] Preview: ${previewUrl}`);
    }

    return {
        messageId: info.messageId,
        previewUrl: previewUrl,
    };
}

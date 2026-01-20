/**
 * API Client
 * 
 * Centralized API calls to the backend.
 * Provides type-safe functions for all endpoints.
 */

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Types matching backend responses
export interface EmailJob {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    status: "SCHEDULED" | "PROCESSING" | "SENT" | "FAILED";
    scheduledAt: string;
    sentAt: string | null;
    failedAt: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        email: string;
        name: string | null;
    };
}

export interface ScheduleEmailRequest {
    recipient: string;
    subject: string;
    body: string;
    scheduledAt?: string;
    delay?: number;
}

export interface BulkScheduleRequest {
    recipients: string[];
    subject: string;
    body: string;
    startTime: string;
    delayBetweenEmails: number;
    hourlyLimit: number;
}

export interface BulkScheduleResponse {
    success: boolean;
    totalScheduled: number;
    firstSendAt: string;
    lastSendAt: string;
    message: string;
}

export interface RateLimitStatus {
    senderCount: number;
    senderLimit: number;
    globalCount: number;
    globalLimit: number;
}

// API Functions

export async function scheduleEmail(data: ScheduleEmailRequest) {
    const response = await api.post<{ success: boolean; jobId: string; message: string }>("/schedule", data);
    return response.data;
}

export async function scheduleBulkEmails(data: BulkScheduleRequest) {
    const response = await api.post<BulkScheduleResponse>("/schedule/bulk", data);
    return response.data;
}

export async function getAllEmails(): Promise<EmailJob[]> {
    const response = await api.get<EmailJob[]>("/emails");
    return response.data;
}

export async function getScheduledEmails(): Promise<EmailJob[]> {
    const response = await api.get<EmailJob[]>("/emails/scheduled");
    return response.data;
}

export async function getSentEmails(): Promise<EmailJob[]> {
    const response = await api.get<EmailJob[]>("/emails/sent");
    return response.data;
}

export async function getRateLimitStatus(): Promise<RateLimitStatus> {
    const response = await api.get<RateLimitStatus>("/rate-limits");
    return response.data;
}

export default api;

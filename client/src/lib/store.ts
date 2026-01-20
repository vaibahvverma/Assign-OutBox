/**
 * Email Store (Zustand)
 * 
 * Global state management for emails.
 * Handles loading, caching, and refreshing email data.
 */

import { create } from "zustand";
import { EmailJob, getScheduledEmails, getSentEmails } from "./api";

interface EmailStore {
    // State
    scheduledEmails: EmailJob[];
    sentEmails: EmailJob[];
    isLoadingScheduled: boolean;
    isLoadingSent: boolean;
    error: string | null;

    // Actions
    fetchScheduledEmails: () => Promise<void>;
    fetchSentEmails: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

export const useEmailStore = create<EmailStore>((set, get) => ({
    scheduledEmails: [],
    sentEmails: [],
    isLoadingScheduled: false,
    isLoadingSent: false,
    error: null,

    fetchScheduledEmails: async () => {
        set({ isLoadingScheduled: true, error: null });
        try {
            const emails = await getScheduledEmails();
            set({ scheduledEmails: emails, isLoadingScheduled: false });
        } catch (error: any) {
            set({
                error: error.message || "Failed to fetch scheduled emails",
                isLoadingScheduled: false
            });
        }
    },

    fetchSentEmails: async () => {
        set({ isLoadingSent: true, error: null });
        try {
            const emails = await getSentEmails();
            set({ sentEmails: emails, isLoadingSent: false });
        } catch (error: any) {
            set({
                error: error.message || "Failed to fetch sent emails",
                isLoadingSent: false
            });
        }
    },

    refreshAll: async () => {
        await Promise.all([
            get().fetchScheduledEmails(),
            get().fetchSentEmails(),
        ]);
    },
}));

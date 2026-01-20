"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Clock, Plus, Filter, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEmailStore } from "@/lib/store";
import { ComposeEmailModal } from "@/components/ComposeEmailModal";
import { EmailsTable } from "@/components/EmailsTable";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    // Get state and actions from Zustand store
    const {
        scheduledEmails,
        sentEmails,
        isLoadingScheduled,
        isLoadingSent,
        fetchScheduledEmails,
        fetchSentEmails,
        refreshAll,
    } = useEmailStore();

    // Fetch data on mount
    useEffect(() => {
        fetchScheduledEmails();
        fetchSentEmails();
    }, [fetchScheduledEmails, fetchSentEmails]);

    const isLoading = activeTab === "scheduled" ? isLoadingScheduled : isLoadingSent;
    const emails = activeTab === "scheduled" ? scheduledEmails : sentEmails;

    // Map backend data to table format
    const tableEmails = emails.map(email => ({
        id: email.id,
        email: email.recipient,
        subject: email.subject,
        time: activeTab === "scheduled"
            ? new Date(email.scheduledAt).toLocaleString()
            : email.sentAt ? new Date(email.sentAt).toLocaleString() : "-",
        status: email.status.toLowerCase() as "scheduled" | "sent" | "failed",
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("scheduled")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === "scheduled" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                        )}
                    >
                        <Clock className="w-4 h-4" />
                        Scheduled
                        <span className="ml-1 bg-gray-200 text-gray-700 text-[10px] px-1.5 rounded-full">
                            {scheduledEmails.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("sent")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === "sent" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                        )}
                    >
                        <Send className="w-4 h-4" />
                        Sent
                        <span className="ml-1 bg-green-100 text-green-700 text-[10px] px-1.5 rounded-full">
                            {sentEmails.length}
                        </span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={refreshAll} disabled={isLoading}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button className="bg-[#00B955] hover:bg-[#00A04A]" onClick={() => setIsComposeOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Compose
                    </Button>
                </div>
            </div>

            <ComposeEmailModal
                open={isComposeOpen}
                onOpenChange={setIsComposeOpen}
                onSuccess={() => {
                    setIsComposeOpen(false);
                    refreshAll();
                }}
            />

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : tableEmails.length > 0 ? (
                        <EmailsTable emails={tableEmails} />
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {activeTab === "scheduled" ? (
                                    <Clock className="w-8 h-8 text-gray-400" />
                                ) : (
                                    <Send className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-black">No {activeTab} emails</h3>
                            <p className="max-w-sm mx-auto mt-2 text-sm">
                                You haven't {activeTab} any emails yet. Click on "Compose" to get started.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

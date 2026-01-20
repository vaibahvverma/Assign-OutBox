"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { scheduleBulkEmails, scheduleEmail } from "@/lib/api";
import toast from "react-hot-toast";

interface ComposeEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ComposeEmailModal({ open, onOpenChange, onSuccess }: ComposeEmailModalProps) {
    // Form state
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [recipients, setRecipients] = useState<string[]>([]);
    const [singleRecipient, setSingleRecipient] = useState("");
    const [delayBetweenEmails, setDelayBetweenEmails] = useState(2);
    const [hourlyLimit, setHourlyLimit] = useState(50);
    const [scheduledTime, setScheduledTime] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Parse CSV/Text file for email addresses
     */
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;

            // Parse emails from text (supports CSV, newline, comma separated)
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const matches = text.match(emailRegex) || [];

            // Remove duplicates
            const uniqueEmails = [...new Set(matches)];
            setRecipients(uniqueEmails);
        };
        reader.readAsText(file);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const startTime = scheduledTime
                ? new Date(scheduledTime).toISOString()
                : new Date().toISOString();

            if (recipients.length > 0) {
                // Bulk scheduling
                await scheduleBulkEmails({
                    recipients,
                    subject,
                    body,
                    startTime,
                    delayBetweenEmails: delayBetweenEmails * 1000, // Convert to ms
                    hourlyLimit,
                });
            } else if (singleRecipient) {
                // Single email
                await scheduleEmail({
                    recipient: singleRecipient,
                    subject,
                    body,
                    scheduledAt: startTime,
                });
            } else {
                throw new Error("Please add at least one recipient");
            }

            // Reset form
            setSubject("");
            setBody("");
            setRecipients([]);
            setSingleRecipient("");

            toast.success(recipients.length > 0
                ? `${recipients.length} emails scheduled!`
                : "Email scheduled successfully!");
            onSuccess?.();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || "Failed to schedule emails";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter(r => r !== email));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl font-medium">Compose New Email</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            className="bg-[#00B955] hover:bg-[#00A04A] text-white"
                            onClick={handleSubmit}
                            disabled={isLoading || (!singleRecipient && recipients.length === 0)}
                        >
                            {isLoading ? "Scheduling..." : "Send Later"}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* From */}
                    <div className="flex items-center gap-4">
                        <label className="w-12 text-sm font-medium text-gray-500">From</label>
                        <div className="bg-gray-100 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                            oliver.brown@domain.io
                            <ChevronDownIcon className="w-4 h-4 opacity-50" />
                        </div>
                    </div>

                    {/* To */}
                    <div className="flex items-start gap-4 border-b pb-4">
                        <label className="w-12 text-sm font-medium text-gray-500 pt-2">To</label>
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {recipients.slice(0, 3).map(email => (
                                    <span
                                        key={email}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                                    >
                                        {email}
                                        <button onClick={() => removeRecipient(email)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                                {recipients.length > 3 && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        +{recipients.length - 3} more
                                    </span>
                                )}
                            </div>
                            <Input
                                placeholder="recipient@example.com"
                                className="border-none shadow-none focus-visible:ring-0 px-0 h-auto"
                                value={singleRecipient}
                                onChange={(e) => setSingleRecipient(e.target.value)}
                            />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.txt"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#00B955] text-xs font-medium whitespace-nowrap flex items-center gap-1 hover:underline"
                        >
                            <UploadIcon className="w-3 h-3" />
                            Upload List
                            {recipients.length > 0 && ` (${recipients.length})`}
                        </button>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-4 border-b pb-4">
                        <label className="w-12 text-sm font-medium text-gray-500">Subject</label>
                        <Input
                            placeholder="Subject"
                            className="border-none shadow-none focus-visible:ring-0 px-0 h-auto font-medium"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    {/* Scheduled Time */}
                    <div className="flex items-center gap-4 border-b pb-4">
                        <label className="w-12 text-sm font-medium text-gray-500">When</label>
                        <Input
                            type="datetime-local"
                            className="w-auto"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />
                        <span className="text-xs text-gray-400">
                            Leave empty to send immediately
                        </span>
                    </div>

                    {/* Settings Row */}
                    <div className="flex items-center gap-8 py-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Delay between emails (sec)</span>
                            <Input
                                className="w-16 h-8 text-center"
                                type="number"
                                min="1"
                                value={delayBetweenEmails}
                                onChange={(e) => setDelayBetweenEmails(parseInt(e.target.value) || 2)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Hourly Limit</span>
                            <Input
                                className="w-16 h-8 text-center"
                                type="number"
                                min="1"
                                value={hourlyLimit}
                                onChange={(e) => setHourlyLimit(parseInt(e.target.value) || 50)}
                            />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="min-h-[150px]">
                        <textarea
                            placeholder="Type your email body here..."
                            className="w-full h-full min-h-[150px] text-sm text-gray-700 resize-none border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00B955]"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-3 border-t pt-4 text-gray-400">
                        <BoldIcon className="w-4 h-4 cursor-pointer hover:text-black" />
                        <ItalicIcon className="w-4 h-4 cursor-pointer hover:text-black" />
                        <UnderlineIcon className="w-4 h-4 cursor-pointer hover:text-black" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Icon Components
function ChevronDownIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function UploadIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

function BoldIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8" /><path d="M15 20a4 4 0 0 0 0-8H6v8Z" /></svg>;
}

function ItalicIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>;
}

function UnderlineIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" /></svg>;
}

"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface EmailJob {
    id: string;
    email: string;
    subject: string;
    status: "scheduled" | "sent" | "failed";
    time: string;
}

interface EmailsTableProps {
    emails: EmailJob[];
}

export function EmailsTable({ emails }: EmailsTableProps) {
    if (emails.length === 0) {
        return null; // Handle empty state in parent
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {emails.map((email) => (
                    <TableRow key={email.id}>
                        <TableCell>{email.email}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>{email.time}</TableCell>
                        <TableCell>
                            <Badge
                                variant={email.status === "failed" ? "destructive" : "secondary"}
                                className={
                                    email.status === "sent" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                        email.status === "scheduled" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" : ""
                                }
                            >
                                {email.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

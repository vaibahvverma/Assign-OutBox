"use client";

import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Show loading state
    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin w-8 h-8 border-4 border-[#00B955] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b h-16 flex items-center px-6 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-black text-white p-1 rounded font-bold text-xl tracking-tighter">
                        ONG
                    </div>
                </div>

                <div className="flex-1 max-w-xl mx-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search"
                        className="pl-9 bg-gray-50 border-none h-9 focus-visible:ring-1"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-3 pl-4 border-l">
                        <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            {session.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#00B955] text-white text-sm font-bold">
                                    {session.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium leading-none">
                                {session.user?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {session.user?.email}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">{children}</main>
        </div>
    );
}

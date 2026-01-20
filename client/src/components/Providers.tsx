"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        // @ts-expect-error - React 19 compatibility issue with next-auth
        <SessionProvider>
            {children}
            <Toaster position="top-right" />
        </SessionProvider>
    );
}

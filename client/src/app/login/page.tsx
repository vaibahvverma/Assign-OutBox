"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="animate-spin w-8 h-8 border-4 border-[#00B955] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
            <Card className="w-[400px]">
                <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <Button
                        variant="outline"
                        className="w-full bg-[#E9FBF0] text-black border-none hover:bg-[#d6f0df] py-6 rounded-md"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5 mr-2"
                            alt="Google"
                        />
                        Login with Google
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                or sign up through email
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email ID"
                            className="bg-gray-100 border-none h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            className="bg-gray-100 border-none h-12"
                        />
                    </div>
                    <Button className="w-full h-12 bg-[#00B955] hover:bg-[#00A04A] text-white">
                        Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

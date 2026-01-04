"use client"

import { useScrollTop } from "@/shared/hooks/use-scroll-top";
import { ModeToggle } from "@/shared/ui/mode-toggle";
import { cn } from "@/shared/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/src/app/providers/auth-provider";
import Link from "next/link";

export const Navbar = () => {
    const { user, isLoading, logout } = useAuth();

    return (
        <div className={cn("z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",useScrollTop() && "border-b shadow-sm")}>
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {!user && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/home/signIn">
                                Log in
                            </Link>
                        </Button>

                        <Button size="sm" asChild>
                            <Link href="/signup">
                                Get Jotion Free
                            </Link>
                        </Button>
                    </>)}
                {user && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Enter Jotion
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            Logout
                        </Button>
                    </>
                )}
                <ModeToggle/>
            </div>

        </div>
    );
}
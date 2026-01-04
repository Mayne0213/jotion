"use client";
import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/src/app/providers/auth-provider";
import Link from "next/link";

export const Heading = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your ideas, Docs, Plans, Unified. Welcome to{" "}
        <span className="underline">Jotion</span>
      </h1>
      <h1 className="text-base sm:text-xl md:text-2xl font-medium">
        Jotion is the connected workspace where <br />
        better, faster work happens.
      </h1>
      {user && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Jotion
            <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
          </Link>
        </Button>
      )}
      {!user && !isLoading && (
        <Button asChild>
          <Link href="/home/signUp">
            Get Jotion Free
            <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
          </Link>
        </Button>
      )}
    </div>
  );
};

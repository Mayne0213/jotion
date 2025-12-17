"use client";

import { Spinner } from "@/shared/ui/spinner";
import { useRouter } from "next/navigation";
import { Navigation } from "@/widgets/documents";
import { useAuth } from "@/src/app/providers/auth-provider";
import { useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation/>
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

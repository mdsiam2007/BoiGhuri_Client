"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface GuestRouteGuardProps {
  children: React.ReactNode;
}

export default function GuestRouteGuard({ children }: GuestRouteGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session, isPending } = useSession();

  const user = session?.user;

  useEffect(() => {
    // If user is already logged in with an active session, redirect to home or callbackUrl
    if (!isPending && user) {
      router.replace(callbackUrl);
    }
  }, [user, isPending, callbackUrl, router]);

  // While verifying session, show loader and DO NOT flash auth forms
  if (isPending) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          সেশন যাচাই করা হচ্ছে...
        </p>
      </div>
    );
  }

  // If already authenticated, render null while redirection takes place
  if (user) {
    return null;
  }

  return <>{children}</>;
}


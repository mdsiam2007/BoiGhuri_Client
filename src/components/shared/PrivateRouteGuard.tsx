"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { BookOpen, Loader2 } from "lucide-react";
import { syncJwtToken } from "@/lib/api";

interface PrivateRouteGuardProps {
  children: React.ReactNode;
}

export default function PrivateRouteGuard({ children }: PrivateRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  useEffect(() => {
    // Only redirect when session has completely finished loading
    if (!isPending && !user) {
      const callback = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${callback}`);
    } else if (user) {
      // Sync JWT token with backend whenever session is active
      syncJwtToken({
        email: user.email,
        name: user.name || "User",
        image: user.image || "",
      });
    }
  }, [user, isPending, pathname, router]);

  // While restoring session on reload: show graceful loading screen, DO NOT redirect
  if (isPending) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-background">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <BookOpen className="h-7 w-7" />
          </div>
          <Loader2 className="h-6 w-6 text-primary animate-spin absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          নিরাপদ সংযোগ যাচাই করা হচ্ছে...
        </p>
      </div>
    );
  }

  // If not logged in after check, render null while redirect happens
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

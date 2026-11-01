import { Suspense } from "react";
import GuestRouteGuard from "@/components/shared/GuestRouteGuard";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <GuestRouteGuard>{children}</GuestRouteGuard>
    </Suspense>
  );
}


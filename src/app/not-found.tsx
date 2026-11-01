"use client";

import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated 404 Book Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-lg border border-primary/20">
          <BookOpen className="h-12 w-12 animate-pulse" />
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            দুঃখিত, আপনি যে বই বা পৃষ্ঠাটি খুঁজছেন সেটি লাইব্রেরির ক্যাটালগে নেই অথবা ঠিকানাটি ভুল হয়েছে।
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-xl gap-2 font-semibold">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>হোমে ফিরে যান (Back to Home)</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl gap-2">
            <Link href="/books">
              <ArrowLeft className="h-4 w-4" />
              <span>সব বই দেখুন</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


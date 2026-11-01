"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BookMarked, Calendar, RotateCcw, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrivateRouteGuard from "@/components/shared/PrivateRouteGuard";
import { IBorrow } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

export default function MyBorrowsPage() {
  return (
    <PrivateRouteGuard>
      <MyBorrowsContent />
    </PrivateRouteGuard>
  );
}

function MyBorrowsContent() {
  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BoiGhuri | ধার করা বই (My Borrows)";
  }, []);

  const fetchMyBorrows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/borrows");
      if (res.success && Array.isArray(res.data)) {
        setBorrows(res.data);
      }
    } catch (err) {
      console.error("Failed to load borrows:", err);
      toast.error("ধার করা বইয়ের তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBorrows();
  }, [fetchMyBorrows]);

  const handleReturnBook = async (borrowId: string, title: string) => {
    setReturningId(borrowId);
    const toastId = toast.loading(`"${title}" বইটি ফেরত প্রক্রিয়া চলছে...`);

    try {
      const res = await fetchWithAuth(`/borrows/${borrowId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success(res.message || "বইটি সফলভাবে ফেরত দেওয়া হয়েছে!", { id: toastId });
        setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
      } else {
        toast.error(res.message || "বই ফেরত দেওয়া যায়নি", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      toast.error(msg, { id: toastId });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <BookMarked className="h-3.5 w-3.5" />
            <span>আমার লাইব্রেরি কার্ড</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            ধার করা বইয়ের হিসাব (My Borrows)
          </h1>
          <p className="text-sm text-muted-foreground">
            আপনার বর্তমান ধার করা বইসমূহ দেখুন এবং পড়া শেষ হলে নির্ধারিত সময়ে ফেরত দিন।
          </p>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">ধার করা বইয়ের তালিকা লোড হচ্ছে...</p>
          </div>
        ) : borrows.length > 0 ? (
          <div className="border border-border/80 rounded-2xl overflow-hidden shadow-xs bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-4">বইয়ের বিবরণ</th>
                    <th className="px-6 py-4">ধার নেওয়ার তারিখ</th>
                    <th className="px-6 py-4">ফেরত দেওয়ার তারিখ</th>
                    <th className="px-6 py-4">অবস্থা (Status)</th>
                    <th className="px-6 py-4 text-right">কার্যক্রম (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {borrows.map((borrow) => {
                    const returnDateObj = new Date(borrow.returnDate);
                    const isOverdue = returnDateObj < new Date();

                    return (
                      <tr key={borrow._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={borrow.bookImage}
                              alt={borrow.bookTitle}
                              className="h-14 w-11 object-cover rounded-md border shadow-xs shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-foreground text-sm line-clamp-1">
                                {borrow.bookTitle}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                আইডি: {borrow.bookId.toString().slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>
                              {new Date(borrow.borrowDate).toLocaleDateString("bn-BD", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-semibold">
                          <span
                            className={
                              isOverdue
                                ? "text-destructive font-bold"
                                : "text-foreground"
                            }
                          >
                            {returnDateObj.toLocaleDateString("bn-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>ধার নেওয়া হয়েছে</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturnBook(borrow._id, borrow.bookTitle)}
                            disabled={returningId === borrow._id}
                            className="gap-2 font-semibold text-primary hover:bg-primary hover:text-primary-foreground border-primary/40 rounded-lg shadow-xs"
                          >
                            {returningId === borrow._id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>ফেরত হচ্ছে...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>ফেরত দিন (Return Book)</span>
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-card space-y-3">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">
              আপনার কাছে বর্তমানে কোনো ধার করা বই নেই!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              পছন্দের বই খুঁজে নিয়ে এখনই ধার নিতে পারেন এবং ঘরে বসেই জ্ঞানার্জন করুন।
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/books" className="gap-2">
                <span>বই ক্যাটালগ দেখুন</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


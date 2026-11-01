"use client";

import { useState } from "react";
import { Calendar, User, Mail, BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IBook, IUser } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook;
  user: IUser;
  onSuccess: (remainingCopies: number) => void;
}

export default function BorrowModal({
  isOpen,
  onClose,
  book,
  user,
  onSuccess,
}: BorrowModalProps) {
  // Default return date is 14 days from today
  const defaultReturnDate = new Date();
  defaultReturnDate.setDate(defaultReturnDate.getDate() + 14);
  const formattedDefaultDate = defaultReturnDate.toISOString().split("T")[0];

  const [returnDate, setReturnDate] = useState(formattedDefaultDate);
  const [submitting, setSubmitting] = useState(false);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!returnDate) {
      toast.error("অনুগ্রহ করে বই ফেরত দেওয়ার একটি তারিখ নির্বাচন করুন");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("ধার নেওয়ার অনুরোধ প্রক্রিয়াধীন...");

    try {
      const res = await fetchWithAuth("/borrows", {
        method: "POST",
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
        }),
      });

      if (res.success) {
        toast.success(res.message || "বইটি সফলভাবে ধার নেওয়া হয়েছে!", { id: toastId });
        onSuccess(res.remainingCopies);
        onClose();
      } else {
        toast.error(res.message || "বই ধার নেওয়া যায়নি", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>বই ধার নেওয়ার ফর্ম (Confirm Borrow)</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            বইটি ধার নিতে নিচের তথ্যগুলো যাচাই করুন এবং ফেরত দেওয়ার তারিখ নিশ্চিত করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleBorrow} className="space-y-4 pt-2">
          {/* Book Summary Card */}
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.image}
              alt={book.title}
              className="h-16 w-12 object-cover rounded-md border shadow-xs shrink-0"
            />
            <div className="text-xs space-y-0.5 truncate">
              <h4 className="font-bold text-foreground text-sm truncate">{book.title}</h4>
              <p className="text-muted-foreground truncate">{book.author}</p>
              <p className="text-emerald-600 font-semibold text-[11px]">
                বর্তমানে কপি অবশিষ্ট আছে: {book.totalCopies}টি
              </p>
            </div>
          </div>

          {/* User Name (Read-Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> ব্যবহারকারীর নাম (Read-only)
            </label>
            <Input
              type="text"
              value={user.name}
              disabled
              className="bg-muted text-muted-foreground font-medium cursor-not-allowed text-xs"
            />
          </div>

          {/* User Email (Read-Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> ইমেইল ঠিকানা (Read-only)
            </label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="bg-muted text-muted-foreground font-medium cursor-not-allowed text-xs"
            />
          </div>

          {/* Return Date Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> ফেরত দেওয়ার তারিখ (Return Date) *
            </label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              ডিফল্টভাবে ১৪ দিনের জন্য নির্ধারণ করা হয়েছে, প্রয়োজন অনুযায়ী পরিবর্তন করতে পারেন।
            </p>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto font-bold gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  প্রক্রিয়াধীন...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  ধার নিশ্চিত করুন (Confirm Borrow)
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


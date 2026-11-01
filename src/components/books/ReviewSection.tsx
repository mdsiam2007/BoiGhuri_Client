"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, MessageSquare, Edit3, Check, Loader2, User as UserIcon, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IReview, IUser, IBorrow } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");

interface ReviewSectionProps {
  bookId: string;
  currentUser?: IUser | null;
}

export default function ReviewSection({ bookId, currentUser }: ReviewSectionProps) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Borrow check state
  const [hasBorrowed, setHasBorrowed] = useState<boolean | null>(null);
  const [checkingBorrow, setCheckingBorrow] = useState<boolean>(false);

  // New Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/reviews?bookId=${bookId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
        setAverageRating(data.averageRating || 0);
      }
    } catch (err) {
      console.error("Failed to load reviews.:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  // Check if current user has borrowed this book
  const checkBorrowStatus = useCallback(async () => {
    if (!currentUser) {
      setHasBorrowed(false);
      return;
    }

    setCheckingBorrow(true);
    try {
      const res = await fetchWithAuth("/borrows");
      if (res.success && Array.isArray(res.data)) {
        const borrowed = res.data.some(
          (b: IBorrow) =>
            b.bookId === bookId ||
            (typeof b.bookId === "object" && (b.bookId as { _id?: string })?._id === bookId)
        );
        setHasBorrowed(borrowed);
      } else {
        setHasBorrowed(false);
      }
    } catch {
      setHasBorrowed(false);
    } finally {
      setCheckingBorrow(false);
    }
  }, [currentUser, bookId]);

  useEffect(() => {
    fetchReviews();
    checkBorrowStatus();
  }, [fetchReviews, checkBorrowStatus]);

  // Check if current user has already reviewed
  const userReview = currentUser
    ? reviews.find((r) => r.userEmail.toLowerCase() === currentUser.email?.toLowerCase())
    : null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error(
        language === "bn"
          ? "অনুগ্রহ করে আপনার মূল্যবান মতামত লিখুন"
          : "Please write your review comment"
      );
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      language === "bn" ? "রিভিউ জমা দেওয়া হচ্ছে..." : "Submitting review..."
    );

    try {
      const res = await fetchWithAuth("/reviews", {
        method: "POST",
        body: JSON.stringify({
          bookId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.success) {
        toast.success(
          res.message ||
          (language === "bn"
            ? "রিভিউ সফলভাবে যুক্ত হয়েছে!"
            : "Review submitted successfully!"),
          { id: toastId }
        );
        setComment("");
        fetchReviews();
      } else {
        toast.error(
          res.message ||
          (language === "bn" ? "রিভিউ যোগ করা যায়নি" : "Failed to add review"),
          { id: toastId }
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : language === "bn"
            ? "সমস্যা হয়েছে"
            : "An error occurred";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (!editComment.trim()) {
      toast.error(
        language === "bn" ? "মন্তব্য খালি রাখা যাবে না" : "Comment cannot be empty"
      );
      return;
    }

    setUpdating(true);
    const toastId = toast.loading(
      language === "bn" ? "রিভিউ আপডেট করা হচ্ছে..." : "Updating review..."
    );

    try {
      const res = await fetchWithAuth(`/reviews/${editingReview._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          rating: editRating,
          comment: editComment.trim(),
        }),
      });

      if (res.success) {
        toast.success(
          res.message ||
          (language === "bn"
            ? "রিভিউ সফলভাবে আপডেট করা হয়েছে!"
            : "Review updated successfully!"),
          { id: toastId }
        );
        setEditingReview(null);
        fetchReviews();
      } else {
        toast.error(
          res.message ||
          (language === "bn" ? "রিভিউ আপডেট করা যায়নি" : "Failed to update review"),
          { id: toastId }
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : language === "bn"
            ? "সমস্যা হয়েছে"
            : "An error occurred";
      toast.error(msg, { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-border space-y-8">
      {/* Section Header with Average Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>
              {language === "bn"
                ? `পাঠকদের রিভিউ ও মতামত (${reviews.length})`
                : `Reader Reviews (${reviews.length})`}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {language === "bn"
              ? "বইটি সম্পর্কে অন্যান্য পাঠকদের অভিজ্ঞতা ও রেটিং জানুন"
              : "Explore ratings and thoughts from other readers"}
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
            <div className="text-sm font-bold text-foreground">
              {averageRating} / 5.0
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Area */}
      {!currentUser ? (
        <div className="p-6 rounded-2xl bg-muted/40 border text-center space-y-3">
          <p className="text-sm font-medium text-foreground">
            {language === "bn"
              ? "আপনার মূল্যবান মতামত ও রেটিং দিতে অনুগ্রহ করে লগইন করুন।"
              : "Please login to submit your review and rating."}
          </p>
          <Button size="sm" asChild>
            <Link href={`/login?callbackUrl=/books/${bookId}`}>
              {language === "bn" ? "লগইন করুন" : "Login to Review"}
            </Link>
          </Button>
        </div>
      ) : userReview ? (
        /* If user already reviewed, show their review with Edit option */
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {language === "bn" ? "✓ আপনার দেওয়া রিভিউ:" : "✓ Your Review:"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingReview(userReview);
                setEditRating(userReview.rating);
                setEditComment(userReview.comment);
              }}
              className="text-xs gap-1.5 h-8 border-emerald-500/30"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{language === "bn" ? "রিভিউ পরিবর্তন করুন" : "Edit Review"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${s <= userReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
              />
            ))}
            <span className="text-xs font-bold text-foreground ml-2">
              {userReview.rating} {language === "bn" ? "স্টার" : "Stars"}
            </span>
            {userReview.isEdited && (
              <Badge variant="secondary" className="text-[10px] ml-2 text-muted-foreground font-normal">
                {language === "bn" ? "সম্পাদিত" : "Edited"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            &ldquo;{userReview.comment}&rdquo;
          </p>
        </div>
      ) : checkingBorrow ? (
        <div className="p-4 rounded-xl bg-muted/30 border flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>
            {language === "bn"
              ? "ধার নেওয়ার তথ্য যাচাই করা হচ্ছে..."
              : "Verifying borrow history..."}
          </span>
        </div>
      ) : !hasBorrowed ? (
        /* Must borrow before reviewing notice */
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2.5">
          <div className="h-10 w-10 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {language === "bn"
              ? "রিভিউ দেওয়ার জন্য বইটি ধার নেওয়া আবশ্যক"
              : "Must Borrow Book Before Reviewing"}
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {language === "bn"
              ? "আপনি এখনো বইটি ধার নেননি। প্রকৃত পাঠকদের নির্ভরযোগ্য অভিজ্ঞতার স্বার্থে, বইটি ধার নেওয়ার পরেই কেবল আপনি এতে রিভিউ ও রেটিং দিতে পারবেন।"
              : "You have not borrowed this book yet. To ensure authentic feedback, only readers who have borrowed the book can submit a review."}
          </p>
        </div>
      ) : (
        /* Fresh review submission form for users who have borrowed */
        <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-card border shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" />
            <span>
              {language === "bn"
                ? "বইটি সম্পর্কে আপনার রিভিউ লিখুন:"
                : "Write your review for this book:"}
            </span>
          </h4>

          {/* Interactive Star Selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">
              {language === "bn" ? "রেটিং নির্বাচন করুন:" : "Select Rating:"}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`h-6 w-6 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                      }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              ({rating} {language === "bn" ? "স্টার" : "Stars"})
            </span>
          </div>

          <Textarea
            placeholder={
              language === "bn"
                ? "বইটি পড়ে আপনার কেমন লাগল? লেখার মান ও বিষয়বস্তু সম্পর্কে অন্যদের জানান..."
                : "Share your reading experience, thoughts on the story, and recommendations..."
            }
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="text-sm"
          />

          <Button type="submit" disabled={submitting} size="sm" className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "bn" ? "জমা হচ্ছে..." : "Submitting..."}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {language === "bn" ? "রিভিউ প্রকাশ করুন" : "Submit Review"}
              </>
            )}
          </Button>
        </form>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-card border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              <span>{language === "bn" ? "রিভিউ পরিবর্তন করুন" : "Edit Review"}</span>
            </h4>

            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {language === "bn" ? "রেটিং:" : "Rating:"}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setEditRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${s <= editRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                rows={4}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                required
                className="text-sm"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingReview(null)}
                  disabled={updating}
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </Button>
                <Button type="submit" size="sm" disabled={updating}>
                  {updating
                    ? language === "bn"
                      ? "আপডেট হচ্ছে..."
                      : "Updating..."
                    : language === "bn"
                      ? "সংরক্ষণ করুন"
                      : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>
              {language === "bn" ? "রিভিউ লোড হচ্ছে..." : "Loading reviews..."}
            </span>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {rev.userName ? rev.userName[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      {rev.userName}
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString(
                        language === "bn" ? "bn-BD" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                      />
                    ))}
                  </div>
                  {rev.isEdited && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                      {language === "bn" ? "সম্পাদিত" : "Edited"}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6 italic">
            {language === "bn"
              ? "এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই লিখুন!"
              : "No reviews yet. Be the first to share your review!"}
          </p>
        )}
      </div>
    </section>
  );
}

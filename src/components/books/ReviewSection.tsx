"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, MessageSquare, Edit3, Check, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IReview, IUser } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface ReviewSectionProps {
  bookId: string;
  currentUser?: IUser | null;
}

export default function ReviewSection({ bookId, currentUser }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
      const res = await fetch(`${SERVER_URL}/reviews?bookId=${bookId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
        setAverageRating(data.averageRating || 0);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check if current user has already reviewed
  const userReview = currentUser
    ? reviews.find((r) => r.userEmail.toLowerCase() === currentUser.email?.toLowerCase())
    : null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("অনুগ্রহ করে আপনার মূল্যবান মতামত লিখুন");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("রিভিউ জমা দেওয়া হচ্ছে...");

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
        toast.success(res.message || "রিভিউ সফলভাবে যুক্ত হয়েছে!", { id: toastId });
        setComment("");
        fetchReviews();
      } else {
        toast.error(res.message || "রিভিউ যোগ করা যায়নি", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (!editComment.trim()) {
      toast.error("মন্তব্য খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("রিভিউ আপডেট করা হচ্ছে...");

    try {
      const res = await fetchWithAuth(`/reviews/${editingReview._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          rating: editRating,
          comment: editComment.trim(),
        }),
      });

      if (res.success) {
        toast.success(res.message || "রিভিউ সফলভাবে আপডেট করা হয়েছে!", { id: toastId });
        setEditingReview(null);
        fetchReviews();
      } else {
        toast.error(res.message || "রিভিউ আপডেট করা যায়নি", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
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
            <span>পাঠকদের রিভিউ ও মতামত ({reviews.length})</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            বইটি সম্পর্কে অন্যান্য পাঠকদের অভিজ্ঞতা ও রেটিং জানুন
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm font-bold text-foreground">
              {averageRating} / ৫.০
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Box */}
      {!currentUser ? (
        <div className="p-6 rounded-2xl bg-muted/40 border text-center space-y-3">
          <p className="text-sm font-medium text-foreground">
            আপনার মূল্যবান মতামত ও রেটিং দিতে অনুগ্রহ করে লগইন করুন।
          </p>
          <Button size="sm" asChild>
            <Link href={`/login?callbackUrl=/books/${bookId}`}>
              লগইন করুন (Login to Review)
            </Link>
          </Button>
        </div>
      ) : userReview ? (
        /* If user already reviewed, show their review with Edit option */
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ আপনার দেওয়া রিভিউ:
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
              <span>রিভিউ এডিট করুন (Edit)</span>
            </Button>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  s <= userReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs font-bold text-foreground ml-2">
              {userReview.rating} স্টার
            </span>
            {userReview.isEdited && (
              <Badge variant="secondary" className="text-[10px] ml-2 text-muted-foreground font-normal">
                (সম্পাদিত / edited)
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            &ldquo;{userReview.comment}&rdquo;
          </p>
        </div>
      ) : (
        /* Fresh review submission form */
        <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-card border shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-foreground">
            বইটি সম্পর্কে আপনার রিভিউ লিখুন:
          </h4>

          {/* Interactive Star Selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">রেটিং নির্বাচন করুন:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`h-6 w-6 ${
                      s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              ({rating} স্টার)
            </span>
          </div>

          <Textarea
            placeholder="বইটি পড়ে আপনার কেমন লাগল? লেখার মান ও বিষয়বস্তু সম্পর্কে অন্যদের জানান..."
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
                জমা হচ্ছে...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                রিভিউ প্রকাশ করুন
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
              <span>রিভিউ এডিট করুন</span>
            </h4>

            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">রেটিং:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setEditRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          s <= editRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
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
                  বাতিল
                </Button>
                <Button type="submit" size="sm" disabled={updating}>
                  {updating ? "আপডেট হচ্ছে..." : "সংরক্ষণ করুন"}
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
            <span>রিভিউ লোড হচ্ছে...</span>
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
                      {new Date(rev.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  {rev.isEdited && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                      (সম্পাদিত / edited)
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
            এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই লিখুন!
          </p>
        )}
      </div>
    </section>
  );
}

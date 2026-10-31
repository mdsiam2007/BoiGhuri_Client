"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { BookOpen, User, Calendar, BookMarked, ArrowLeft, Loader2, CheckCircle2, XCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrivateRouteGuard from "@/components/shared/PrivateRouteGuard";
import BorrowModal from "@/components/books/BorrowModal";
import ReviewSection from "@/components/books/ReviewSection";
import { IBook } from "@/types";
import toast from "react-hot-toast";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <PrivateRouteGuard>
      <BookDetailsContent id={resolvedParams.id} />
    </PrivateRouteGuard>
  );
}

function BookDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetch(`${SERVER_URL}/books/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setBook(result.data);
          document.title = `BoiGhuri | ${result.data.title}`;
        } else {
          toast.error("বইটি খুঁজে পাওয়া যায়নি");
          router.push("/books");
        }
      } catch (err) {
        console.error("Failed to load book:", err);
        toast.error("বই লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, router]);

  const handleBorrowSuccess = (remainingCopies: number) => {
    if (book) {
      setBook({ ...book, totalCopies: remainingCopies });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("লিঙ্ক কপি করা হয়েছে!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">বইয়ের বিস্তারিত তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const isAvailable = book.totalCopies > 0;

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
        {/* Back Link */}
        <div>
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/books">
              <ArrowLeft className="h-4 w-4" />
              <span>সকল বইয়ের তালিকায় ফিরে যান</span>
            </Link>
          </Button>
        </div>

        {/* Book Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-xl">
          {/* Cover Image Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {isAvailable ? (
                  <Badge className="bg-emerald-600 text-white font-medium shadow-md">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    উপলব্ধ ({book.totalCopies} কপি)
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="shadow-md">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Available
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="mt-4 gap-2 w-full max-w-sm rounded-xl text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>বন্ধুদের সাথে শেয়ার করুন</span>
            </Button>
          </div>

          {/* Book Info Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 w-fit inline-block">
                  {book.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {book.title}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{book.author}</span>
                </p>
              </div>

              {/* Status and Copies Card */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    সংগ্রহের অবস্থা:
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {isAvailable ? "ধার নেওয়ার জন্য প্রস্তুত" : "সব কপি ধার নেওয়া হয়েছে"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    অবশিষ্ট কপি:
                  </span>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {book.totalCopies} টি
                  </p>
                </div>
              </div>

              {/* Book Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  বইয়ের বিবরণ (Description):
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Contributor / Added By Info */}
              <div className="pt-4 border-t border-border/80 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>সংগ্রহে দিয়েছেন: <strong className="text-foreground">{book.userName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>যুক্ত করা হয়েছে: {new Date(book.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>
              </div>
            </div>

            {/* Borrow Action Button */}
            <div className="pt-4">
              {isAvailable ? (
                <Button
                  size="lg"
                  onClick={() => setBorrowModalOpen(true)}
                  className="w-full sm:w-auto font-bold rounded-xl px-10 shadow-lg shadow-primary/20 gap-2.5 transition-all hover:scale-105"
                >
                  <BookMarked className="h-5 w-5" />
                  <span>এই বইটি ধার নিন (Borrow This Book)</span>
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  variant="secondary"
                  className="w-full sm:w-auto font-semibold rounded-xl px-10 cursor-not-allowed opacity-60"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>বর্তমানে উপলব্ধ নেই (Not Available)</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Borrow Modal */}
        {user && (
          <BorrowModal
            isOpen={borrowModalOpen}
            onClose={() => setBorrowModalOpen(false)}
            book={book}
            user={{
              name: user.name || "User",
              email: user.email,
              image: user.image || "",
            }}
            onSuccess={handleBorrowSuccess}
          />
        )}

        {/* Review and Rating Section */}
        <ReviewSection
          bookId={book._id}
          currentUser={
            user
              ? {
                  name: user.name || "User",
                  email: user.email,
                  image: user.image || "",
                }
              : null
          }
        />
      </div>
    </div>
  );
}

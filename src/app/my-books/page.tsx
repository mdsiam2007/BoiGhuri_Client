"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { BookOpen, Edit, Trash2, PlusCircle, Eye, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PrivateRouteGuard from "@/components/shared/PrivateRouteGuard";
import EditBookModal from "@/components/books/EditBookModal";
import { IBook } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");

export default function MyBooksPage() {
  return (
    <PrivateRouteGuard>
      <MyBooksContent />
    </PrivateRouteGuard>
  );
}

function MyBooksContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<IBook | null>(null);

  // Delete Alert Dialog State
  const [deletingBook, setDeletingBook] = useState<IBook | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    document.title = "BoiGhuri | আমার বইসমূহ (My Books)";
  }, []);

  const fetchMyBooks = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/books?userEmail=${encodeURIComponent(user.email)}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setBooks(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch my books:", err);
      toast.error("বই লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  const handleUpdateSuccess = (updatedBook: IBook) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;

    setDeleteLoading(true);
    const toastId = toast.loading("বইটি মুছে ফেলা হচ্ছে...");

    try {
      const res = await fetchWithAuth(`/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success(res.message || "বইটি সফলভাবে মুছে ফেলা হয়েছে!", { id: toastId });
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        setDeletingBook(null);
      } else {
        toast.error(res.message || "মুছে ফেলা যায়নি", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      toast.error(msg, { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>আমার অবদান</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              আমার যোগ করা বইসমূহ (My Books)
            </h1>
            <p className="text-sm text-muted-foreground">
              আপনার দ্বারা লাইব্রেরিতে যুক্ত করা সকল বইয়ের ব্যবস্থাপনা ও এডিট করুন।
            </p>
          </div>

          <Button asChild className="gap-2 shadow-sm rounded-xl">
            <Link href="/add-book">
              <PlusCircle className="h-4 w-4" />
              <span>নতুন বই যোগ করুন</span>
            </Link>
          </Button>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">আপনার বই তালিকা লোড হচ্ছে...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="border border-border/80 rounded-2xl overflow-hidden shadow-xs bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-4">বইয়ের বিবরণ</th>
                    <th className="px-6 py-4">ক্যাটাগরি</th>
                    <th className="px-6 py-4">মোট কপি</th>
                    <th className="px-6 py-4">যোগ করার তারিখ</th>
                    <th className="px-6 py-4 text-right">কার্যক্রম (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-14 w-11 object-cover rounded-md border shadow-xs shrink-0"
                          />
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-foreground text-sm line-clamp-1">
                              {book.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="text-xs">
                          {book.category}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          {book.totalCopies} টি
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(book.createdAt).toLocaleDateString("bn-BD")}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="বিস্তারিত দেখুন"
                          >
                            <Link href={`/books/${book._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingBook(book)}
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 border-primary/30"
                            title="এডিট করুন"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeletingBook(book)}
                            className="h-8 w-8 "
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-card space-y-3">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">
              আপনি এখনো কোনো বই যোগ করেননি!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              নতুন বই যোগ করে অন্যান্য পাঠকদের সাথে আপনার প্রিয় বইয়ের সন্ধান শেয়ার করুন।
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/add-book">প্রথম বইটি যোগ করুন</Link>
            </Button>
          </div>
        )}

        {/* Edit Book Modal */}
        {editingBook && (
          <EditBookModal
            isOpen={Boolean(editingBook)}
            onClose={() => setEditingBook(null)}
            book={editingBook}
            onSuccess={handleUpdateSuccess}
          />
        )}

        {/* Custom Shadcn Delete Confirm Alert Dialog */}
        <AlertDialog
          open={Boolean(deletingBook)}
          onOpenChange={(open) => !open && setDeletingBook(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                আপনি কি নিশ্চিতভাবে &ldquo;{deletingBook?.title}&rdquo; বইটি লাইব্রেরি থেকে মুছে ফেলতে চান? এটি মুছে ফেললে আর পুনরুদ্ধার করা সম্ভব হবে না।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>বাতিল</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
              >
                {deleteLoading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}


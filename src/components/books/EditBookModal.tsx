"use client";

import { useState } from "react";
import { Edit3, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IBook, BookCategory } from "@/types";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook;
  onSuccess: (updatedBook: IBook) => void;
}

const categories: BookCategory[] = ["Fiction", "Science", "History", "Kids", "Others"];

export default function EditBookModal({
  isOpen,
  onClose,
  book,
  onSuccess,
}: EditBookModalProps) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState<BookCategory>(book.category);
  const [totalCopies, setTotalCopies] = useState<number>(book.totalCopies);
  const [image, setImage] = useState(book.image);
  const [description, setDescription] = useState(book.description);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim() || !image.trim()) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("বইয়ের তথ্য আপডেট করা হচ্ছে...");

    try {
      const res = await fetchWithAuth(`/books/${book._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          totalCopies: Number(totalCopies),
          image: image.trim(),
          description: description.trim(),
        }),
      });

      if (res.success && res.data) {
        toast.success(res.message || "বইটি সফলভাবে আপডেট হয়েছে!", { id: toastId });
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.message || "আপডেট করা যায়নি", { id: toastId });
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            <span>বইয়ের তথ্য সম্পাদন (Edit Book)</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            প্রয়োজনীয় পরিবর্তন করে সংরক্ষণ করুন
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              বইয়ের নাম *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                লেখকের নাম *
              </label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                ক্যাটাগরি *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                মোট কপি *
              </label>
              <Input
                type="number"
                min="0"
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(0, parseInt(e.target.value, 10) || 0))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                কভার ছবি URL *
              </label>
              <Input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              সংক্ষিপ্ত বিবরণ *
            </label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  আপডেট সংরক্ষণ করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

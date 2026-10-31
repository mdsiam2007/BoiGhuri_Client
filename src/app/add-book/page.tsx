"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { BookOpen, Upload, Link as LinkIcon, Loader2, PlusCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PrivateRouteGuard from "@/components/shared/PrivateRouteGuard";
import { uploadImageToCloud } from "@/lib/imageUpload";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  return (
    <PrivateRouteGuard>
      <AddBookForm />
    </PrivateRouteGuard>
  );
}

function AddBookForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BoiGhuri | বই যোগ করুন (Add Book)";
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি আপলোড করা যাবে");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("ছবি ক্লাউডে আপলোড করা হচ্ছে...");

    try {
      const url = await uploadImageToCloud(file);
      setImage(url);
      toast.success("ছবি সফলভাবে আপলোড হয়েছে!", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ছবি আপলোডে সমস্যা হয়েছে";
      toast.error(msg, { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim() || !image.trim()) {
      toast.error("অনুগ্রহ করে বইয়ের সকল তথ্য এবং ছবি প্রদান করুন");
      return;
    }

    if (totalCopies < 1) {
      toast.error("মোট কপির সংখ্যা কমপক্ষে ১ হতে হবে");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("বইটি ডাটাবেসে যুক্ত করা হচ্ছে...");

    try {
      const res = await fetchWithAuth("/books", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          totalCopies: Number(totalCopies),
          description: description.trim(),
          image: image.trim(),
          userName: user?.name || "Anonymous",
          userEmail: user?.email || "",
        }),
      });

      if (res.success) {
        toast.success(res.message || "বইটি সফলভাবে লাইব্রেরিতে যুক্ত হয়েছে!", { id: toastId });
        router.push("/my-books");
      } else {
        toast.error(res.message || "বই যুক্ত করতে ব্যর্থ হয়েছে", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সার্ভার এরর!";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Card className="border border-border/80 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/40 border-b p-6 sm:p-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>নতুন সংগ্রহ</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
              নতুন বই যোগ করুন (Add Book)
            </CardTitle>
            <CardDescription className="text-sm">
              বইয়ের সঠিক তথ্য পূরণ করে আমাদের উন্মুক্ত লাইব্রেরি সংগ্রহকে আরও সমৃদ্ধ করুন।
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    বইয়ের নাম (Book Title) *
                  </label>
                  <Input
                    placeholder="উদাঃ পথের পাঁচালী"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    লেখকের নাম (Author Name) *
                  </label>
                  <Input
                    placeholder="উদাঃ বিভূতিভূষণ বন্দ্যোপাধ্যায়"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Category & Total Copies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    ক্যাটাগরি (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    মোট কপি সংখ্যা (Total Copies) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="উদাঃ 5"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(parseInt(e.target.value, 10) || 1)}
                    required
                  />
                </div>
              </div>

              {/* Book Cover Image: Upload & Direct URL */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground">
                  বইয়ের কভার ছবি (Cover Image) *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload (ImgBB + Postimages fallback) */}
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="text-xs text-muted-foreground font-medium">
                          আপলোড হচ্ছে...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                          ডিভাইস থেকে আপলোড করুন
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          ImgBB / Postimages অটো-ফলব্যাক
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center space-y-2 p-4 border rounded-xl bg-card">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5" /> অথবা সরাসরি ইমেজ লিঙ্ক দিন:
                    </span>
                    <Input
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="p-3 bg-muted/40 rounded-xl border flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Preview"
                      className="h-20 w-16 object-cover rounded-lg border shadow-xs"
                    />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-foreground flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle className="h-4 w-4" /> ছবি সফলভাবে সিলেক্ট হয়েছে
                      </p>
                      <p className="text-muted-foreground truncate max-w-sm">
                        {image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  সংক্ষিপ্ত বিবরণ (Short Description) *
                </label>
                <Textarea
                  placeholder="বইটির বিষয়বস্তু, গল্প বা শিক্ষণীয় দিক সম্পর্কে সংক্ষেপে লিখুন..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Read-Only User Info (Taken from logged in user) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-muted/30 border">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    যোগকারীর নাম (User Name - Read Only)
                  </label>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    যোগকারীর ইমেইল (User Email - Read Only)
                  </label>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting || uploadingImage}
                className="w-full font-bold rounded-xl shadow-md gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    সংরক্ষণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    বইটি লাইব্রেরিতে যুক্ত করুন (Add Book)
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

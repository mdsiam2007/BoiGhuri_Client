"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/books/BookCard";
import { IBook } from "@/types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function NewArrivals() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await fetch(`${SERVER_URL}/books?limit=6`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setBooks(result.data);
        }
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-background transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>নতুন সংযোজন (New Arrivals)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            লাইব্রেরির সর্বশেষ বইসমূহ
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            পাঠকদের অনুরোধে সম্প্রতি লাইব্রেরির সংগ্রহে যুক্ত হওয়া সেরা ও জনপ্রিয় বইগুলো এক নজরে দেখে নিন।
          </p>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">নতুন বইগুলো লোড হচ্ছে...</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </motion.div>

            {/* See All Books Button */}
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm transition-all hover:scale-105"
                asChild
              >
                <Link href="/books" className="inline-flex items-center gap-2">
                  <span>সব বই দেখুন (See All Books)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/30">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium">বর্তমানে কোনো নতুন বই নেই</p>
            <p className="text-xs text-muted-foreground mt-1">
              প্রথম বইটি আপনিই যুক্ত করতে পারেন!
            </p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/add-book">বই যোগ করুন</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

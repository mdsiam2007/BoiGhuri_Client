"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/books/BookCard";
import BookSkeleton from "@/components/books/BookSkeleton";
import { useLanguage } from "@/context/LanguageContext";
import { IBook } from "@/types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function NewArrivals() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await fetch(`${SERVER_URL}/books?limit=10`, {
          cache: "no-store",
        });
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
      <div className="container max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.newArrivalsBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {t.newArrivalsTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.newArrivalsDesc}
          </p>
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <BookSkeleton key={idx} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* See All Books Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm transition-all hover:scale-105"
                asChild
              >
                <Link href="/books" className="inline-flex items-center gap-2">
                  <span>{t.seeAllBooks}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/30">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium">বর্তমানে কোনো নতুন বই নেই</p>
            <p className="text-xs text-muted-foreground mt-1">
              প্রথম বইটি আপনিই যুক্ত করতে পারেন!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

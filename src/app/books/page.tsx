"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, BookOpen, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/books/BookCard";
import BookSkeleton from "@/components/books/BookSkeleton";
import { useLanguage } from "@/context/LanguageContext";
import { IBook, BookCategory } from "@/types";

const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");

const categories: (BookCategory | "All")[] = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AllBooksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AllBooksContent />
    </Suspense>
  );
}

function AllBooksContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as BookCategory) || "All";

  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "All">(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Dynamic Title
  useEffect(() => {
    document.title = `BoiGhuri | ${t.allBooks}`;
  }, [t.allBooks]);

  // Fetch books
  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const url = new URL(`${SERVER_URL}/books`);
        if (selectedCategory !== "All") {
          url.searchParams.set("category", selectedCategory);
        }
        if (searchQuery.trim()) {
          url.searchParams.set("search", searchQuery.trim());
        }
        if (sortBy) {
          url.searchParams.set("sort", sortBy);
        }

        const res = await fetch(url.toString(), {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBooks(json.data);
        }
      } catch (err) {
        console.error("Failed to load books:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadBooks();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-background transition-colors">
      <div className="container max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t.allBooksHeaderBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t.allBooksHeaderTitle}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.allBooksHeaderDesc}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              {language === "bn" ? "সাজান:" : "Sort By:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="oldest">{t.sortOldest}</option>
              <option value="title_asc">{language === "bn" ? "শিরোনাম অনুযায়ী" : "Title (A to Z)"}</option>
              <option value="copies">{t.sortCopiesHigh}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat === "All" ? t.allCategory : cat}
            </button>
          ))}
        </div>

        {/* Books Grid: 5 cards per row on large screens */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <BookSkeleton key={idx} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          >
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-card">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">
              {t.noBooksFound}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t.resetFilters}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


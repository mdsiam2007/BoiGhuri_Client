"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, User, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IBook } from "@/types";

interface BookCardProps {
  book: IBook;
}

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  Science: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  History: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  Kids: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  Others: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
};

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.totalCopies > 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="h-full flex"
    >
      <Card className="flex flex-col w-full overflow-hidden border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group bg-card">
        {/* Book Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Availability Badge */}
          <div className="absolute top-3 right-3 z-10">
            {isAvailable ? (
              <Badge className="bg-emerald-600/90 text-white font-medium shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="h-3 w-3" />
                <span>উপলব্ধ ({book.totalCopies} কপি)</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px]">
                <XCircle className="h-3 w-3" />
                <span>Not Available</span>
              </Badge>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border backdrop-blur-md shadow-xs ${
                categoryColors[book.category] || categoryColors.Others
              }`}
            >
              {book.category}
            </span>
          </div>
        </div>

        {/* Card Details */}
        <CardContent className="flex flex-col flex-1 p-5 justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>

            <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed pt-1">
              {book.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-auto border-t border-border/60">
            <Button
              className="w-full flex items-center justify-center gap-2 font-medium rounded-lg group/btn"
              asChild
            >
              <Link href={`/books/${book._id}`}>
                <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                <span>বিস্তারিত দেখুন (View Details)</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

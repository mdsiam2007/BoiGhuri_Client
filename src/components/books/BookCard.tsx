"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Eye, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isAvailable = book.totalCopies > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full flex"
    >
      <Card className="flex flex-col w-full overflow-hidden border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group bg-card">
        {/* Book Cover Image with Loading Placeholder / Fallback */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* Animated placeholder while image is loading or if it fails */}
          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-primary/15 via-muted to-muted/80 z-0">
              <div className="skeleton absolute inset-0" />
              <div className="relative z-10 flex flex-col items-center justify-center p-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2 text-primary shadow-xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-foreground line-clamp-2 px-1">
                  {book.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {book.author}
                </p>
              </div>
            </div>
          )}

          {/* Actual Book Image */}
          {!imageError && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={book.image}
              alt={book.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`relative z-1 h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          )}

          {/* Availability Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {isAvailable ? (
              <Badge className="bg-emerald-600/90 text-white font-medium shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px] px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>{t.available} ({book.totalCopies} {t.copies})</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px] px-2 py-0.5">
                <XCircle className="h-3 w-3" />
                <span>{t.notAvailable}</span>
              </Badge>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border backdrop-blur-md shadow-xs ${
                categoryColors[book.category] || categoryColors.Others
              }`}
            >
              {book.category}
            </span>
          </div>
        </div>

        {/* Card Details */}
        <CardContent className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between">
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>

            <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed pt-0.5">
              {book.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-3 mt-auto border-t border-border/60">
            <Button
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 font-medium rounded-lg group/btn text-xs shadow-xs"
              asChild
            >
              <Link href={`/books/${book._id}`}>
                <Eye className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
                <span>{t.viewDetails}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

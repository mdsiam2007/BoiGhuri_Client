"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-card text-card-foreground transition-colors mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/BoiGhuri_horizontal_logo.png"
                alt="BoiGhuri Logo"
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footerAboutDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.allBooks}
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.addBook}
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.myBorrows}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              {t.contactUs}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{t.addressText}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@boighuri.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t.language}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              বইঘুরি—জ্ঞান ছড়িয়ে দিন দেশের প্রতিটি প্রান্তে। একটি সচেতন পাঠক সমাজ গড়ে তুলতে আমাদের পাশে থাকুন।
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                24/7 Library Services
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BoiGhuri. {t.rightsReserved}</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

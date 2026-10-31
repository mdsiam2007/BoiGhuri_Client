import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground transition-colors mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                বইঘুরি <span className="text-primary font-normal text-sm">BoiGhuri</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              বইঘুরি একটি উন্মুক্ত অনলাইন লাইব্রেরি প্ল্যাটফর্ম। যেখানে বইপ্রেমীরা পছন্দের বই সহজে খুঁজে পান, সংগ্রহে বই যোগ করেন এবং নিরাপদে ধার নিয়ে পড়েন।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  হোম পেজ (Home)
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">
                  সকল বইয়ের তালিকা (All Books)
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="text-muted-foreground hover:text-primary transition-colors">
                  নতুন বই যোগ করুন (Add Book)
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="text-muted-foreground hover:text-primary transition-colors">
                  ধার করা বইয়ের হিসাব (My Borrows)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>ধানমন্ডি, ঢাকা - ১২০৯, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+৮৮০ ১৭০০-০০০০০০</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@boighuri.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links with New X Logo */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              সোশ্যাল মিডিয়ায় আমরা
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              নতুন বইয়ের আগমন ও লাইব্রেরির নিয়মিত আপডেটের জন্য যুক্ত থাকুন।
            </p>
            <div className="flex items-center gap-3">
              {/* New X (Twitter) Logo - exact requirement */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                aria-label="X (formerly Twitter)"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80205 13.4901H9.19795V21.5Z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} বইঘুরি (BoiGhuri) — সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            বই পড়ার আনন্দে তৈরি <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> BoiGhuri টিম
          </p>
        </div>
      </div>
    </footer>
  );
}

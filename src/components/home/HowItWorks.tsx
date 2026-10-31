"use client";

import { motion } from "framer-motion";
import { Search, BookCheck, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "০১",
    title: "বই পছন্দ করুন",
    description:
      "আমাদের সমৃদ্ধ লাইব্রেরি ক্যাটালগ থেকে হাজারো বই ব্রাউজ করুন। ক্যাটাগরি, লেখক বা শিরোনাম দিয়ে আপনার প্রিয় বইটি খুঁজে নিন।",
    icon: Search,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    step: "০২",
    title: "এক ক্লিকে ধার নিন",
    description:
      "বইটির বিস্তারিত পেজে গিয়ে 'ধার নিন' বোতাম চাপুন। ফেরত দেওয়ার তারিখ নির্বাচন করে সহজেই নিশ্চিত করুন।",
    icon: BookCheck,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    step: "০৩",
    title: "পড়ুন এবং ফেরত দিন",
    description:
      "আরাম করে বইটি সম্পূর্ণ পড়ুন। নির্ধারিত সময়ের মধ্যে আপনার 'My Borrows' পেজ থেকে এক ক্লিকেই ফেরত দিন।",
    icon: RotateCcw,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-muted/40 border-y transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
            সহজ ৩টি ধাপ
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            কীভাবে বই ধার নেবেন?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            বইঘুরির মাধ্যমে যেকোনো বই ধার নেওয়া এখন যেকোনো সময়ের চেয়ে সহজ এবং ঝামেলামুক্ত।
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative bg-card rounded-2xl p-7 border border-border/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center border ${item.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-muted-foreground/30">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="h-1 w-12 bg-primary/40 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-xl px-8 shadow-md" asChild>
            <Link href="/books" className="inline-flex items-center gap-2">
              <span>এখনই বই ধার নিন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

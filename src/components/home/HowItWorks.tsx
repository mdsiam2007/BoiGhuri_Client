"use client";

import { motion } from "framer-motion";
import { Search, BookCheck, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      title: t.step1Title,
      description: t.step1Desc,
      icon: Search,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      step: "02",
      title: t.step2Title,
      description: t.step2Desc,
      icon: BookCheck,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      step: "03",
      title: t.step3Title,
      description: t.step3Desc,
      icon: RotateCcw,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/40 border-y transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
            {t.howItWorksBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.howItWorksDesc}
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
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-muted border border-border text-[11px] font-bold text-muted-foreground uppercase">
                  STEP {item.step}
                </div>

                <div className={`p-4 rounded-2xl border mb-6 ${item.color}`}>
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Button size="lg" className="rounded-xl px-8 shadow-md" asChild>
            <Link href="/books" className="inline-flex items-center gap-2">
              <span>{t.allBooks}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

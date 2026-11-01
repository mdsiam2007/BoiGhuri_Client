"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Atom, Landmark, Sparkles, FolderArchive, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TopCategories() {
  const { t } = useLanguage();

  const categories = [
    {
      name: "Fiction",
      title: t.catFiction,
      description: t.catFictionDesc,
      icon: BookOpen,
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
      href: "/books?category=Fiction",
    },
    {
      name: "Science",
      title: t.catScience,
      description: t.catScienceDesc,
      icon: Atom,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
      href: "/books?category=Science",
    },
    {
      name: "History",
      title: t.catHistory,
      description: t.catHistoryDesc,
      icon: Landmark,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
      href: "/books?category=History",
    },
    {
      name: "Kids",
      title: t.catKids,
      description: t.catKidsDesc,
      icon: Sparkles,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      href: "/books?category=Kids",
    },
    {
      name: "Others",
      title: t.catOthers,
      description: t.catOthersDesc,
      icon: FolderArchive,
      color: "from-slate-500/20 to-zinc-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400",
      href: "/books?category=Others",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
            {t.categoriesBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {t.categoriesTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.categoriesDesc}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={cat.href}
                  className={`block h-full p-6 rounded-2xl border bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-background/80 shadow-xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

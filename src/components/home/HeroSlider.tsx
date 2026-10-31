"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "বইয়ের আঙিনায় আপনাকে স্বাগতম",
    subtitle: "ক্লাসিক ও সমকালীন সাহিত্যের সেরা সংগ্রহ",
    description:
      "কালজয়ী ঔপন্যাসিকদের সাহিত্য থেকে শুরু করে আধুনিক বেস্টসেলার—আপনার পছন্দের প্রতিটি বই এখন হাতের নাগালে। ঘরে বসেই ধার নিন পছন্দের বই।",
    buttonText: "বই খুঁজুন (Browse Books)",
    badge: "সাহিত্য ও গল্প",
    icon: Sparkles,
    bgImage:
      "https://images.unsplash.com/photo-1507842229451-7f01be777a26?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "বিজ্ঞানের রোমাঞ্চকর অজানা দিগন্ত",
    subtitle: "মহাবিশ্ব, প্রযুক্তি ও আবিষ্কারের অন্তহীন পাঠ",
    description:
      "কোয়ান্টাম পদার্থবিজ্ঞান থেকে কৃত্রিম বুদ্ধিমত্তা—মানবজাতির জ্ঞান অন্বেষণের রোমাঞ্চকর অভিযানকে বইয়ের পাতায় আবিষ্কার করুন।",
    buttonText: "বিজ্ঞান গ্রন্থাবলী (Browse Books)",
    badge: "বিজ্ঞান ও গবেষণা",
    icon: Compass,
    bgImage:
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "ইতিহাসের পদচিহ্ন ও সভ্যতার রূপরেখা",
    subtitle: "অতীতের সত্য থেকে বর্তমানের শিক্ষা",
    description:
      "আমাদের রক্তক্ষয়ী মুক্তিযুদ্ধ, প্রাচীন সাম্রাজ্যের উত্থান-পতন আর মহাপুরুষদের জীবনগাথা জানুন প্রাঞ্জল সব ঐতিহাসিক রচনায়।",
    buttonText: "ইতিহাসের বই (Browse Books)",
    badge: "ইতিহাস ও ঐতিহ্য",
    icon: BookOpen,
    bgImage:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "ছোটদের রঙিন কল্পলোকের আসর",
    subtitle: "রূপকথা, অ্যাডভেঞ্চার ও শিশুতোষ সাহিত্য",
    description:
      "টুনটুনি, ফেলুদা আর উপেন্দ্রকিশোরের মজার রূপকথা—ছোটদের মনন ও সৃজনশীলতা বিকাশে বাছাই করা সব শিশুতোষ বইয়ের সমাহার।",
    buttonText: "ছোটদের বই (Browse Books)",
    badge: "শিশু ও কিশোর কর্নার",
    icon: Sparkles,
    bgImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "একটি বই, একটি আলোকিত পৃথিবী",
    subtitle: "সহজ নিয়ম: বই যুক্ত করুন, ধার নিন এবং ফেরত দিন",
    description:
      "বইঘুরি কেবল একটি লাইব্রেরি নয়, এটি একটি সচেতন পাঠক সমাজ। আপনিও যুক্ত হোন আমাদের সঙ্গে, জ্ঞান ছড়িয়ে দিন প্রতিটি প্রাণে।",
    buttonText: "লাইব্রেরিতে প্রবেশ করুন (Browse Books)",
    badge: "জ্ঞান বিনিময় প্ল্যাটফর্ম",
    icon: ShieldCheck,
    bgImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&auto=format&fit=crop&q=80",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="h-[520px] sm:h-[580px] lg:h-[640px] w-full"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
              </div>

              {/* Slide Content */}
              <div className="container relative mx-auto h-full px-6 sm:px-10 lg:px-16 flex items-center z-10">
                <div className="max-w-2xl text-white space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{slide.badge}</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg text-emerald-200/90 font-medium"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-2 flex flex-wrap gap-4"
                  >
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/50 flex items-center gap-2 transition-all hover:scale-105"
                      asChild
                    >
                      <Link href="/books">
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                      asChild
                    >
                      <Link href="/add-book">বই যোগ করুন</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

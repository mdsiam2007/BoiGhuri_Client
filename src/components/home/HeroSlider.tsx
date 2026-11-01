"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  ShieldCheck,
  CircleFadingArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSlider() {
  const { t } = useLanguage();
  const swiperRef = useRef<SwiperType | null>(null);

  const slides = [
    {
      id: 1,
      title: t.heroTitle1,
      subtitle: t.heroSubtitle1,
      description: t.heroDesc1,
      buttonText: t.heroBtn1,
      badge: t.heroBadge1,
      icon: Sparkles,
      bgImage: "/assets/slide-1.webp",
    },
    {
      id: 2,
      title: t.heroTitle2,
      subtitle: t.heroSubtitle2,
      description: t.heroDesc2,
      buttonText: t.heroBtn2,
      badge: t.heroBadge2,
      icon: Compass,
      bgImage: "/assets/slide-2.webp",
    },
    {
      id: 3,
      title: t.heroTitle3,
      subtitle: t.heroSubtitle3,
      description: t.heroDesc3,
      buttonText: t.heroBtn3,
      badge: t.heroBadge3,
      icon: BookOpen,
      bgImage: "/assets/slide-3.webp",
    },
    {
      id: 4,
      title: t.heroTitle4,
      subtitle: t.heroSubtitle4,
      description: t.heroDesc4,
      buttonText: t.heroBtn4,
      badge: t.heroBadge4,
      icon: Sparkles,
      bgImage: "/assets/slide-4.webp",
    },
    {
      id: 5,
      title: t.heroTitle5,
      subtitle: t.heroSubtitle5,
      description: t.heroDesc5,
      buttonText: t.heroBtn5,
      badge: t.heroBadge5,
      icon: ShieldCheck,
      bgImage: "/assets/slide-5.webp",
    },
    {
      id: 6,
      title: t.heroTitle6,
      subtitle: t.heroSubtitle6,
      description: t.heroDesc6,
      buttonText: t.heroBtn6,
      badge: t.heroBadge6,
      icon: BookOpen,
      bgImage: "/assets/slide-6.webp",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 group/slider">
      {/* Custom Swiper Instance */}
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
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

                  {/* Slide Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-3 flex flex-wrap items-center gap-3.5"
                  >
                    {/* Primary Button */}
                    <Button
                      size="lg"
                      className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-slate-950 font-semibold rounded-xl h-12 px-6 flex items-center gap-2.5 transition-all active:scale-95 shadow-sm"
                      asChild
                    >
                      <Link href="/books">
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Secondary Button with CircleFadingArrowUp */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/25 bg-white/10 hover:bg-white hover:text-slate-900 hover:border-white text-white font-medium rounded-xl h-12 px-6 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
                      asChild
                    >
                      <Link href="/add-book">
                        <CircleFadingArrowUp className="h-4 w-4" />
                        <span>{t.heroAddBtn}</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Modern Custom Navigation Buttons with ArrowLeft & ArrowRight */}
      <div className="hidden sm:flex absolute right-6 sm:right-10 lg:right-16 bottom-10 z-20 items-center gap-2.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperRef.current?.slidePrev()}
          className="h-11 w-11 rounded-xl bg-white/10 hover:bg-white hover:text-slate-900 border-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperRef.current?.slideNext()}
          className="h-11 w-11 rounded-xl bg-white/10 hover:bg-white hover:text-slate-900 border-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}

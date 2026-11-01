"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function PromoVideoSection() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-background border-t transition-colors relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.promoBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {t.promoTitle}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.promoDesc}
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2 text-left inline-block lg:block">
              {[t.promoFeature1, t.promoFeature2, t.promoFeature3].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                  <div className="flex h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-xl px-6 font-semibold shadow-md" asChild>
                <Link href="/books" className="inline-flex items-center gap-2">
                  <span>{t.allBooks}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-6" asChild>
                <Link href="/add-book">{t.addBook}</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Video Showcase Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 bg-slate-950 shadow-2xl shadow-primary/10 group">
              {/* HTML5 Promo Video */}
              <div className="relative aspect-video w-full bg-slate-900">
                <video
                  ref={videoRef}
                  src="/assets/boighuri_promotion_video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-6">
                  {/* Play / Pause Toggle */}
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>

                  {/* Sound Toggle */}
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Bottom Video Badge Indicator */}
              <div className="px-4 py-2.5 bg-card border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-semibold text-foreground">BoiGhuri Teaser (10s)</span>
                </div>
                <span className="text-[11px] font-mono">1080p Full HD</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


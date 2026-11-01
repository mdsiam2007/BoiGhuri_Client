"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 h-9 rounded-xl border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer transition-all"
      title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
    >
      <Languages className="h-4 w-4 text-primary" />
      <span className="font-bold uppercase tracking-wider">{language === "bn" ? "EN" : "বাং"}</span>
    </Button>
  );
}


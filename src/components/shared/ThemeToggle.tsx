"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full text-foreground/80 hover:text-foreground transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 rotate-0 scale-100 transition-all duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 rotate-0 scale-100 transition-all duration-300" />
      )}
    </Button>
  );
}

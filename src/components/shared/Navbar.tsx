"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Menu, X, LogOut, User as UserIcon, PlusCircle, BookMarked, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useSession, signOut } from "@/lib/auth-client";
import { clearJwtToken } from "@/lib/api";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
      clearJwtToken();
      toast.success("সফলভাবে লগআউট করা হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  const navLinks = [
    { name: "হোম (Home)", href: "/" },
    { name: "সব বই (All Books)", href: "/books" },
    ...(user
      ? [
          { name: "বই যোগ করুন (Add Book)", href: "/add-book" },
          { name: "আমার বইসমূহ (My Books)", href: "/my-books" },
          { name: "ধার করা বই (My Borrows)", href: "/my-borrows" },
        ]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              বইঘুরি <span className="text-primary font-normal text-sm">BoiGhuri</span>
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">
              অনলাইন লাইব্রেরি
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold shadow-xs"
                  : "text-foreground/75 hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons (Auth + Theme + Mobile Menu) */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Auth Section */}
          {!isPending && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-9 w-9 rounded-full object-cover border-2 border-primary/30"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm border-2 border-primary/30">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl">
                    <div className="flex flex-col px-2 py-1.5 border-b mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link href="/my-books" className="flex items-center gap-2.5">
                        <Library className="h-4 w-4 text-primary" />
                        <span>আমার বইসমূহ (My Books)</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-borrows" className="flex items-center gap-2.5">
                        <BookMarked className="h-4 w-4 text-primary" />
                        <span>ধার করা বই (My Borrows)</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-book" className="flex items-center gap-2.5">
                        <PlusCircle className="h-4 w-4 text-primary" />
                        <span>নতুন বই যোগ করুন</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>লগআউট (Logout)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">লগইন (Login)</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">রেজিস্টার (Register)</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!user && (
            <div className="pt-3 border-t flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-center" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  লগইন (Login)
                </Link>
              </Button>
              <Button className="w-full justify-center" asChild>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  রেজিস্টার (Register)
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

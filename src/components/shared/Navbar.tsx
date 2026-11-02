"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, PlusCircle, BookMarked, Library, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";
import ProfileEditModal from "@/components/shared/ProfileEditModal";
import { useSession, signOut } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import { clearJwtToken, syncJwtToken } from "@/lib/api";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const user = session?.user;

  // Proactively ensure backend JWT token exists whenever session is active (e.g. on reload, social login)
  useEffect(() => {
    if (!isPending && user?.email) {
      const existingToken =
        typeof window !== "undefined"
          ? localStorage.getItem("boighuri_jwt_token")
          : null;
      if (!existingToken) {
        syncJwtToken({
          email: user.email,
          name: user.name || "User",
          image: user.image || "",
        });
      }
    }
  }, [user, isPending]);

  const handleLogout = async () => {
    try {
      await signOut();
      clearJwtToken();
      toast.success(t.logout);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.allBooks, href: "/books" },
    ...(user
      ? [
          { name: t.addBook, href: "/add-book" },
          { name: t.myBooks, href: "/my-books" },
          { name: t.myBorrows, href: "/my-borrows" },
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
        <Link href="/" className="flex items-center gap-2 group py-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/BoiGhuri_horizontal_logo.png"
            alt="ন ইঘুরি BoiGhuri Logo"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
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

        {/* Right Action Icons (Language + Theme + Auth + Mobile Menu) */}
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <ThemeToggle />

          {/* Auth Section with Skeleton Loader */}
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="skeleton h-9 w-20 rounded-lg hidden sm:block" />
              <div className="skeleton h-9 w-24 rounded-lg hidden sm:block" />
              <div className="skeleton h-9 w-9 rounded-full sm:hidden" />
            </div>
          ) : (
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

                    <DropdownMenuItem
                      onClick={() => setProfileModalOpen(true)}
                      className="flex items-center gap-2.5 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span>{t.profile}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/my-books" className="flex items-center gap-2.5">
                        <Library className="h-4 w-4 text-primary" />
                        <span>{t.myBooks}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-borrows" className="flex items-center gap-2.5">
                        <BookMarked className="h-4 w-4 text-primary" />
                        <span>{t.myBorrows}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-book" className="flex items-center gap-2.5">
                        <PlusCircle className="h-4 w-4 text-primary" />
                        <span>{t.addBook}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">{t.login}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">{t.register}</Link>
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
                  {t.login}
                </Link>
              </Button>
              <Button className="w-full justify-center" asChild>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  {t.register}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Profile Edit Modal */}
      {user && (
        <ProfileEditModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          currentUser={user}
          onSuccess={(newName, newImage) => {
            if (user) {
              user.name = newName;
              if (newImage) user.image = newImage;
            }
          }}
        />
      )}
    </header>
  );
}

import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToastProvider from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/context/ThemeContext";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "বইঘুরি (BoiGhuri) — আপনার অনলাইন লাইব্রেরি",
  description: "বই খুঁজুন, নতুন বই যোগ করুন, ধার নিন ও পড়ুন। একটি আধুনিক অনলাইন লাইব্রেরি প্ল্যাটফর্ম।",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${hindSiliguri.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <ToastProvider />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

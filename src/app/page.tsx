import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import HowItWorks from "@/components/home/HowItWorks";
import PromoVideoSection from "@/components/home/PromoVideoSection";
import TopCategories from "@/components/home/TopCategories";

export const metadata = {
  title: "বইঘুরি (BoiGhuri) — অনলাইন লাইব্রেরি",
  description: "বই খুঁজুন, নতুন বই যোগ করুন, ধার নিন ও পড়ুন। একটি আধুনিক অনলাইন লাইব্রেরি প্ল্যাটফর্ম।",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 6-Slide Hero Slider with Local Assets */}
      <HeroSlider />

      {/* Dynamic New Arrivals Section (10 Books / 5 per row) */}
      <NewArrivals />

      {/* 10-Second Promo Video Showcase Section */}
      <PromoVideoSection />

      {/* Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* Extra Section 2: Top Categories */}
      <TopCategories />
    </div>
  );
}

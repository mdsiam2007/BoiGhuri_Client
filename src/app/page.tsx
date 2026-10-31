import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import HowItWorks from "@/components/home/HowItWorks";
import TopCategories from "@/components/home/TopCategories";

export const metadata = {
  title: "বইঘুরি (BoiGhuri) — অনলাইন লাইব্রেরি",
  description: "বই খুঁজুন, নতুন বই যোগ করুন, ধার নিন ও পড়ুন। একটি আধুনিক অনলাইন লাইব্রেরি প্ল্যাটফর্ম।",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 5-Slide Hero Slider */}
      <HeroSlider />

      {/* Dynamic New Arrivals Section */}
      <NewArrivals />

      {/* Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* Extra Section 2: Top Categories */}
      <TopCategories />
    </div>
  );
}

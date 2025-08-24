// app/page.jsx

import Navbar from "@/app/components/Navbar";
import Carousel from "@/app/components/Carousel";
import Popularitems from "@/app/components/Popularitems";
import Footer from "@/app/components/Footer";
import ImageGallery from "@/app/components/ImageGallery";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import FeatureSection from "@/app/components/FeatureSection";
import StatsSection from "@/app/components/StatsSection";
import CTASection from "@/app/components/CTASection";
import MarqueeLogos from "@/app/components/MarqueeLogos";


export default function Home() {
  const words = [
    {
      text: "In-game",
    },
    {
      text: "currency",
    },
    {
      text: "now",
    },
    {
      text: "available",
    },
    {
      text: "at",
    },
    {
      text: "discounted",
    },
    {
      text: "prices",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <>
      <Navbar />
      <div>
        <HeroGeometric
          title1="Discounted Game Currency"
          title2="for Every Gamer"
        />
      </div>
      <main className="bg-[#030303] relative overflow-hidden">
        {/* Subtle global background accents */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#1a1a1a_0%,#0d0d0d_60%,#050505_100%)]" />
          <div className="absolute inset-0 opacity-40 mix-blend-plus-lighter bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.12),transparent_55%)]" />
        </div>

        {/* Carousel repositioned as promo banner */}
        <Carousel />

        {/* Trust / Stats */}
        <StatsSection />

        {/* Brand / game marquee */}
        <MarqueeLogos />

        {/* Features */}
        <FeatureSection />

        {/* Popular Items slider */}
        <div className="relative z-10">
          <Popularitems />
        </div>

        {/* Tabbed gallery (games / vouchers etc.) */}
        <div className="relative z-10">
          <ImageGallery />
        </div>

        {/* Call To Action */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import Header from "@/components/ayzen/Header";
import Hero from "@/components/ayzen/Hero";
import PainSection from "@/components/ayzen/PainSection";
import CurationSection from "@/components/ayzen/CurationSection";
import SmarterSection from "@/components/ayzen/SmarterSection";
import IntegrationsSection from "@/components/ayzen/IntegrationsSection";
import PricingSection from "@/components/ayzen/PricingSection";
import TestimonialsSection from "@/components/ayzen/TestimonialsSection";
import BlogSection from "@/components/ayzen/BlogSection";
import FaqSection from "@/components/ayzen/FaqSection";
import Footer from "@/components/ayzen/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body antialiased">
      <Header />
      <main>
        <Hero />
        <PainSection />
        <CurationSection />
        <SmarterSection />
        <IntegrationsSection />
        <PricingSection />
        <TestimonialsSection />
        <BlogSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
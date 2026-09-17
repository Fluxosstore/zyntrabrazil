import React from "react";
import TestimonialsCarousel from "./TestimonialsCarousel";
import { useLanguage } from "@/lib/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const metrics = [
    { value: "800+", label: t("testimonials.m1Label") },
    { value: "-54%", label: t("testimonials.m2Label") },
    { value: "4.9/5", label: t("testimonials.m3Label") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
              <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">
                {t("testimonials.badge")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
              <span className="text-black">{t("testimonials.title")}</span>
              <br />
              <span className="text-[#7c3aed]">{t("testimonials.titleHighlight")}</span>
            </h2>
          </div>
          <p className="text-sm text-[#71717a] leading-relaxed lg:max-w-sm lg:mt-16">
            {t("testimonials.desc")}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-14 max-w-3xl mx-auto">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-violet-600">
                {m.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Testimonial carousel - full width with edge fades */}
      <div className="relative w-full overflow-hidden">
        <TestimonialsCarousel />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />
      </div>
    </section>
  );
}
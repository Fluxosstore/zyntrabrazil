import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FaqSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  const faqs = [
    { num: "01", cat: t("faq.q1cat"), q: t("faq.q1"), a: t("faq.a1") },
    { num: "02", cat: t("faq.q2cat"), q: t("faq.q2"), a: t("faq.a2") },
    { num: "03", cat: t("faq.q3cat"), q: t("faq.q3"), a: t("faq.a3") },
    { num: "04", cat: t("faq.q4cat"), q: t("faq.q4"), a: t("faq.a4") },
    { num: "05", cat: t("faq.q5cat"), q: t("faq.q5"), a: t("faq.a5") },
    { num: "06", cat: t("faq.q6cat"), q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left card with full background image */}
          <div className="relative rounded-3xl overflow-hidden min-h-[560px] flex flex-col justify-end p-8 lg:p-10">
            <img
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/826189177_quality_restoration_20260928211911374.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Faint white wash so text stays legible over the image */}
            <div className="pointer-events-none absolute inset-0 bg-white/30" />
            {/* White gradient overlays to fade edges */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAFAFA] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent" />
            {/* Stacked text */}
            <div className="relative z-10 w-full">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
                <span className="text-black">{t("faq.title")}</span>
                <br />
                <span className="text-[#8A4FFF]">{t("faq.titleHighlight")}</span>
              </h2>
              <p className="mt-5 text-sm text-[#6B6B6B] leading-relaxed max-w-sm">
                {t("faq.desc")}
              </p>
              <a
                href="https://wa.me/message/BYSDMLHYTA6EA1"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-transparent border border-[#E0E0E0] rounded-full px-5 py-2.5 text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
              >
                {t("faq.talkToTeam")}
              </a>
            </div>
          </div>

          {/* Right column - FAQ list */}
          <div className="divide-y divide-[#e2e8f0]">
            {faqs.map((f, i) => (
              <div key={i} className="py-6">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-start justify-between gap-6 text-left"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-sm font-semibold text-[#94a3b8] tabular-nums pt-1">
                      {f.num}
                    </span>
                    <div>
                      <span className="block text-xs font-medium tracking-widest uppercase text-[#94a3b8] mb-1.5">
                        {f.cat}
                      </span>
                      <span className="text-base lg:text-lg font-bold text-[#111111] leading-snug">
                        {f.q}
                      </span>
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 mt-1">
                    {open === i ? (
                      <ChevronUp className="w-4 h-4 text-[#111111]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#111111]" />
                    )}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-10 text-sm text-[#475569] leading-relaxed max-w-lg">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-lg shadow-violet-300 hover:bg-[#7c3aed] transition-colors z-50">
        <Sparkles className="w-5 h-5 text-white" />
      </button>
    </section>
  );
}
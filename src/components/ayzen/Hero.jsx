import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import FloatingDots from "@/components/ayzen/FloatingDots";
import { useLanguage } from "@/lib/LanguageContext";

const aiModels = [
  { name: "GPT-5", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/0bb1a42e9_chatgpt.svg" },
  { name: "Claude", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3fe0894ec_claude.svg" },
  { name: "Gemini", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3a4b6ee08_gemini.svg" },
  { name: "Grok", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/9c7876675_grok.svg" },
  { name: "DeepSeek", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d9975d697_deepseek.svg" },
];

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: px * 24, y: py * 24 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-24 lg:pt-52 pb-14 lg:pb-72 overflow-hidden">
      {/* background image with parallax */}
      <Image
        src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/b0e22d040_quality_restoration_20260929144820196.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform scale-110"
        fittingType="fill"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />

      {/* dark scrim to ensure text legibility over the busy background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/55" />
      {/* #FAFAFA bottom gradient to blend the image into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 lg:h-20 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 lg:via-[#FAFAFA]/40 to-transparent" />

      {/* floating purple particles rising from bottom to top */}
      <FloatingDots />

      {/* subtle background glow */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 2xl:translate-y-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-medium text-violet-700">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white leading-[1.05] [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">
              {t("hero.title1")}
              <br />
              <span>{t("hero.title2")}</span>
              <br />
              <span className="text-violet-600 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] lg:[text-shadow:none]">{t("hero.title3")}</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-white leading-relaxed max-w-xl font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
              <span className="whitespace-nowrap"><span className="font-bold">{t("hero.descBold")}</span> {t("hero.desc2")}</span>{" "}
              <span className="whitespace-nowrap">{t("hero.desc3")}</span>{" "}
              <span className="whitespace-nowrap">{t("hero.desc4")}</span>{" "}
              <span className="whitespace-nowrap">{t("hero.desc5")}</span>{" "}
              <span className="whitespace-nowrap">{t("hero.desc6")}</span>
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm sm:text-base font-semibold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5">
                
                {t("hero.cta1")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 text-sm sm:text-base font-semibold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full border border-gray-200 transition-all">

                {t("hero.cta2")}
              </a>
            </div>

            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
              {t("hero.socialProof")}
            </p>
          </div>

          {/* Right: stats (top) + bullets (middle) + included models (bottom) */}
          <div className="lg:col-span-5 relative self-start">
            {/* Top: stats */}
            <div className="text-right">
              <div className="text-xs font-medium text-white/90 mb-1 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                {t("hero.avgSavings")}
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                67%
              </div>
              <div className="text-sm text-white/90 mt-1 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                {t("hero.vsAvulsas")}
              </div>
            </div>

            {/* Middle: bullets */}
            <ul className="mt-12 sm:mt-24 space-y-2 text-xs sm:text-sm text-white text-right [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
              <li className="flex items-center justify-end gap-2">
                {t("hero.bullet1")}
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
              <li className="flex items-center justify-end gap-2">
                {t("hero.bullet2")}
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
              <li className="flex items-center justify-end gap-2">
                {t("hero.bullet3")}
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </li>
            </ul>

            {/* Bottom: included models */}
            <div className="mt-12 sm:mt-24 text-right">
              <div className="text-xs font-medium text-white/90 mb-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                {t("hero.included")}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {aiModels.map((m) =>
                <span
                  key={m.name}
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-800 bg-white/90 border border-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <img src={m.logo} alt={m.name} className="w-4 h-4 object-contain" />
                  {m.name}
                </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}
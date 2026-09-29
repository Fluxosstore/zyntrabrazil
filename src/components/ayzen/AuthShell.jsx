import React from "react";
import { Sun } from "lucide-react";
import LanguageSwitcher from "@/components/ayzen/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

const HERO_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/5f3e11fd3_quality_restoration_20260929160751648.jpg";

export default function AuthShell({ children }) {
  const { t } = useLanguage();

  return (
    <div className="h-[100dvh] lg:h-screen flex flex-col bg-white overflow-hidden relative">
      {/* top-right controls - at top of page on mobile, top-right of content on desktop */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-8 flex items-center gap-2 lg:gap-3 z-20">
        <LanguageSwitcher variant="pill" />

        <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#4A4A4A] hover:bg-gray-100 transition-colors">
          <Sun className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile hero image on top */}
      <div className="lg:hidden relative h-[40vh] shrink-0">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left hero - desktop */}
        <div className="hidden lg:flex lg:w-3/5 relative">
          <img
            src={HERO_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/60 to-transparent" />
          <div className="relative flex flex-col justify-end p-12 z-10">
            <p className="text-xs font-medium tracking-[0.2em] text-white/80 uppercase mb-3">
              {t("auth.platform")}
            </p>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3 max-w-md">
              {t("auth.heroTitle")}
            </h2>
            <p className="text-sm text-white/80 max-w-md leading-relaxed">
              {t("auth.heroDesc")}
            </p>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative flex flex-col min-h-0">
          {/* centered content */}
          <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0 overflow-y-auto">
            <div className="w-full max-w-sm">{children}</div>
          </div>

          {/* bottom copyright */}
          <div className="px-6 py-3 lg:px-8 lg:py-6 lg:text-right text-center shrink-0">
            <p className="text-[10px] lg:text-xs text-[#555]">{t("auth.copyright")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
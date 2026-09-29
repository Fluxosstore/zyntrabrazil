import React from "react";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const footerCols = [
    { title: t("footer.col1Title"), links: t("footer.col1Links") },
    { title: t("footer.col2Title"), links: t("footer.col2Links") },
    { title: t("footer.col3Title"), links: t("footer.col3Links") },
  ];

  return (
    <footer className="bg-[#FAFAFA]">
      {/* Pre-footer CTA */}
      <div className="bg-[#FAFAFA]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left - text content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c52ff]" />
                <span className="text-xs font-medium tracking-widest text-[#666666] uppercase">
                  {t("footer.badge")}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
                <span className="text-[#111111]">{t("footer.title")}</span>
                <br />
                <span className="text-[#8c52ff]">{t("footer.titleHighlight")}</span>
              </h2>
              <p className="mt-6 text-base text-[#666666] leading-relaxed max-w-md">
                {t("footer.desc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a
                  href="#planos"
                  className="inline-flex items-center gap-2 bg-[#8c52ff] hover:bg-[#7c3aed] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5">

                  {t("footer.verPlanos")}
                </a>
                <a
                  href="#ias"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#8c52ff] transition-colors">

                  {t("footer.conhecerIas")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#666666]">
                <span>{t("footer.benefit1")}</span>
                <span className="text-[#cccccc]">•</span>
                <span>{t("footer.benefit2")}</span>
                <span className="text-[#cccccc]">•</span>
                <span>{t("footer.benefit3")}</span>
              </div>
            </div>

            {/* Right - visual */}
            <div className="order-1 lg:order-2 relative rounded-3xl overflow-hidden min-h-[320px] lg:min-h-[440px]">
              <img
                src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3d455afee_ChatGPTImage17desetde202601_13_21.png"
                alt="Astronauta em paisagem lunar olhando para uma esfera de energia"
                className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Soft white gradients on top, bottom and right edge */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAFAFA] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="text-gray-400 bg-[#FAFAFA]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <img
                  src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/057474ffd_quality_restoration_20260928203908003.png"
                  alt="Zyntra"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-black">Zyntra</span>
              </a>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                {t("footer.brandDesc")}
              </p>
            </div>

            {/* Link columns */}
            {footerCols.map((col) =>
            <div key={col.title}>
                <h4 className="text-sm font-semibold text-black mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) =>
                <li key={l}>
                      <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-violet-400 transition-colors">
                    
                        {l}
                      </a>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>

          {/* Legal bar */}
          <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {t("footer.terms")}
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {t("footer.privacy")}
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {t("footer.cookies")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>);

}
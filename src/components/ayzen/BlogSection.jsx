import React from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function BlogSection() {
  const { t } = useLanguage();
  const featured = {
    tag: t("blog.featuredTag"),
    title: t("blog.featuredTitle"),
    cta: t("blog.featuredCta"),
    img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/78dbb0c79_ChatGPTImage17desetde202600_46_49.png",
  };

  const sidePosts = [
    { tag: t("blog.side1Tag"), title: t("blog.side1Title") },
    { tag: t("blog.side2Tag"), title: t("blog.side2Title") },
  ];

  return (
    <section id="blog" className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5dfa]" />
              <span className="text-xs font-medium tracking-widest text-[#707070] uppercase">
                {t("blog.badge")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
              <span className="text-[#1a1a1a]">{t("blog.title")}</span>
              <br />
              <span className="text-[#7c5dfa]">{t("blog.titleHighlight")}</span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:mt-16 flex flex-col items-end">
            <p className="text-sm text-[#707070] leading-relaxed mb-5">
              {t("blog.desc")}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a1a1a] hover:text-[#7c5dfa] transition-colors self-end"
            >
              {t("blog.accessBlog")}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large featured card */}
          <a
            href="#"
            className="group relative bg-[#F9F9F9] rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 min-h-[460px] flex flex-col justify-between p-8"
          >
            <img
              src={featured.img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="relative z-10 flex items-center gap-2 text-[#666666]">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium tracking-widest uppercase bg-white/70 backdrop-blur px-2 py-1 rounded-full">
                {featured.tag}
              </span>
            </div>
            <div className="relative z-10 max-w-md">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] leading-tight mb-5">
                {featured.title}
              </h3>
              <div className="inline-flex items-center gap-3">
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  {featured.cta}
                </span>
                <span className="w-9 h-9 rounded-full border border-[#DDDDDD] bg-[#ffffff] flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-[#1a1a1a] group-hover:text-white transition-colors" />
                </span>
              </div>
            </div>
          </a>

          {/* Right column - stacked cards */}
          <div className="flex flex-col gap-6">
            {sidePosts.map((p) => (
              <a
                key={p.title}
                href="#"
                className="group bg-[#F9F9F9] rounded-3xl p-8 flex flex-col justify-between flex-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div>
                  <span className="text-xs font-medium tracking-widest uppercase text-[#666666]">
                    {p.tag}
                  </span>
                  <h3 className="mt-4 text-lg lg:text-xl font-bold text-[#111111] leading-snug">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex justify-end">
                  <span className="w-9 h-9 rounded-full border border-[#DDDDDD] flex items-center justify-center group-hover:bg-[#111111] group-hover:border-[#111111] transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
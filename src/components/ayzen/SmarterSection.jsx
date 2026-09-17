import React from "react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function SmarterSection() {
  const { t } = useLanguage();
  const cards = [
    {
      num: "01",
      title: t("smarter.card1Title"),
      desc: t("smarter.card1Desc"),
      img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/0d8aac86f_quality_restoration_20260917024803194.jpg",
      stats: [
        { value: t("smarter.card1Stat1"), label: t("smarter.card1Stat1Label") },
        { value: t("smarter.card1Stat2"), label: t("smarter.card1Stat2Label") },
      ],
    },
    {
      num: "02",
      title: t("smarter.card2Title"),
      desc: t("smarter.card2Desc"),
      img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/20ecbddfa_quality_restoration_20260917024816699.jpg",
      stats: [
        { value: t("smarter.card2Stat1"), label: t("smarter.card2Stat1Label") },
        { value: t("smarter.card2Stat2"), label: t("smarter.card2Stat2Label") },
      ],
    },
    {
      num: "03",
      title: t("smarter.card3Title"),
      desc: t("smarter.card3Desc"),
      img: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/f728bb9cf_quality_restoration_20260917024836989.jpg",
      stats: [
        { value: t("smarter.card3Stat1"), label: t("smarter.card3Stat1Label") },
        { value: t("smarter.card3Stat2"), label: t("smarter.card3Stat2Label") },
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-black">03</span>
              <span className="w-px h-6 bg-gray-300" />
              <span className="text-sm font-medium text-gray-400">{t("smarter.counter")}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {t("smarter.title")}
              <br />
              <span className="text-violet-600">{t("smarter.titleHighlight")}</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed lg:max-w-sm lg:mt-16">
            {t("smarter.desc")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300"
            >
              <Image
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
                fittingType="fill"
              />
              <div className="relative h-full flex flex-col justify-end p-4">
                <div className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                  <span className="inline-flex self-start items-center px-2.5 py-1 rounded-full bg-[#444] text-white text-xs font-semibold mb-3">
                    {c.num}
                  </span>
                  <h3 className="text-xl font-bold text-[#222] mb-2">{c.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {c.desc}
                  </p>
                  <div className="h-px bg-gray-200 my-4" />
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1">
                      {c.stats.map((s) => (
                        <div key={s.label} className="text-sm">
                          <span className="font-bold text-[#222]">{s.value}</span>{" "}
                          <span className="text-[#999]">{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href="#planos"
                      className="inline-flex items-center justify-center bg-[#7F56D9] hover:bg-[#6941C6] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                    >
                      {t("smarter.verPlanos")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
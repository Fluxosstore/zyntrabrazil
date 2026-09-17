import React from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

function Card({ t }) {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-gray-200" />
        {t.metric && (
          <span className="text-sm font-bold text-gray-900">{t.metric}</span>
        )}
      </div>
      <p className="text-sm text-[#333333] leading-relaxed mb-6 min-h-[80px]">
        {t.text}
      </p>
      <div className="flex items-center gap-3">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">{t.name}</div>
          <div className="text-[10px] tracking-wider text-[#888888] uppercase">
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsCarousel() {
  const { t } = useLanguage();

  const rowOne = [
    {
      text: t("tc.r1t1"),
      metric: "-54%",
      name: "João Vasconcellos",
      role: t("tc.r1r1"),
      avatar: "https://images.unsplash.com/photo-1500648766838-d5cf13b1e1b4?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r1t2"),
      name: "Mariana Souza",
      role: t("tc.r1r2"),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r1t3"),
      name: "Rafael Tinoco",
      role: t("tc.r1r3"),
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r1t4"),
      name: "Camila Andrade",
      role: t("tc.r1r4"),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
    },
  ];

  const rowTwo = [
    {
      text: t("tc.r2t1"),
      name: "Beatriz Monteiro",
      role: t("tc.r2r1"),
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b3fba?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r2t2"),
      metric: "-68%",
      name: "Diego Ramos",
      role: t("tc.r2r2"),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r2t3"),
      name: "Fernanda Lima",
      role: t("tc.r2r3"),
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces",
    },
    {
      text: t("tc.r2t4"),
      name: "Lucas Pereira",
      role: t("tc.r2r4"),
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=faces",
    },
  ];

  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <div className="flex gap-5 animate-[carousel-left_40s_linear_infinite]">
        {[...rowOne, ...rowOne].map((card, i) => (
          <Card key={`r1-${i}`} t={card} />
        ))}
      </div>
      <div className="flex gap-5 animate-[carousel-right_40s_linear_infinite]">
        {[...rowTwo, ...rowTwo].map((card, i) => (
          <Card key={`r2-${i}`} t={card} />
        ))}
      </div>
    </div>
  );
}
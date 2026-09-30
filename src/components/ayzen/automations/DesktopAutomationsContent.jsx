import React from "react";
import {
  Plus,
  ChevronRight,
  Mail,
  Reply,
  MessageSquare,
  Sunrise,
  CheckSquare,
  CalendarPlus,
  Video,
  FolderSync,
  FolderTree,
  Languages,
  GitPullRequest,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Cake,
  Clock } from
"lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { AUTOMATION_TEMPLATES } from "./automationTemplates";

const HEADER_IMAGE =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/065557b31_ChatGPTImage29desetde202621_44_26.png";

const ICONS = {
  Mail,
  Reply,
  MessageSquare,
  Sunrise,
  CheckSquare,
  CalendarPlus,
  Video,
  FolderSync,
  FolderTree,
  Languages,
  GitPullRequest,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Cake,
  Clock
};

function DesktopAutomationCard({ template, onClick }) {
  const Icon = ICONS[template.icon] || Clock;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-left">
      
      <div className="w-10 h-10 rounded-xl bg-[#F4F4F6] border border-gray-200 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-black truncate">{template.title}</p>
        <p className="text-xs text-gray-500 truncate">{template.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
    </button>);

}

export default function DesktopAutomationsContent({ onNewAutomation, onSelectTemplate }) {
  const { t } = useLanguage();
  const steps = [
  { n: 1, title: t("auto.step1Title"), desc: t("auto.step1Desc") },
  { n: 2, title: t("auto.step2Title"), desc: t("auto.step2Desc") },
  { n: 3, title: t("auto.step3Title"), desc: t("auto.step3Desc") }];


  return (
    <div className="flex-1 overflow-y-auto relative bg-white">
      {/* Banner image — full width at top, astronaut pinned right, blended into white */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 h-[440px] pointer-events-none">
        <img
          src={HEADER_IMAGE}
          alt=""
          className="w-full h-full object-cover object-right-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="relative px-8 py-8">
      {/* Hero */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 max-w-xl">
          <h1 className="text-3xl font-bold text-black leading-tight">{t("auto.heroTitle1")}<br />{t("auto.heroTitle2")}</h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">{t("auto.heroDesc1")}<br />{t("auto.heroDesc2")}</p>
          <div className="mt-6 space-y-3">
            {steps.map((s) =>
            <div key={s.n} className="flex items-start gap-3">
                <span className="text-sm font-bold text-gray-400 shrink-0 w-5 text-center pt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-black">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onNewAutomation}
            className="mt-6 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] transition-colors">
            
            <Plus className="w-4 h-4" />
            {t("auto.newAutomation")}
          </button>
        </div>
        <div className="hidden lg:block shrink-0">
          <img src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ec2419a5c_Capturadetela2026-09-29202923.png" alt="" className="w-56 h-56 object-contain hidden" />
        </div>
      </div>

      {/* Lower section — wrapped in an outer light-gray card */}
      <div className="mt-10 bg-[#f3f3f5] rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-black">{t("auto.createFirst")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("auto.createFirstDesc")}</p>
          </div>
          <button
            onClick={onNewAutomation}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7b5db7] text-white text-sm font-medium hover:bg-[#6d28d9] transition-colors shrink-0">
            
            <Plus className="w-4 h-4" />
            {t("auto.newAutomation")}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {AUTOMATION_TEMPLATES.slice(0, 4).map((tpl) =>
          <DesktopAutomationCard
            key={tpl.id}
            template={tpl}
            onClick={() => onSelectTemplate(tpl)} />

          )}
        </div>
      </div>
      </div>
    </div>);

}
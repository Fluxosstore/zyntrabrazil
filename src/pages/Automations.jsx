import React, { useState } from "react";
import {
  Send, Plus, PanelLeftClose, MessageSquarePlus, ChevronRight,
  Mail, Reply, MessageSquare, Sunrise, CheckSquare, CalendarPlus, Video,
  FolderSync, FolderTree, Languages, GitPullRequest, BarChart3,
  TrendingUp, AlertCircle, Cake, Clock, Zap, Bell,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import MobileAutomationCard from "@/components/ayzen/automations/MobileAutomationCard";
import NewAutomationModal from "@/components/ayzen/automations/NewAutomationModal";
import { AUTOMATION_TEMPLATES } from "@/components/ayzen/automations/automationTemplates";

const ASTRONAUT =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/81e46fe3d_empty-astronaut-removebg-preview.png";

const TEMPLATE_ICONS = {
  Mail, Reply, MessageSquare, Sunrise, CheckSquare, CalendarPlus, Video,
  FolderSync, FolderTree, Languages, GitPullRequest, BarChart3,
  TrendingUp, AlertCircle, Cake, Clock, Zap, Bell,
};

export default function Automations() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const openModal = (tpl) => {
    if (tpl) {
      setPrefill({
        name: tpl.title,
        instructions: tpl.desc,
      });
    } else {
      setPrefill(null);
    }
    setModalOpen(true);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen bg-[#F4F4F6] overflow-hidden">
        <div className="flex-1 flex flex-col p-2">
          {/* Header bar */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center text-[#333333] hover:bg-gray-200/60 rounded-lg transition-colors"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
            <button
              onClick={() => openModal(null)}
              className="w-9 h-9 flex items-center justify-center text-[#333333] hover:bg-gray-200/60 rounded-lg transition-colors"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
          </div>

          {/* White rounded container */}
          <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Hero — text left, astronaut right */}
            <div className="px-8 pt-8 pb-6 flex items-center gap-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black leading-tight">{t("auto.heroTitle1")},</h1>
                <p className="text-3xl font-bold text-black leading-tight">{t("auto.heroTitle2")}</p>
                <p className="text-base text-gray-500 mt-3 leading-relaxed max-w-lg">{t("auto.heroDesc")}</p>

                {/* Steps */}
                <div className="mt-6 space-y-3 max-w-lg">
                  {[
                    { n: 1, title: t("auto.step1Title"), desc: t("auto.step1Desc") },
                    { n: 2, title: t("auto.step2Title"), desc: t("auto.step2Desc") },
                    { n: 3, title: t("auto.step3Title"), desc: t("auto.step3Desc") },
                  ].map((s) => (
                    <div key={s.n} className="flex items-start gap-3">
                      <span className="text-sm font-bold text-gray-400 shrink-0 w-5 text-center pt-0.5">
                        {s.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-black">{s.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openModal(null)}
                  className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7B5BC8] text-white text-sm font-medium hover:bg-[#6A4DB8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t("auto.newAutomation")}
                </button>
              </div>

              {/* Astronaut illustration */}
              <div className="hidden xl:block shrink-0">
                <img src={ASTRONAUT} alt="" className="w-64 h-64 object-contain opacity-90" />
              </div>
            </div>

            {/* Templates section */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
              <div className="rounded-2xl bg-[#F9F9FB] border border-gray-200/80 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-bold text-black">{t("auto.createFirst")}</h2>
                  <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B5BC8] text-white text-xs font-medium hover:bg-[#6A4DB8] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("auto.newAutomation")}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-5">{t("auto.createFirstDesc")}</p>

                {/* Template grid */}
                <div className="grid grid-cols-2 gap-3">
                  {AUTOMATION_TEMPLATES.map((tpl) => {
                    const Icon = TEMPLATE_ICONS[tpl.icon] || Clock;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => openModal(tpl)}
                        className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-gray-200 text-left hover:shadow-md hover:border-gray-300 transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#F4F4F6] border border-[#E5E5E7] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black truncate">{tpl.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{tpl.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <NewAutomationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={() => {}}
          prefill={prefill}
        />
      </div>

      {/* Mobile */}
      <div className="lg:hidden h-screen flex flex-col bg-[#F9F9FB] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#F5F5F7] border-b border-[#D1D1D1]">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
          <button
            onClick={() => openModal(null)}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Hero */}
          <div className="pt-2 pb-5">
            <h1 className="text-2xl font-bold text-black leading-snug">{t("auto.heroTitle1")},</h1>
            <p className="text-2xl font-bold text-black leading-snug">{t("auto.heroTitle2")}</p>
            <p className="text-base text-gray-500 mt-2 leading-relaxed">{t("auto.heroDesc")}</p>

            {/* Steps */}
            <div className="mt-5 space-y-3">
              {[
                { n: 1, title: t("auto.step1Title"), desc: t("auto.step1Desc") },
                { n: 2, title: t("auto.step2Title"), desc: t("auto.step2Desc") },
                { n: 3, title: t("auto.step3Title"), desc: t("auto.step3Desc") },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-gray-400 shrink-0 w-4 text-center pt-1.5">
                    {s.n}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-black">{s.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal(null)}
              className="mt-5 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#7B5BC8] text-white text-sm font-medium active:bg-[#6A4DB8] transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("auto.newAutomation")}
            </button>
          </div>

          {/* Templates container */}
          <div className="rounded-2xl bg-white border border-gray-200/80 p-4">
            <h2 className="text-base font-bold text-black">{t("auto.createFirst")}</h2>
            <p className="text-xs text-gray-500 mt-1">{t("auto.createFirstDesc")}</p>

            <button
              onClick={() => openModal(null)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#7B5BC8] text-white text-sm font-medium active:bg-[#6A4DB8] transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("auto.newAutomation")}
            </button>

            {/* Template list */}
            <div className="mt-4 space-y-2">
              {AUTOMATION_TEMPLATES.map((tpl) => (
                <MobileAutomationCard key={tpl.id} template={tpl} onClick={() => openModal(tpl)} />
              ))}
            </div>
          </div>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <NewAutomationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={() => {}}
          prefill={prefill}
        />
      </div>
    </>
  );
}
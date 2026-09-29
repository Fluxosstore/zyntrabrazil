import React, { useState } from "react";
import { Send, Plus, PanelLeftClose, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import AutomationCatalog from "@/components/ayzen/automations/AutomationCatalog";
import MobileAutomationCard from "@/components/ayzen/automations/MobileAutomationCard";
import NewAutomationModal from "@/components/ayzen/automations/NewAutomationModal";
import { AUTOMATION_TEMPLATES } from "@/components/ayzen/automations/automationTemplates";

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
      <div className="hidden lg:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="automations" />

        <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl">
              <h1 className="text-2xl font-bold text-black">{t("auto.title")}</h1>
              <p className="text-sm text-gray-500 mt-1.5">{t("auto.desc1")}</p>
              <p className="text-sm text-gray-500 mt-1 max-w-2xl">{t("auto.desc2")}</p>
            </div>
          </div>

          {/* Telegram integration */}
          <div className="px-8 pb-6">
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#2AABEE] flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black">Telegram</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("auto.telegramDesc")}</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors shrink-0">
                {t("auto.connect")}
              </button>
            </div>
          </div>

          {/* Catalog */}
          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-black">Automações prontas</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ative um modelo para começar. Você pode desativar quando quiser.</p>
            </div>
            <AutomationCatalog />
          </div>
        </main>
      </div>

      {/* Mobile */}
      <div className="lg:hidden h-screen flex flex-col bg-[#F9F9FB] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#F5F5F7] border-b border-[#D1D1D1]">
          <button
            onClick={() => setSidebarOpen(true)}
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
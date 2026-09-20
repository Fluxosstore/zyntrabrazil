import React, { useState } from "react";
import { Clock, Send, Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import AutomationCatalog from "@/components/ayzen/automations/AutomationCatalog";

export default function Automations() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
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
      <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-black">{t("auto.title")}</span>
          <div className="w-9" />
        </div>

        <div className="px-4 pt-6 pb-4">
          <div className="p-5 bg-white border border-gray-200 rounded-2xl">
            <h1 className="text-xl font-bold text-black">{t("auto.title")}</h1>
            <p className="text-sm text-gray-500 mt-1.5">{t("auto.desc1")}</p>
            <p className="text-sm text-gray-500 mt-1">{t("auto.desc2")}</p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#2AABEE] flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black">Telegram</p>
              <p className="text-xs text-gray-500 mt-0.5">{t("auto.telegramDesc")}</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-black text-white text-xs font-medium shrink-0">
              {t("auto.connect")}
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-black">Automações prontas</h2>
            <p className="text-xs text-gray-500 mt-0.5">Ative um modelo para começar.</p>
          </div>
          <AutomationCatalog />
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
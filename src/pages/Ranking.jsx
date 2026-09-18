import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import RankingChart from "@/components/ayzen/ranking/RankingChart";
import RankingTable from "@/components/ayzen/ranking/RankingTable";
import RankingFilters from "@/components/ayzen/ranking/RankingFilters";

export default function Ranking() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("usage");

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pr-2 gap-2">
        <DashboardSidebar activePage="ranking" />
        <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">{t("ranking.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("ranking.subtitle")}</p>
              </div>
              {/* Toggle Uso/Qualidade */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setView("usage")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    view === "usage" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("ranking.usage")}
                </button>
                <button
                  onClick={() => setView("quality")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    view === "quality" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("ranking.quality")}
                </button>
              </div>
            </div>

            {/* Filters */}
            <RankingFilters />

            {/* Chart + Top 3 */}
            <RankingChart />

            {/* Full ranking */}
            <div>
              <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.fullRankingDesc")}</p>
              <RankingTable />
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] text-gray-400 pb-2">{t("ranking.footer")}</p>
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
          <span className="text-sm font-semibold text-black">{t("ranking.title")}</span>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-black">{t("ranking.title")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("ranking.subtitle")}</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-fit">
            <button
              onClick={() => setView("usage")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${view === "usage" ? "bg-white text-black" : "text-gray-500"}`}
            >
              {t("ranking.usage")}
            </button>
            <button
              onClick={() => setView("quality")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${view === "quality" ? "bg-white text-black" : "text-gray-500"}`}
            >
              {t("ranking.quality")}
            </button>
          </div>
          <RankingChart />
          <div>
            <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.fullRankingDesc")}</p>
            <RankingTable />
          </div>
          <p className="text-center text-[11px] text-gray-400">{t("ranking.footer")}</p>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
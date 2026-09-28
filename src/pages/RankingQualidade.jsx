import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import QualityChart from "@/components/ayzen/ranking/QualityChart";
import QualityTable from "@/components/ayzen/ranking/QualityTable";
import MobileQualityList from "@/components/ayzen/ranking/MobileQualityList";
import QualityFilters from "@/components/ayzen/ranking/QualityFilters";

export default function RankingQualidade() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metric, setMetric] = useState("intelligence");

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="ranking" />
        <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">{t("ranking.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("ranking.qualitySubtitle")}</p>
              </div>
              {/* Toggle Uso/Qualidade */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => navigate("/ranking")}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t("ranking.usage")}
                </button>
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-black shadow-sm"
                >
                  {t("ranking.quality")}
                </button>
              </div>
            </div>

            {/* Filters */}
            <QualityFilters metric={metric} setMetric={setMetric} />

            {/* Chart + Top 3 */}
            <QualityChart metric={metric} />

            {/* Full ranking */}
            <div>
              <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.qualityFullRankingDesc")}</p>
              <QualityTable />
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] text-gray-400 pb-2">{t("ranking.qualityFooter")}</p>
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
            <p className="text-sm text-gray-500 mt-1">{t("ranking.qualitySubtitle")}</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-full">
            <button
              onClick={() => navigate("/ranking")}
              className="flex-1 py-2 rounded-full text-sm font-medium text-gray-500"
            >
              {t("ranking.usage")}
            </button>
            <button className="flex-1 py-2 rounded-full text-sm font-medium bg-white text-black shadow-sm">
              {t("ranking.quality")}
            </button>
          </div>
          <QualityFilters metric={metric} setMetric={setMetric} />
          <div className="rounded-2xl border border-[#EBEBEB] bg-[#F7F7F7] p-3 space-y-3">
            <div>
              <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{t("ranking.qualityFullRankingDesc")}</p>
            </div>
            <MobileQualityList />
          </div>
          <p className="text-center text-[11px] text-gray-400">{t("ranking.qualityFooter")}</p>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
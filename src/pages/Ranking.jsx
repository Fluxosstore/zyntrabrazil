import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import RankingChart from "@/components/ayzen/ranking/RankingChart";
import RankingTable from "@/components/ayzen/ranking/RankingTable";
import RankingFilters from "@/components/ayzen/ranking/RankingFilters";
import { getModalityData } from "@/components/ayzen/ranking/rankingData";

export default function Ranking() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modality, setModality] = useState("text");
  const [period, setPeriod] = useState("30d");

  const data = useMemo(() => getModalityData(modality, period), [modality, period]);

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
                <p className="text-sm text-gray-500 mt-1">{t("ranking.subtitle")}</p>
              </div>
              {/* Toggle Uso/Qualidade */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-black shadow-sm"
                >
                  {t("ranking.usage")}
                </button>
                <button
                  onClick={() => navigate("/ranking/qualidade")}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t("ranking.quality")}
                </button>
              </div>
            </div>

            {/* Filters */}
            <RankingFilters
              modality={modality}
              period={period}
              onModalityChange={setModality}
              onPeriodChange={setPeriod}
            />

            {/* Chart + Top 3 */}
            <RankingChart
              chartSeries={data.chartSeries}
              chartData={data.chartData}
              top3={data.top3}
            />

            {/* Full ranking */}
            <div>
              <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.fullRankingDesc")}</p>
              <RankingTable models={data.models} />
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
              className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black"
            >
              {t("ranking.usage")}
            </button>
            <button
              onClick={() => navigate("/ranking/qualidade")}
              className="px-3 py-1 rounded-full text-xs font-medium text-gray-500"
            >
              {t("ranking.quality")}
            </button>
          </div>
          <RankingFilters
            modality={modality}
            period={period}
            onModalityChange={setModality}
            onPeriodChange={setPeriod}
          />
          <RankingChart
            chartSeries={data.chartSeries}
            chartData={data.chartData}
            top3={data.top3}
          />
          <div>
            <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.fullRankingDesc")}</p>
            <RankingTable models={data.models} />
          </div>
          <p className="text-center text-[11px] text-gray-400">{t("ranking.footer")}</p>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
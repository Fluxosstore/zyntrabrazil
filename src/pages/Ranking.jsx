import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import RankingChart from "@/components/ayzen/ranking/RankingChart";
import RankingTable from "@/components/ayzen/ranking/RankingTable";
import MobileRankingList from "@/components/ayzen/ranking/MobileRankingList";
import RankingFilters from "@/components/ayzen/ranking/RankingFilters";
import { base44 } from "@/api/base44Client";

const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";
const DEEPSEEK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg";
const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const CLAUDE = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg";
const GROK = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";

const LOBE = "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light";
const TENCENT = `${LOBE}/tencent-color.png`;
const ZAI = `${LOBE}/zai.png`;
const XIAOMI = `${LOBE}/xiaomimimo.png`;
const NVIDIA = `${LOBE}/nvidia-color.png`;
const MINIMAX = `${LOBE}/minimax-color.png`;
const KIMI = `${LOBE}/kimi-color.png`;
const META = `${LOBE}/meta-color.png`;
const MISTRAL = `${LOBE}/mistral-color.png`;
const COHERE = `${LOBE}/cohere-color.png`;
const QWEN = `${LOBE}/qwen-color.png`;
const MICROSOFT = `${LOBE}/microsoft-color.png`;
const ZEROONE = `${LOBE}/zeroone-color.png`;
const DBRX = `${LOBE}/dbrx-color.png`;
const UPSTAGE = `${LOBE}/upstage-color.png`;
const POOLSIDE = `${LOBE}/poolside-color.png`;
const OPENROUTER = `${LOBE}/openrouter-color.png`;

const VENDOR_LOGOS = {
  openai: GPT,
  anthropic: CLAUDE,
  google: GEMINI,
  deepseek: DEEPSEEK,
  "x-ai": GROK,
  xai: GROK,
  tencent: TENCENT,
  "z.ai": ZAI,
  zai: ZAI,
  xiaomi: XIAOMI,
  nvidia: NVIDIA,
  minimax: MINIMAX,
  moonshotai: KIMI,
  moonshot: KIMI,
  meta: META,
  mistral: MISTRAL,
  cohere: COHERE,
  alibaba: QWEN,
  qwen: QWEN,
  microsoft: MICROSOFT,
  "01.ai": ZEROONE,
  "01ai": ZEROONE,
  databricks: DBRX,
  upstage: UPSTAGE,
  poolside: POOLSIDE,
  openrouter: OPENROUTER,
};

function getLogo(vendor) {
  let key = (vendor || "").toLowerCase().trim();
  // Remove common prefixes/suffixes from API vendor names
  key = key.replace(/^~+/, "").replace(/^meta-llama$/, "meta").replace(/^z-ai$/, "z.ai");
  if (VENDOR_LOGOS[key]) return VENDOR_LOGOS[key];
  // Try partial match: if any key is contained in the vendor name
  for (const k of Object.keys(VENDOR_LOGOS)) {
    if (key.includes(k) || k.includes(key)) return VENDOR_LOGOS[k];
  }
  const letter = (vendor || "?").replace(/^~+/, "").charAt(0).toUpperCase();
  const colors = ["#7E57C2", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
  const color = colors[letter.charCodeAt(0) % colors.length];
  return { type: "circle", letter, color };
}

function formatContext(len) {
  if (len >= 1000000) return `${(len / 1000000).toFixed(1).replace(".", ",")}M`;
  if (len >= 1000) return `${Math.round(len / 1000)}K`;
  return `${len}`;
}

export default function Ranking() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modality, setModality] = useState("text");
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawModels, setRawModels] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchRanking() {
      setLoading(true);
      setError(null);
      try {
        const result = await base44.functions.invoke("openrouterRanking", { modality });
        if (cancelled) return;
        if (result.data?.error) throw new Error(result.data.error);
        setRawModels(result.data?.models || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Erro ao carregar ranking");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRanking();
    return () => { cancelled = true; };
  }, [modality]);

  const data = useMemo(() => {
    if (rawModels.length === 0) return { models: [], top3: [] };
    const totalContext = rawModels.reduce((sum, m) => sum + (m.contextLength || 0), 0);
    const models = rawModels.map((m) => ({
      rank: m.rank,
      name: m.name,
      vendor: m.vendor,
      logo: getLogo(m.vendor),
      tokens: formatContext(m.contextLength),
      tokensNum: m.contextLength / 1000,
      share: totalContext > 0 ? (m.contextLength / totalContext) * 100 : 0,
      contextLength: m.contextLength,
    }));
    return { models, top3: models.slice(0, 3) };
  }, [rawModels]);

  const renderContent = (mobile = false) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#7E57C2] rounded-full animate-spin" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-20">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => setModality((m) => m)}
            className="mt-3 text-xs text-[#7E57C2] font-medium hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    if (data.models.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-sm text-gray-500">Nenhum modelo encontrado para esta modalidade.</p>
        </div>
      );
    }
    if (mobile) {
      return (
        <div className="rounded-2xl border border-[#EBEBEB] bg-[#F7F7F7] p-3 space-y-3">
          <div>
            <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t("ranking.fullRankingDesc")}</p>
          </div>
          <MobileRankingList models={data.models} />
        </div>
      );
    }
    return (
      <>
        <RankingChart models={data.models} top3={data.top3} />
        <div>
          <h3 className="text-base font-bold text-black">{t("ranking.fullRanking")}</h3>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">{t("ranking.fullRankingDesc")}</p>
          <RankingTable models={data.models} />
        </div>
      </>
    );
  };

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

            {renderContent()}

            {/* Footer */}
            <p className="text-center text-[11px] text-gray-400 pb-2">
              Dados em tempo real via OpenRouter · Ordenado por janela de contexto
            </p>
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
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-full">
            <button
              className="flex-1 py-2 rounded-full text-sm font-medium bg-white text-black shadow-sm"
            >
              {t("ranking.usage")}
            </button>
            <button
              onClick={() => navigate("/ranking/qualidade")}
              className="flex-1 py-2 rounded-full text-sm font-medium text-gray-500"
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
          {renderContent(true)}
          <p className="text-center text-[11px] text-gray-400">
            Dados em tempo real via OpenRouter · Ordenado por janela de contexto
          </p>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
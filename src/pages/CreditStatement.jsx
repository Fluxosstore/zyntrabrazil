import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Calendar, MessageCircle, RefreshCw, ChevronDown,
  ChevronRight, Sparkles, PanelLeft, MessageSquarePlus,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import {
  MODELS_BY_PLAN, IMAGE_MODELS, IMAGE_MODELS_BY_PLAN,
  AUDIO_MODELS, AUDIO_MODELS_BY_PLAN, LOGO,
} from "@/components/ayzen/ModelSelector";

const MODEL_LOGO_BY_NAME = (() => {
  const map = { "Zyntra Auto": LOGO };
  const arrays = [
    ...Object.values(MODELS_BY_PLAN),
    IMAGE_MODELS,
    ...Object.values(IMAGE_MODELS_BY_PLAN),
    AUDIO_MODELS,
    ...Object.values(AUDIO_MODELS_BY_PLAN),
  ];
  for (const arr of arrays) {
    for (const m of arr || []) {
      if (m && m.name && m.logo) map[m.name] = m.logo;
    }
  }
  return map;
})();

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatCredits(n) {
  return Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const TABS = [
  { id: "tudo", label: "Tudo" },
  { id: "gastos", label: "Gastos" },
  { id: "entradas", label: "Entradas" },
  { id: "vencimentos", label: "Vencimentos" },
];

export default function CreditStatement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tudo");
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const records = await base44.entities.TokenUsage.list("-created_date", 500);
        setMovements(records || []);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter movements based on tab
  const filtered = movements.filter((m) => {
    const tokens = m.tokens || 0;
    if (activeTab === "gastos") return tokens < 0;
    if (activeTab === "entradas") return tokens > 0;
    if (activeTab === "vencimentos") return false;
    return true;
  });

  // Summary calculations
  const totalGasto = movements
    .filter((m) => (m.tokens || 0) < 0)
    .reduce((s, m) => s + Math.abs(m.tokens || 0), 0);
  const totalEntradas = movements
    .filter((m) => (m.tokens || 0) > 0)
    .reduce((s, m) => s + (m.tokens || 0), 0);
  const totalAcoes = movements.length;

  const getSummary = () => {
    if (activeTab === "gastos") {
      return {
        label: "GASTO NO PERÍODO",
        value: formatCredits(totalGasto),
        sublabel: "Todo o período",
        actions: filtered.length,
        showEntradas: false,
      };
    }
    if (activeTab === "entradas") {
      return {
        label: "ENTRADAS NO PERÍODO",
        value: formatCredits(totalEntradas),
        sublabel: "Todo o período",
        actions: filtered.length,
        showEntradas: false,
      };
    }
    if (activeTab === "vencimentos") {
      return {
        label: "VENCIMENTOS NO PERÍODO",
        value: "0",
        sublabel: "Todo o período",
        actions: 0,
        showEntradas: false,
      };
    }
    return {
      label: "GASTO NO PERÍODO",
      value: formatCredits(totalGasto),
      sublabel: "Todo o período",
      entradas: totalEntradas,
      actions: totalAcoes,
      showEntradas: true,
    };
  };

  const summary = getSummary();
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const hasFilters = activeTab !== "tudo";
  const isEmpty = filtered.length === 0;

  const clearFilters = () => {
    setActiveTab("tudo");
    setPage(0);
  };

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden min-h-screen bg-[#F4F5F7] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#F5F5F7] border-b border-[#D1D1D1]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          {/* Back link */}
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-0.5 text-xs text-gray-500 mb-2 mt-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Voltar para a carteira
          </button>

          {/* Title */}
          <h1 className="text-2xl font-bold text-black mb-1">Extrato de créditos</h1>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Cada ação que usou ou trouxe créditos, com o valor e a origem.
          </p>

          {/* Summary card */}
          <div className="bg-black rounded-2xl p-5 mb-4">
            <p className="text-[11px] font-semibold tracking-wider text-white/60 mb-2">
              {summary.label}
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-white">{summary.value}</span>
              <span className="text-sm text-white/70">créditos</span>
            </div>
            <p className="text-xs text-white/60 mb-4">{summary.sublabel}</p>
            <div className={`flex gap-8 pt-3 border-t border-white/10 ${summary.showEntradas ? "" : ""}`}>
              {summary.showEntradas && (
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-white/60">ENTRADAS</p>
                  <p className="text-sm font-semibold text-white">+{formatCredits(summary.entradas)}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-white/60">AÇÕES</p>
                <p className="text-sm font-semibold text-white">{summary.actions}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#E8E8ED] rounded-full p-1 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(0);
                }}
                className={`flex-1 py-2 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-full mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-black flex-1">Todo o período</span>
          </div>

          {/* Limpar filtros button */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2.5 rounded-full border border-gray-300 text-xs font-medium text-black mb-4 hover:bg-gray-50 transition-colors"
            >
              Limpar filtros
            </button>
          )}

          {/* Movements card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h2 className="text-base font-bold text-black mb-4">Movimentações</h2>

            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 w-full">
                  <img
                    src={LOGO}
                    alt=""
                    className="w-16 h-16 mx-auto mb-4 object-contain opacity-80"
                  />
                  <p className="text-sm font-semibold text-black mb-1">Nada com esses filtros</p>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Troque o tipo ou o período para ver outras movimentações.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-medium text-black"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Movement rows */}
                <div>
                  {paged.map((m, idx) => {
                    const tokens = m.tokens || 0;
                    const isPositive = tokens > 0;
                    const isPlanCredit =
                      m.model === "Créditos do plano" ||
                      m.prompt === "Créditos do plano" ||
                      (isPositive && !m.model);
                    const badgeLabel = isPlanCredit ? "Créditos do plano" : "Conversa";
                    const description = m.prompt || (isPlanCredit ? "Créditos do plano" : "Conversa");
                    const modelLogo = m.model ? MODEL_LOGO_BY_NAME[m.model] : null;
                    return (
                      <div key={m.id}>
                        {idx > 0 && <div className="border-t border-gray-100" />}
                        <div className="py-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                              {isPlanCredit ? (
                                <RefreshCw className="w-3 h-3" />
                              ) : (
                                <MessageCircle className="w-3 h-3" />
                              )}
                              {badgeLabel}
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                isPositive ? "text-[#2E7D32]" : "text-[#D32F2F]"
                              }`}
                            >
                              {isPositive ? "+" : "-"}
                              {formatCredits(tokens)}
                            </span>
                          </div>
                          <p className="text-sm text-black mb-1 truncate">{description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatDate(m.created_date)}
                            </span>
                            {m.model && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                {modelLogo ? (
                                  <img
                                    src={modelLogo}
                                    alt={m.model}
                                    className="w-3 h-3 rounded object-contain"
                                  />
                                ) : (
                                  <Sparkles className="w-3 h-3 text-orange-500" />
                                )}
                                {m.model}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Por página</span>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-xs text-black">
                      {perPage}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {page * perPage + 1}-{Math.min((page + 1) * perPage, filtered.length)} de{" "}
                      {filtered.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Feedback button */}
        <button className="fixed bottom-6 right-4 px-4 py-2.5 rounded-xl bg-[#3B348B] text-white text-xs font-medium shadow-lg z-40">
          Feedback
        </button>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-8">
              {/* Back link */}
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-0.5 text-xs text-gray-500 mb-2"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar para a carteira
              </button>

              <h1 className="text-2xl font-bold text-black mb-1">Extrato de créditos</h1>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Cada ação que usou ou trouxe créditos, com o valor e a origem.
              </p>

              {/* Summary card */}
              <div className="bg-black rounded-2xl p-5 mb-4">
                <p className="text-[11px] font-semibold tracking-wider text-white/60 mb-2">
                  {summary.label}
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-white">{summary.value}</span>
                  <span className="text-sm text-white/70">créditos</span>
                </div>
                <p className="text-xs text-white/60 mb-4">{summary.sublabel}</p>
                <div className="flex gap-8 pt-3 border-t border-white/10">
                  {summary.showEntradas && (
                    <div>
                      <p className="text-[11px] font-semibold tracking-wider text-white/60">ENTRADAS</p>
                      <p className="text-sm font-semibold text-white">+{formatCredits(summary.entradas)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-white/60">AÇÕES</p>
                    <p className="text-sm font-semibold text-white">{summary.actions}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#E8E8ED] rounded-full p-1 mb-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setPage(0);
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Date filter */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-full mb-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-black flex-1">Todo o período</span>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-full border border-gray-300 text-xs font-medium text-black mb-4 hover:bg-gray-50 transition-colors"
                >
                  Limpar filtros
                </button>
              )}

              {/* Movements card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h2 className="text-base font-bold text-black mb-4">Movimentações</h2>

                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 w-full">
                      <img src={LOGO} alt="" className="w-16 h-16 mx-auto mb-4 object-contain opacity-80" />
                      <p className="text-sm font-semibold text-black mb-1">Nada com esses filtros</p>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Troque o tipo ou o período para ver outras movimentações.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 rounded-full border border-gray-300 text-xs font-medium text-black"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      {paged.map((m, idx) => {
                        const tokens = m.tokens || 0;
                        const isPositive = tokens > 0;
                        const isPlanCredit =
                          m.model === "Créditos do plano" ||
                          m.prompt === "Créditos do plano" ||
                          (isPositive && !m.model);
                        const badgeLabel = isPlanCredit ? "Créditos do plano" : "Conversa";
                        const description = m.prompt || (isPlanCredit ? "Créditos do plano" : "Conversa");
                        const modelLogo = m.model ? MODEL_LOGO_BY_NAME[m.model] : null;
                        return (
                          <div key={m.id}>
                            {idx > 0 && <div className="border-t border-gray-100" />}
                            <div className="py-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                                  {isPlanCredit ? (
                                    <RefreshCw className="w-3 h-3" />
                                  ) : (
                                    <MessageCircle className="w-3 h-3" />
                                  )}
                                  {badgeLabel}
                                </span>
                                <span
                                  className={`text-sm font-bold ${
                                    isPositive ? "text-[#2E7D32]" : "text-[#D32F2F]"
                                  }`}
                                >
                                  {isPositive ? "+" : "-"}
                                  {formatCredits(tokens)}
                                </span>
                              </div>
                              <p className="text-sm text-black mb-1 truncate">{description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {formatDate(m.created_date)}
                                </span>
                                {m.model && (
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    {modelLogo ? (
                                      <img
                                        src={modelLogo}
                                        alt={m.model}
                                        className="w-3 h-3 rounded object-contain"
                                      />
                                    ) : (
                                      <Sparkles className="w-3 h-3 text-orange-500" />
                                    )}
                                    {m.model}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">Por página</span>
                        <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-xs text-black">
                          {perPage}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {page * perPage + 1}-{Math.min((page + 1) * perPage, filtered.length)} de{" "}
                          {filtered.length}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
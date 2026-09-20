import React, { useState, useEffect } from "react";
import { Crown, Plug, X, Plus, Lock, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";
import ConnectorCatalog from "./ConnectorCatalog";
import { CONNECTORS } from "./connectorsData";

const CONNECTOR_SLOTS_BY_PLAN = {
  free: 0,
  starter: 7,
  premium: 12,
  team: 18,
  startup: 21,
  enterprise: 30,
};

function getConnectorMeta(id) {
  return CONNECTORS.find((c) => c.id === id) || null;
}

export default function ConnectorsContent({ plan = "free" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isPaid = plan && plan !== "free";
  const maxSlots = CONNECTOR_SLOTS_BY_PLAN[plan] || 0;

  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadConnectors = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.UserConnector.list("-created_date", 100);
      setConnectors(list || []);
    } catch (err) {
      console.error("Erro ao carregar conectores:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPaid) loadConnectors();
  }, [isPaid]);

  const connectedIds = new Set(connectors.map((c) => c.connector_id));
  const activeCount = connectors.filter((c) => c.active).length;
  const available = maxSlots - connectors.length;

  const handleConnect = async (connector) => {
    if (available <= 0) return;
    try {
      await base44.entities.UserConnector.create({
        connector_id: connector.id,
        name: connector.name,
        type: "prebuilt",
        category: connector.category,
        logo: connector.logo,
        active: true,
      });
      await loadConnectors();
    } catch (err) {
      console.error("Erro ao conectar:", err);
    }
  };

  const handleDisconnect = async (connector) => {
    const record = connectors.find((c) => c.connector_id === connector.id);
    if (!record) return;
    try {
      await base44.entities.UserConnector.delete(record.id);
      await loadConnectors();
    } catch (err) {
      console.error("Erro ao desconectar:", err);
    }
  };

  const handleDeleteMcp = async (recordId) => {
    try {
      await base44.entities.UserConnector.delete(recordId);
      await loadConnectors();
    } catch (err) {
      console.error("Erro ao remover conector:", err);
    }
  };

  if (!isPaid) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8 space-y-8">
          <div>
            <p className="text-xs text-gray-400">{t("settings.title")}</p>
            <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.connectors")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("settings.connectorsSubtitle")}</p>
          </div>

          <div className="border-t border-gray-200" />

          <section>
            <h2 className="text-base font-bold text-black mb-1">{t("settings.myConnectors")}</h2>
            <p className="text-xs text-gray-500 mb-3">{t("settings.myConnectorsDesc")}</p>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-black">{t("settings.connectorsPremiumTitle")}</p>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium shrink-0">
                      {t("settings.premiumFeature")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 md:whitespace-nowrap">{t("settings.connectorsPremiumDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/plan-selection")}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
              >
                {t("settings.seePlans")}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.connectors")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.connectorsSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Plug className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-black">{t("settings.connectorsHubTitle")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.connectorsHubDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.connectorsMyCount")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{connectors.length}</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.connectorsActiveCount")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{activeCount}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.connectorsAvailable")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{Math.max(0, available)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Connected connectors list */}
        {connectors.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-black mb-1">Meus conectores ativos</h2>
            <p className="text-xs text-gray-500 mb-3">Conectores conectados à sua conta.</p>
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : (
                connectors.map((conn) => {
                  const meta = getConnectorMeta(conn.connector_id);
                  const logo = conn.logo || meta?.logo;
                  return (
                    <div
                      key={conn.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {logo ? (
                          <img src={logo} alt={conn.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <Plug className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black">{conn.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {conn.type === "mcp" ? `MCP · ${conn.url}` : "Conector"}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium shrink-0">
                        Ativo
                      </span>
                      <button
                        onClick={() => handleDeleteMcp(conn.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* Available connectors catalog */}
        <ConnectorCatalog
          connectedIds={connectedIds}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Custom MCP servers */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.myConnectors")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.myConnectorsDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Plug className="w-5 h-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-black">{t("settings.addFirstConnector")}</p>
                <p className="text-xs text-gray-500 mt-1">{t("settings.addFirstConnectorDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              disabled={available <= 0}
              className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("settings.addConnectorBtn")}
            </button>
          </div>
        </section>
      </div>

      {modalOpen && (
        <ConnectorModal
          onClose={() => setModalOpen(false)}
          onSaved={loadConnectors}
          available={available}
        />
      )}
    </div>
  );
}

function ConnectorModal({ onClose, onSaved, available }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const updateHeader = (i, field, val) => {
    const next = [...headers];
    next[i] = { ...next[i], [field]: val };
    setHeaders(next);
  };
  const removeHeader = (i) => setHeaders(headers.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setError("");

    if (!name.trim() || !url.trim()) {
      setError("Nome e URL são obrigatórios.");
      return;
    }

    if (!url.startsWith("https://")) {
      setError("A URL deve começar com https://");
      return;
    }

    if (available <= 0) {
      setError("Você atingiu o limite de conectores do seu plano.");
      return;
    }

    setSaving(true);
    try {
      const cleanHeaders = headers.filter((h) => h.key.trim() && h.value.trim());
      await base44.entities.UserConnector.create({
        connector_id: `mcp-${Date.now()}`,
        name: name.trim(),
        type: "mcp",
        category: "mcp",
        url: url.trim(),
        token: token.trim() || undefined,
        headers: cleanHeaders.length > 0 ? cleanHeaders : undefined,
        active: true,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao salvar conector.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-black">{t("settings.newConnector")}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subheader */}
        <p className="px-6 pb-4 text-sm text-gray-500 shrink-0">{t("settings.newConnectorDesc")}</p>

        {/* Form */}
        <div className="px-6 space-y-5 pb-2 overflow-y-auto flex-1">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">{t("settings.connectorName")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("settings.connectorNamePlaceholder")}
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">{t("settings.connectorUrl")}</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-500">{t("settings.connectorUrlHelper")}</p>
          </div>

          {/* Token */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">{t("settings.connectorToken")}</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="w-3 h-3 shrink-0" />
              {t("settings.connectorTokenHelper")}
            </p>
          </div>

          {/* Headers */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">{t("settings.connectorHeaders")}</label>
            <p className="text-xs text-gray-500">{t("settings.connectorHeadersHelper")}</p>
            {headers.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  placeholder="Header"
                  className="flex-1 h-10 px-3 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
                <input
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder="Valor"
                  className="flex-1 h-10 px-3 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
                />
                {headers.length > 1 && (
                  <button
                    onClick={() => removeHeader(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addHeader}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("settings.addHeader")}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 rounded-xl bg-[#4B5563] text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
            {saving ? "Salvando..." : t("settings.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
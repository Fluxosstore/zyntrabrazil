import React, { useState, useEffect } from "react";
import { Crown, Plug, X, Plus, Lock, Trash2, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";
import { CONNECTORS, WORKSPACE_CONNECTOR_MAP } from "./connectorsData";

const ASTRONAUT_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/81e46fe3d_empty-astronaut-removebg-preview.png";

const SI = "https://cdn.simpleicons.org";
const WM = "https://upload.wikimedia.org/wikipedia/commons";

const CONNECTOR_SLOTS_BY_PLAN = {
  free: 0,
  starter: 7,
  premium: 12,
  team: 18,
  startup: 21,
  enterprise: 30,
};

// Google grouped as a single provider
const GOOGLE_GROUP = {
  name: "Google",
  logo: `${WM}/c/c1/Google_%22G%22_logo.svg`,
  description: "Agenda, Drive, Gmail, Contatos e Tarefas",
  connectorIds: ["gmail", "gcalendar", "gcontacts", "gtasks", "gdrive", "gdocs", "gsheets", "gmeet"],
};

// Other providers shown individually (only those with workspace connectors)
const OTHER_PROVIDERS = [
  { id: "github", name: "GitHub", logo: `${SI}/github`, description: "Revise PRs e busque issues" },
];

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
  const [connectingId, setConnectingId] = useState(null);

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
  const available = maxSlots - connectors.length;

  const mcpConnectors = connectors.filter((c) => c.type === "mcp");

  // Google group connection state
  const googleConnectedCount = GOOGLE_GROUP.connectorIds.filter((id) => connectedIds.has(id)).length;
  const googleFullyConnected = googleConnectedCount === GOOGLE_GROUP.connectorIds.length;
  const googlePartiallyConnected = googleConnectedCount > 0 && !googleFullyConnected;

  const handleConnectSingle = async (connectorId) => {
    const connector = CONNECTORS.find((c) => c.id === connectorId);
    if (!connector) return;
    const wsConnectorId = WORKSPACE_CONNECTOR_MAP[connectorId];
    try {
      if (wsConnectorId) {
        const url = await base44.connectors.connectAppUser(wsConnectorId);
        const popup = window.open(url, "_blank", "width=600,height=700");
        await base44.entities.UserConnector.create({
          connector_id: connector.id,
          name: connector.name,
          type: "prebuilt",
          category: connector.category,
          logo: connector.logo,
          active: true,
        });
        await loadConnectors();
        const timer = setInterval(async () => {
          if (!popup || popup.closed) {
            clearInterval(timer);
            await loadConnectors();
          }
        }, 800);
      } else {
        await base44.entities.UserConnector.create({
          connector_id: connector.id,
          name: connector.name,
          type: "prebuilt",
          category: connector.category,
          logo: connector.logo,
          active: true,
        });
        await loadConnectors();
      }
    } catch (err) {
      console.error("Erro ao conectar:", err);
    }
  };

  const handleConnectGoogle = async () => {
    setConnectingId("google");
    for (const id of GOOGLE_GROUP.connectorIds) {
      if (connectedIds.has(id)) continue;
      const wsConnectorId = WORKSPACE_CONNECTOR_MAP[id];
      const connector = CONNECTORS.find((c) => c.id === id);
      if (!connector) continue;
      try {
        if (wsConnectorId) {
          const url = await base44.connectors.connectAppUser(wsConnectorId);
          const popup = window.open(url, "_blank", "width=600,height=700");
          await base44.entities.UserConnector.create({
            connector_id: connector.id,
            name: connector.name,
            type: "prebuilt",
            category: connector.category,
            logo: connector.logo,
            active: true,
          });
          await loadConnectors();
          await new Promise((resolve) => {
            const timer = setInterval(() => {
              if (!popup || popup.closed) {
                clearInterval(timer);
                resolve();
              }
            }, 800);
          });
        } else {
          await base44.entities.UserConnector.create({
            connector_id: connector.id,
            name: connector.name,
            type: "prebuilt",
            category: connector.category,
            logo: connector.logo,
            active: true,
          });
          await loadConnectors();
        }
      } catch (err) {
        console.error("Erro ao conectar Google:", err);
      }
    }
    setConnectingId(null);
  };

  const handleDisconnectGoogle = async () => {
    for (const id of GOOGLE_GROUP.connectorIds) {
      const record = connectors.find((c) => c.connector_id === id);
      if (!record) continue;
      const wsConnectorId = WORKSPACE_CONNECTOR_MAP[id];
      try {
        if (wsConnectorId) {
          await base44.connectors.disconnectAppUser(wsConnectorId);
        }
        await base44.entities.UserConnector.delete(record.id);
      } catch (err) {
        console.error("Erro ao desconectar Google:", err);
      }
    }
    await loadConnectors();
  };

  const handleDisconnectSingle = async (connectorId) => {
    const record = connectors.find((c) => c.connector_id === connectorId);
    if (!record) return;
    const wsConnectorId = WORKSPACE_CONNECTOR_MAP[connectorId];
    try {
      if (wsConnectorId) {
        await base44.connectors.disconnectAppUser(wsConnectorId);
      }
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
        <div className="px-4 md:px-10 py-5 md:py-8 space-y-5 md:space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-black">Conectores</h1>
            <p className="text-sm text-gray-500 mt-1">Servidores MCP que dão ferramentas novas para a IA</p>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
            {/* Left: Meus conectores - locked */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
              <h2 className="text-base font-bold text-black mb-1">Meus conectores</h2>
              <p className="text-xs text-gray-500 mb-4">Conecte servidores MCP e a IA passa a usar as ferramentas deles nas conversas.</p>
              <div className="flex-1 flex flex-col items-center text-center py-8">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mb-4">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-base font-bold text-black">Conectores são um recurso Premium</p>
                <p className="text-sm text-gray-500 mt-1.5 max-w-xs">Conecte servidores MCP e provedores para a IA usar ferramentas externas.</p>
                <button
                  onClick={() => navigate("/plan-selection")}
                  className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Ver planos
                </button>
              </div>
            </div>

            {/* Right: Provedores - locked */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
              <h2 className="text-base font-bold text-black mb-1">Provedores</h2>
              <p className="text-xs text-gray-500 mb-4">Conecte contas de serviços conhecidos com um clique.</p>
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Lock className="w-6 h-6 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Disponível em planos pagos.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-10 py-5 md:py-8 space-y-5 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Conectores</h1>
          <p className="text-sm text-gray-500 mt-1">Servidores MCP que dão ferramentas novas para a IA</p>
        </div>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
          {/* Left: Meus conectores */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <h2 className="text-base font-bold text-black mb-1">Meus conectores</h2>
            <p className="text-xs text-gray-500 mb-4">Conecte servidores MCP e a IA passa a usar as ferramentas deles nas conversas.</p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : mcpConnectors.length === 0 ? (
              <div className="flex-1 flex flex-col items-center text-center py-6">
                <img src={ASTRONAUT_IMG} alt="Sem conectores" className="w-40 h-40 object-contain mb-6" />
                <p className="text-base font-bold text-black">Adicione seu primeiro conector</p>
                <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
                  Informe a URL de um servidor MCP e a IA ganha ferramentas novas direto no chat.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  disabled={available <= 0}
                  className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7C5DCF] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar conector
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {mcpConnectors.map((conn) => (
                  <div
                    key={conn.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Plug className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">{conn.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">MCP · {conn.url}</p>
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
                ))}
                <button
                  onClick={() => setModalOpen(true)}
                  disabled={available <= 0}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar conector
                </button>
              </div>
            )}
          </div>

          {/* Right: Provedores */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <h2 className="text-base font-bold text-black mb-1">Provedores</h2>
            <p className="text-xs text-gray-500 mb-4">Conecte contas de serviços conhecidos com um clique.</p>

            <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
              {/* Google (grouped) */}
              <div className="rounded-xl border border-gray-200 bg-white p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={GOOGLE_GROUP.logo} alt="Google" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black">{GOOGLE_GROUP.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{GOOGLE_GROUP.description}</p>
                </div>
                {googleFullyConnected ? (
                  <button
                    onClick={handleDisconnectGoogle}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Conectado
                  </button>
                ) : (
                  <button
                    onClick={handleConnectGoogle}
                    disabled={connectingId === "google"}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7C5DCF] text-white text-xs font-medium hover:bg-[#6b4bd0] transition-colors shrink-0 disabled:opacity-50"
                  >
                    {connectingId === "google" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    {googlePartiallyConnected ? "Completar" : "Conectar"}
                  </button>
                )}
              </div>

              {/* Other providers */}
              {OTHER_PROVIDERS.map((provider) => {
                const isConnected = connectedIds.has(provider.id);
                return (
                  <div
                    key={provider.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={provider.logo} alt={provider.name} className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">{provider.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{provider.description}</p>
                    </div>
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnectSingle(provider.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Conectado
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectSingle(provider.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7C5DCF] text-white text-xs font-medium hover:bg-[#6b4bd0] transition-colors shrink-0"
                      >
                        Conectar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-black">Novo conector</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subheader */}
        <p className="px-6 pb-4 text-sm text-gray-500 shrink-0">
          Informe a URL de um servidor MCP para a IA usar suas ferramentas.
        </p>

        {/* Form */}
        <div className="px-6 space-y-5 pb-2 overflow-y-auto flex-1">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meu servidor MCP"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-500">Endereço do servidor MCP (deve começar com https://).</p>
          </div>

          {/* Token */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">Token (opcional)</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="w-3 h-3 shrink-0" />
              Token de acesso, se o servidor exigir.
            </p>
          </div>

          {/* Headers */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-black">Headers (opcional)</label>
            <p className="text-xs text-gray-500">Cabeçalhos extras enviados ao servidor MCP.</p>
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
              Adicionar header
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
            className="w-full h-11 rounded-xl bg-[#7C5DCF] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
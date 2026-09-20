import React, { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { CONNECTORS, CONNECTOR_CATEGORIES, WORKSPACE_CONNECTOR_MAP } from "./connectorsData";

function ConnectorLogo({ connector }) {
  const [error, setError] = useState(false);

  if (error || !connector.logo) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
        {connector.name.charAt(0)}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
      <img
        src={connector.logo}
        alt={connector.name}
        onError={() => setError(true)}
        className="w-7 h-7 object-contain"
      />
    </div>
  );
}

function ConnectorCard({ connector, lang, isConnected, onConnect, onDisconnect, isAdmin }) {
  const [connecting, setConnecting] = useState(false);
  const hasOAuth = !!WORKSPACE_CONNECTOR_MAP[connector.id];

  const handleClick = async () => {
    if (isConnected) {
      onDisconnect(connector);
    } else {
      setConnecting(true);
      await onConnect(connector);
      setConnecting(false);
    }
  };

  if ((!hasOAuth || !isAdmin) && !isConnected) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <ConnectorLogo connector={connector} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-black">{connector.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{connector.desc[lang]}</p>
          </div>
        </div>
        <button
          disabled
          className="w-full h-9 rounded-xl text-sm font-medium bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed"
        >
          Em breve
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <ConnectorLogo connector={connector} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-black">{connector.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{connector.desc[lang]}</p>
        </div>
      </div>
      <button
        onClick={handleClick}
        disabled={connecting}
        className={`w-full h-9 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
          isConnected
            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
            : "bg-[#F5F5F5] text-black border border-gray-200 hover:bg-gray-100"
        }`}
      >
        {connecting ? "Conectando..." : isConnected ? "✓ Conectado" : "Conectar"}
      </button>
    </div>
  );
}

export default function ConnectorCatalog({ connectedIds, onConnect, onDisconnect }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const categories = Object.entries(CONNECTOR_CATEGORIES)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, val]) => ({
      key,
      label: val[lang] || val.pt,
      connectors: CONNECTORS.filter((c) => c.category === key),
    }))
    .filter((cat) => cat.connectors.length > 0);

  return (
    <section>
      <h2 className="text-base font-bold text-black mb-1">Conectores disponíveis</h2>
      <p className="text-xs text-gray-500 mb-4">
        Conecte suas contas e a IA passa a consultar e operar essas ferramentas direto no chat.
      </p>
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.key}>
            <p className="text-[10px] font-bold tracking-wider text-gray-400 mb-2">{cat.label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.connectors.map((connector) => (
                <ConnectorCard
                  key={connector.id}
                  connector={connector}
                  lang={lang}
                  isConnected={connectedIds.has(connector.id)}
                  onConnect={onConnect}
                  onDisconnect={onDisconnect}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Loader2, Plug } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ConnectorsPanel({ onBack, onConnectApps, activeIds, onToggleConnector }) {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await base44.entities.UserConnector.list("-created_date", 50);
        if (!cancelled) setConnectors(list || []);
      } catch (err) {
        console.error("Erro ao carregar conectores:", err);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const activeSet = new Set(activeIds || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50"
    >
      <div className="flex items-center gap-2 px-3.5 py-3">
        <button
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-black" />
        </button>
        <span className="text-sm font-bold text-black">Conectores</span>
      </div>
      <div className="h-px bg-gray-100" />

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      ) : connectors.length === 0 ? (
        <div className="flex flex-col items-center px-3.5 py-6 gap-3">
          <span className="text-sm text-gray-500 text-center">
            Você ainda não conectou nenhum app
          </span>
          <button
            onClick={onConnectApps}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span className="text-sm font-medium text-black">Conectar apps</span>
          </button>
        </div>
      ) : (
        <>
          <div className="max-h-52 overflow-y-auto py-1">
            {connectors.map((conn) => {
              const isActive = activeSet.has(conn.connector_id);
              return (
                <button
                  key={conn.id}
                  onClick={() => onToggleConnector?.(conn.connector_id)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {conn.logo ? (
                      <img src={conn.logo} alt={conn.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <Plug className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                  <span className={`flex-1 text-sm font-medium truncate ${isActive ? "text-black" : "text-gray-500"}`}>
                    {conn.name}
                  </span>
                  <span
                    className={`w-8 h-4.5 rounded-full transition-colors shrink-0 relative ${
                      isActive ? "bg-black" : "bg-gray-200"
                    }`}
                    style={{ height: "18px" }}
                  >
                    <span
                      className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${
                        isActive ? "left-4" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-px bg-gray-100" />
          <div className="p-1.5">
            <button
              onClick={onConnectApps}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="text-sm font-medium text-black">Gerenciar conectores</span>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
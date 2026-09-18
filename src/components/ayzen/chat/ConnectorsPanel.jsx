import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";

export default function ConnectorsPanel({ onBack, onConnectApps }) {
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
      <div className="flex flex-col items-center px-3.5 py-6 gap-3">
        <span className="text-sm text-gray-500">Nenhum conector encontrado</span>
        <button
          onClick={onConnectApps}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="text-sm font-medium text-black">Conectar apps</span>
        </button>
      </div>
    </motion.div>
  );
}
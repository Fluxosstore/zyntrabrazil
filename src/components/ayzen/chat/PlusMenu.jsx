import React from "react";
import { motion } from "framer-motion";
import { Paperclip, SlidersHorizontal, Plug, ChevronRight } from "lucide-react";

export default function PlusMenu({ onOpenTools, onOpenConnectors, onAttachFile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50"
    >
      <div className="p-1.5">
        <button
          onClick={onAttachFile}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <Paperclip className="w-4 h-4 text-black shrink-0" />
          <span className="flex-1 text-sm font-medium text-black">Adicionar fotos e arquivos</span>
        </button>
      </div>
      <div className="h-px bg-gray-100 mx-2" />
      <div className="p-1.5 pt-1">
        <button
          onClick={onOpenTools}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <SlidersHorizontal className="w-4 h-4 text-black shrink-0" />
          <span className="flex-1 text-sm font-medium text-black">Ferramentas</span>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
        <button
          onClick={onOpenConnectors}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <Plug className="w-4 h-4 text-black shrink-0" />
          <span className="flex-1 text-sm font-medium text-black">Conectores</span>
          <span className="text-[9px] font-bold tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
            NOVO
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Pin, Pencil, CheckSquare, Trash2 } from "lucide-react";

export default function ChatItemMenu({ onPin, onRename, onSelect, onDelete, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPin?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Pin className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Fixar</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRename?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Pencil className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Renomear</span>
      </button>
      <div className="h-px bg-gray-100" />
      <button
        onClick={(e) => { e.stopPropagation(); onSelect?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <CheckSquare className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Selecionar</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
        <span className="text-sm text-red-600">Excluir</span>
      </button>
    </motion.div>
  );
}
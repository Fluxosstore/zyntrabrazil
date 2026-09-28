import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

export default function FolderMenu({ onEdit, onDelete, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onEdit?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Pencil className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Editar</span>
      </button>
      <div className="h-px bg-gray-100" />
      <button
        onClick={(e) => { e.stopPropagation(); onDelete?.(); onClose?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
        <span className="text-sm text-red-600">Excluir pasta</span>
      </button>
    </motion.div>
  );
}
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, Pencil, CheckSquare, Trash2, FolderInput, FolderMinus, ChevronRight, Check } from "lucide-react";

export default function ChatItemMenu({ onPin, onRename, onSelect, onDelete, onClose, folders = [], onMoveToFolder, onRemoveFromFolder, currentFolderId }) {
  const [moveOpen, setMoveOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
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
      {/* Mover para pasta */}
      <div>
        <button
          onClick={(e) => { e.stopPropagation(); setMoveOpen((v) => !v); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
        >
          <FolderInput className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700 flex-1">Mover para pasta</span>
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${moveOpen ? "rotate-90" : ""}`} />
        </button>
        <AnimatePresence>
          {moveOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {folders.length === 0 ? (
                <p className="px-6 py-2 text-xs text-gray-400">Nenhuma pasta criada</p>
              ) : (
                folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={(e) => { e.stopPropagation(); onMoveToFolder?.(f.id); setMoveOpen(false); onClose?.(); }}
                    className="w-full flex items-center gap-2.5 pl-9 pr-3 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color || "#6C31E3" }} />
                    <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
                    {currentFolderId === f.id && <Check className="w-3.5 h-3.5 text-[#7E57C2] shrink-0" />}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {currentFolderId && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemoveFromFolder?.(); onClose?.(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
        >
          <FolderMinus className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Remover da pasta</span>
        </button>
      )}
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
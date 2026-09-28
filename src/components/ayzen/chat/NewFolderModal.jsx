import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const COLORS = [
  // Row 1
  "#6C31E3", "#A78BFA", "#93C5FD", "#3B82F6", "#14B8A6", "#22C55E", "#84CC16", "#EAB308",
  // Row 2
  "#D97706", "#F97316", "#FB7185", "#F87171", "#D946EF", "#EC4899", "#F9A8D4", "#D1D5DB",
  // Row 3
  "#65730C", "#84A98C", "#6B7280", "#374151", "#4B5563", "#9CA3AF", "#1F2937", "#111827"
];

const MAX_LEN = 60;

export default function NewFolderModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setColor(COLORS[0]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCreate = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const rec = await base44.entities.Folder.create({ name: name.trim(), color });
      onCreated?.(rec);
      onClose?.();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                  <FolderPlus className="w-4.5 h-4.5 text-gray-700" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-black leading-tight">Nova pasta</h2>
                  <p className="text-xs text-[#666666] mt-0.5">Organize suas conversas em uma pasta.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input */}
            <div className="px-6 pb-4">
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_LEN))}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                placeholder="Nome da pasta"
                className="w-full h-10 px-3 rounded-lg border border-[#CCCCCC] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7C5DCF] transition-colors"
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-gray-400">{name.length}/{MAX_LEN}</span>
              </div>
            </div>

            {/* Color */}
            <div className="px-6 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#666666] shrink-0">Cor</span>
                <div className="grid grid-cols-8 gap-2 flex-1">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50/60 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#7C5DCF] to-[#EC4899] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                {saving ? "Criando..." : "Criar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
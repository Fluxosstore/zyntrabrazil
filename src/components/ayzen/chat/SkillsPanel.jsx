import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SkillsPanel({ onSelect, onClose }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await base44.entities.Skill.filter({ active: true });
        if (!cancelled) setSkills(list || []);
      } catch (err) {
        console.error("Erro ao carregar habilidades:", err);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, skills.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (skills[selectedIndex]) onSelect?.(skills[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [skills, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-0 mb-2 w-72 max-h-[400px] bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50 flex flex-col"
    >
      <div className="px-3.5 py-2.5 border-b border-gray-100 shrink-0">
        <span className="text-[11px] font-bold tracking-wider text-gray-400">HABILIDADES</span>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </div>
        ) : skills.length === 0 ? (
          <div className="px-3.5 py-6 text-center">
            <span className="text-sm text-gray-500">Nenhuma habilidade encontrada</span>
          </div>
        ) : (
          skills.map((skill, i) => (
            <button
              key={skill.id}
              onClick={() => onSelect?.(skill)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left ${
                i === selectedIndex ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4 text-black shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-black truncate">/{skill.name}</span>
                  <span className="text-[9px] font-bold tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">GLOBAL</span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {skill.description || (skill.instructions || "").slice(0, 40) + "..."}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="px-3.5 py-2 border-t border-gray-100 shrink-0 flex items-center gap-3">
        <span className="text-[10px] text-gray-400">[↑↓] navegar</span>
        <span className="text-[10px] text-gray-400">[Enter] selecionar</span>
        <span className="text-[10px] text-gray-400">[Esc] fechar</span>
      </div>
    </motion.div>
  );
}
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, ChevronDown } from "lucide-react";

export default function ThinkingSection({ thinking }) {
  const [expanded, setExpanded] = useState(false);

  if (!thinking) return null;

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Cloud className="w-3.5 h-3.5" />
        <span>Pensou por {thinking.duration}s</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && thinking.trace && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 pl-3 border-l-2 border-dotted border-gray-300">
              <p className="text-xs text-gray-500 whitespace-pre-wrap">{thinking.trace}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryImageModal({ item, onClose }) {
  if (!item) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(item.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "imagem-zyntra.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(item.url, "_blank");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl w-full flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <img
            src={item.url}
            alt={item.title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />

          <div className="flex items-center justify-between w-full mt-3 px-1">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.model}</p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors shrink-0 ml-3"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
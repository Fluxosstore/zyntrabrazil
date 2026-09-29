import React, { useState, useEffect } from "react";
import { X, Download, Copy, MessageSquarePlus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MobileImageViewer({ item, items, onClose, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [index, setIndex] = useState(0);

  // Sync gallery list from props
  useEffect(() => {
    const list = Array.isArray(items) && items.length > 0 ? items : item ? [item] : [];
    setGallery(list);
    const startIdx = item ? Math.max(0, list.findIndex((i) => i.id === item.id)) : 0;
    setIndex(startIdx >= 0 ? startIdx : 0);
  }, [items, item]);

  const current = gallery[index] || item;

  if (!current) return null;

  const canNavigate = gallery.length > 1;

  const goPrev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setIndex((i) => (i + 1) % gallery.length);

  const handleDownload = async () => {
    try {
      const res = await fetch(current.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `zyntra-${(current.title || "imagem").slice(0, 20).replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(current.url, "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.prompt || current.title || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleOpenInChat = () => {
    localStorage.setItem(
      `zyntra_edit_image_${user?.id || "guest"}`,
      JSON.stringify({ url: current.url, prompt: current.prompt || current.title, model: current.model })
    );
    navigate("/dashboard");
  };

  const handleDelete = async () => {
    const id = current.id;
    const remaining = gallery.filter((i) => i.id !== id);
    setGallery(remaining);
    if (remaining.length === 0) {
      if (onDelete) await onDelete(id);
      onClose();
      return;
    }
    setIndex((i) => Math.min(i, remaining.length - 1));
    if (onDelete) await onDelete(id);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col bg-[#0d0d0d]"
      >
        {/* Header toolbar */}
        <div className="flex justify-end px-3 pt-3">
          <div className="flex items-center gap-0.5 bg-[#1a1a1a] rounded-full p-1 border border-white/5">
            <button
              onClick={handleOpenInChat}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-full text-white text-xs font-medium active:bg-white/10 transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Abrir no chat</span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={handleDownload}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={handleCopy}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={onDelete ? handleDelete : onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main image + desktop nav arrows */}
        <div className="relative flex-1 flex items-center justify-center min-h-0">
          {canNavigate && (
            <button
              onClick={goPrev}
              className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center justify-center px-4 py-4 w-full h-full lg:max-w-3xl lg:mx-auto">
            <img
              src={current.url}
              alt={current.title}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </div>
          {canNavigate && (
            <button
              onClick={goNext}
              className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Details footer card */}
        <div className="px-3 pb-4 w-full lg:max-w-3xl lg:mx-auto">
          <div className="bg-[#1e1e1e] rounded-2xl p-3.5">
            <p className="text-sm text-white leading-snug line-clamp-3">
              {current.prompt || current.title}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              {current.model || "IA"} • {formatDate(current.created_date)}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
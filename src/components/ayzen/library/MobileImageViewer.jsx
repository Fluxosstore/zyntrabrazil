import React, { useState } from "react";
import { X, Download, Copy, MessageSquarePlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MobileImageViewer({ item, onClose, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(item.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `zyntra-${(item.title || "imagem").slice(0, 20).replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(item.url, "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt || item.title || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: "Não foi possível copiar" });
    }
  };

  const handleOpenInChat = () => {
    localStorage.setItem(
      `zyntra_edit_image_${user?.id || "guest"}`,
      JSON.stringify({ url: item.url, prompt: item.prompt || item.title, model: item.model })
    );
    navigate("/dashboard");
  };

  const handleFeedback = () => {
    toast({ title: "Obrigado pelo feedback!" });
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
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white active:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 min-h-0">
          <img
            src={item.url}
            alt={item.title}
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>

        {/* Details footer card */}
        <div className="px-3 pb-4">
          <div className="bg-[#1e1e1e] rounded-2xl p-3.5 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white leading-snug line-clamp-3">
                {item.prompt || item.title}
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                {item.model || "IA"} • {formatDate(item.created_date)}
              </p>
            </div>
            <button
              onClick={handleFeedback}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#5c54c4] text-white text-xs font-medium active:opacity-80 transition-opacity"
            >
              Feedback
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
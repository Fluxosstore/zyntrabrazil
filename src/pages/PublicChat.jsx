import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PanelLeft,
  ChevronDown,
  Plus,
  Mic,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { isImageGenerationIntent, isAudioGenerationIntent } from "@/lib/chatUtils";
import TypingHeadline from "@/components/ayzen/TypingHeadline";
import MobileSidebar from "@/components/ayzen/MobileSidebar";

const TEXT_COUNT_KEY = "zyntra_free_text_count";
const IMAGE_USED_KEY = "zyntra_free_image_used";
const AUDIO_USED_KEY = "zyntra_free_audio_used";
const FREE_TEXT_LIMIT = 3;
const ORB_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d3c3f358_ChatGPTImage17desetde202619_47_55.png";
const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/057474ffd_quality_restoration_20260928203908003.png";

export default function PublicChat() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greetingMorning");
    if (h < 18) return t("dash.greetingAfternoon");
    return t("dash.greetingNight");
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getNum = (key) => {
    try {
      return parseInt(localStorage.getItem(key) || "0", 10) || 0;
    } catch {
      return 0;
    }
  };
  const getFlag = (key) => {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };
  const setNum = (key, val) => {
    try {
      localStorage.setItem(key, String(val));
    } catch {}
  };
  const setFlag = (key, val) => {
    try {
      localStorage.setItem(key, val ? "1" : "0");
    } catch {}
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const isImage = isImageGenerationIntent(text);
    const isAudio = isAudioGenerationIntent(text);

    if (isImage) {
      if (getFlag(IMAGE_USED_KEY)) {
        navigate("/register");
        return;
      }
    } else if (isAudio) {
      if (getFlag(AUDIO_USED_KEY)) {
        navigate("/register");
        return;
      }
    } else {
      if (getNum(TEXT_COUNT_KEY) >= FREE_TEXT_LIMIT) {
        navigate("/register");
        return;
      }
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      if (isImage) {
        const res = await base44.functions.invoke("publicImage", { prompt: text });
        const imageUrl = res.data?.url;
        if (!imageUrl) throw new Error("Nenhuma imagem gerada");
        setMessages((prev) => [...prev, { role: "assistant", content: "Aqui está a imagem gerada:", image: imageUrl }]);
        setFlag(IMAGE_USED_KEY, true);
      } else if (isAudio) {
        const res = await base44.functions.invoke("publicAudio", { prompt: text });
        const audioUrl = res.data?.url;
        if (!audioUrl) throw new Error("Nenhum áudio gerado");
        setMessages((prev) => [...prev, { role: "assistant", content: "Aqui está o áudio gerado:", audio: audioUrl }]);
        setFlag(AUDIO_USED_KEY, true);
      } else {
        const res = await base44.functions.invoke("publicChat", { prompt: text });
        const content = res.data?.content || "Sem resposta.";
        setMessages((prev) => [...prev, { role: "assistant", content }]);
        setNum(TEXT_COUNT_KEY, getNum(TEXT_COUNT_KEY) + 1);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao gerar resposta. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="md:hidden h-[100dvh] flex flex-col bg-white overflow-hidden overscroll-none">
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <img src={LOGO} alt="Zyntra" className="w-5 h-5 rounded object-contain" />
            <span className="text-sm font-semibold text-black">Zyntra</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-full bg-[#7c3aed] text-white text-xs font-medium hover:bg-[#6d28d9] transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 rounded-full bg-white border border-gray-300 text-black text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>

      {/* Messages or empty state */}
      {messages.length > 0 ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "w-full"}
            >
              {m.role === "user" ? (
                <div className="max-w-[85%] bg-gray-100 text-black text-sm rounded-2xl rounded-br-md px-4 py-2.5 whitespace-pre-wrap break-words">
                  {m.content}
                </div>
              ) : (
                <div className="w-full">
                  <div className="text-[15px] text-[#202124] leading-relaxed whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                  {m.image && (
                    <img src={m.image} alt="Imagem gerada" className="mt-2 rounded-xl max-w-full max-h-72 object-contain" />
                  )}
                  {m.audio && (
                    <audio controls src={m.audio} className="mt-2 w-full" />
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Zyntra está pensando…</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            className="relative w-20 h-20 mb-6"
            animate={{
              scale: [1, 1.08, 0.96, 1.05, 1],
              rotate: [0, 6, -4, 3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={ORB_IMG}
              alt="Zyntra"
              className="relative w-20 h-20 object-contain drop-shadow-2xl"
            />
          </motion.div>
          <p className="text-sm text-gray-500 mb-1">
            {greeting()}, bem-vindo
          </p>
          <TypingHeadline />
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-6">
        <div className="w-full bg-[#F9F9F9] rounded-2xl border border-gray-200 p-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("dash.placeholder")}
            rows={1}
            className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => navigate("/register")}
              className="w-8 h-8 flex items-center justify-center text-black"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/register")}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F2F2] text-black"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F2F2] text-black transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-400 px-4">
          {t("dash.disclaimer")}
        </p>
      </div>

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewConversation={handleNewChat}
        locked
      />
    </div>
  );
}
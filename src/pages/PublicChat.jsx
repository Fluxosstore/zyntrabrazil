import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  Plus,
  Mic,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import PublicChatSidebar from "@/components/ayzen/PublicChatSidebar";

const FREE_KEY = "zyntra_free_command_used";

export default function PublicChat() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Gate: if free command already used, redirect to register
    const used = (() => {
      try {
        return localStorage.getItem(FREE_KEY) === "1";
      } catch {
        return false;
      }
    })();

    if (used) {
      navigate("/register");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await base44.functions.invoke("publicChat", { prompt: text });
      const content = res.data?.content || "Sem resposta.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
      try {
        localStorage.setItem(FREE_KEY, "1");
      } catch {}
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
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      {/* Top header */}
      <header className="flex items-center justify-between px-3 py-2.5 shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#202124] hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <Image
            src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/057474ffd_quality_restoration_20260928203908003.png"
            alt="Zyntra"
            className="w-6 h-6 rounded-md"
            fittingType="fit"
          />
          <span className="font-semibold text-[#202124] text-[15px]">Zyntra</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 rounded-full bg-white border border-gray-300 text-black text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Cadastre-se
          </Link>
        </div>
      </header>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="min-h-full flex items-center justify-center px-6">
            <h1 className="text-2xl font-semibold text-[#202124] text-center">
              Por onde começamos?
            </h1>
          </div>
        ) : (
          <div className="px-4 py-5 space-y-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "flex justify-end"
                    : "w-full"
                }
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] bg-gray-100 text-black text-sm rounded-2xl rounded-br-md px-4 py-2.5 whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                ) : (
                  <div className="text-[15px] text-[#202124] leading-relaxed whitespace-pre-wrap break-words">
                    {m.content}
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
        )}
      </div>

      {/* Disclaimer + Input */}
      <div className="shrink-0 px-4 pb-4 pt-1">
        <p className="text-center text-[11px] text-gray-400 mb-2 px-4 leading-relaxed">
          Zyntra é IA e pode cometer erros. Ao continuar, você concorda com nossos Termos e Política de Privacidade.
        </p>
        <div className="flex items-end gap-2 bg-[#F4F4F4] rounded-[26px] px-3 py-2.5">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
            onClick={() => navigate("/register")}
          >
            <Plus className="w-5 h-5" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Pergunte qualquer coisa"
            className="flex-1 bg-transparent outline-none resize-none text-[15px] text-black placeholder:text-gray-400 max-h-32 leading-[1.4] py-1.5"
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
            onClick={() => navigate("/register")}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors ${
              input.trim() && !loading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <PublicChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />
    </div>
  );
}
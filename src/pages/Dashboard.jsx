import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  Search,
  BookOpen,
  Workflow,
  ChevronDown,
  Mic,
  ArrowUp,
  Sparkles,
  PanelLeftClose,
  VenetianMask,
} from "lucide-react";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41_31.png";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [msg, setMsg] = useState("");

  return (
    <div className="h-screen flex bg-[#F9F9FB] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#F1F3F5] flex flex-col border-r border-gray-200">
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO} alt="Ayzen" className="w-6 h-6 rounded-lg object-contain" />
            <span className="text-base font-bold text-black">Ayzen</span>
          </Link>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-2.5 space-y-1">
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium">
            <Plus className="w-3.5 h-3.5" />
            Nova conversa
          </button>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              placeholder="Buscar conversa"
              className="w-full h-8 pl-8 pr-10 rounded-lg bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
              ⌘K
            </span>
          </div>

          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
            <BookOpen className="w-3.5 h-3.5 text-gray-500" />
            Biblioteca
          </button>
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
            <Workflow className="w-3.5 h-3.5 text-gray-500" />
            Automações
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">
            CHATS
          </span>
        </div>
        <div className="flex-1 px-2.5">
          <p className="px-2 text-xs text-gray-400">Nenhuma conversa ainda</p>
        </div>

        {/* user footer */}
        <div className="px-2.5 py-2 border-t border-gray-200">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-gray-200/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] flex items-center justify-center text-white text-[10px] font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-black truncate">
                {user?.full_name || firstName}
              </p>
              <p className="text-[10px] text-gray-500">Ayzen Free</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative">
        {/* top bar */}
        <div className="h-9 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E57C2]" />
            <span className="font-medium">NOVO Z Z.ai: GLM 5.3</span>
            <span className="text-[#7E57C2] font-medium">+9% na semana</span>
            <span className="text-gray-400">›</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <VenetianMask className="w-4 h-4" />
          </button>
        </div>

        {/* center stage */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-6">
          <div className="relative w-16 h-16 mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A855F7] via-[#7E57C2] to-[#EC4899] blur-xl opacity-60 animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#C084FC] via-[#7E57C2] to-[#EC4899] shadow-2xl shadow-purple-300/50" />
          </div>
          <p className="text-xs text-gray-500 mb-1">
            {greeting()}, {firstName}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6">
            Do rascunho à imagem, num só lugar.
          </h1>

          {/* input */}
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="O que vamos criar hoje?"
              rows={1}
              className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between mt-1.5">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                <Plus className="w-3 h-3" />
                Ayzen Auto
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    msg ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-400 max-w-xl">
            As respostas são geradas por IAs de terceiros e podem conter erros.
            Confira sempre as informações importantes.
          </p>
        </div>
      </main>
    </div>
  );
}
import React, { useState } from "react";
import {
  Menu,
  ChevronDown,
  FolderOpen,
  MessageSquarePlus,
  ChevronUp,
  Compass,
  Plus,
  Mic,
  ArrowUp,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41.png";

export default function MobileDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [msg, setMsg] = useState("");

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greetingMorning");
    if (h < 18) return t("dash.greetingAfternoon");
    return t("dash.greetingNight");
  }
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];

  return (
    <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <img src={LOGO} alt="Zyntra" className="w-5 h-5 rounded object-contain" />
          <span className="text-sm font-semibold text-black">{t("dash.auto")}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100">
            <FolderOpen className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100">
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C084FC] via-[#9D75FF] to-[#DBC5FF] blur-xl opacity-60" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#DBC5FF] via-[#9D75FF] to-[#C084FC] shadow-2xl" />
        </div>
        <p className="text-sm text-gray-500 mb-1">
          {greeting()}, {firstName}
        </p>
        <h1 className="text-xl font-bold text-black text-center px-4">
          {t("dash.mobileHeadline")}
        </h1>
      </div>

      {/* Input area */}
      <div className="px-4 pb-2">
        <div className="w-full bg-[#F9F9F9] rounded-2xl border border-gray-200 p-3">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={t("dash.placeholder")}
            rows={1}
            className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <div className="flex items-center justify-between mt-2">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Mic className="w-4 h-4" />
              </button>
              <button
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  msg ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-400 px-4">
          {t("dash.disclaimer")}
        </p>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 active:bg-gray-100">
          <ChevronUp className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8C42] text-white">
          <Compass className="w-5 h-5" />
        </button>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#7E57C2]">
          <img
            src={LOGO}
            alt="Zyntra"
            className="w-5 h-5 rounded object-contain brightness-0 invert"
          />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
            ×
          </span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
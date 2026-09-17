import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  Search,
  BookOpen,
  Workflow,
  ChevronDown,
  ChevronsUpDown,
  Mic,
  ArrowUp,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  VenetianMask,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import UserPopover from "@/components/ayzen/UserPopover";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import MobileDashboard from "@/components/ayzen/MobileDashboard";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41.png";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greetingMorning");
    if (h < 18) return t("dash.greetingAfternoon");
    return t("dash.greetingNight");
  }
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [msg, setMsg] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
    <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pr-2 gap-2">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-60"} bg-[#F4F4F6] flex flex-col rounded-r-2xl transition-all duration-200`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-2.5`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
              <span className="text-base font-bold text-black">Zyntra</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className={`${collapsed ? "px-2" : "px-2.5"} space-y-1`}>
          <button className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2.5"} py-2 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium`}>
            <Plus className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && t("dash.newConversation")}
          </button>

          {collapsed ? (
            <button className="w-full flex items-center justify-center py-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
              <Search className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                placeholder={t("dash.searchConversation")}
                className="w-full h-8 pl-8 pr-10 rounded-lg bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                ⌘K
              </span>
            </div>
          )}

          <button className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2.5"} py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors`}>
            <BookOpen className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            {!collapsed && t("dash.library")}
          </button>
          <button className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2.5"} py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors`}>
            <Workflow className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            {!collapsed && t("dash.automations")}
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="px-4 pt-3 pb-1">
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("dash.chats")}
              </span>
            </div>
            <div className="flex-1 px-2.5">
              <p className="px-2 text-xs text-gray-400">{t("dash.noChats")}</p>
            </div>
          </>
        )}
        {collapsed && <div className="flex-1" />}

        {/* user footer */}
        <div className="relative px-2.5 py-2">
          <AnimatePresence>
            {popoverOpen && (
              <UserPopover
                key="user-popover"
                user={user}
                firstName={firstName}
                planLabel={t("dash.plan")}
                onLogout={() => logout()}
                onClose={() => setPopoverOpen(false)}
                collapsed={collapsed}
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-2"} py-2 rounded-2xl bg-[#f4f5f7] border border-gray-200/70 hover:bg-[#eceef0] transition-colors`}
          >
            <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
              <Image
                src={getAvatarForUser(user?.id)}
                alt="Profile"
                className="relative w-7 h-7 object-cover"
              />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-black truncate">
                    {user?.full_name || firstName}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{t("dash.plan")}</p>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative bg-white rounded-2xl overflow-hidden">
        {/* top bar */}
        <div className="h-9 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E57C2]" />
            <span className="font-medium">{t("dash.topBar")}</span>
            <span className="text-[#7E57C2] font-medium">{t("dash.weekChange")}</span>
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
            {t("dash.headline")}
          </h1>

          {/* input */}
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-4">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={t("dash.placeholder")}
              rows={1}
              className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between mt-1.5">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors">
                <Plus className="w-3 h-3" />
                {t("dash.auto")}
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
            {t("dash.disclaimer")}
          </p>
        </div>
      </main>
    </div>
    <MobileDashboard />
    </>
  );
}
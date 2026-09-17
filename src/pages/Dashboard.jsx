import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  Search,
  BookOpen,
  Workflow,
  ChevronDown,
  ChevronsUpDown,
  Mic,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  VenetianMask,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import UserPopover from "@/components/ayzen/UserPopover";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import MobileDashboard from "@/components/ayzen/MobileDashboard";
import ModelSelector, { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import ArrowUpIcon from "@/components/ayzen/ArrowUpIcon";
import { DiamondLogo, ChatPlusIcon, BooksIcon, IntegrationIcon } from "@/components/ayzen/SidebarIcons";
import IncognitoAvatar from "@/components/ayzen/IncognitoAvatar";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

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
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState("auto");
  const [tempMode, setTempMode] = useState(false);
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;

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
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
            >
              <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
            </button>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className={`${collapsed ? "px-2" : "px-2.5"} space-y-1`}>
          {collapsed ? (
            <>
              <button className="w-full flex items-center justify-center py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-center py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
                <ChatPlusIcon className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-center py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
                <BooksIcon className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-center py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
                <IntegrationIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5 shrink-0" />
                {t("dash.newConversation")}
              </button>

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

              <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.library")}
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
                <Workflow className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.automations")}
              </button>
            </>
          )}
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
        {collapsed && (
          <div className="px-2 pb-1">
            <button className="w-full flex items-center justify-center py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* user footer */}
        <div className="relative px-2.5 py-2">
          <AnimatePresence>
            {popoverOpen && (
              <UserPopover
                key="user-popover"
                user={user}
                firstName={firstName}
                planLabel={planLabel}
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
                  <p className="text-[10px] text-gray-500 truncate">{planLabel}</p>
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
          <div className="relative group">
            <button
              onClick={() => setTempMode((v) => !v)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                tempMode ? "bg-[#F3EEFF] text-[#7E57C2]" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <VenetianMask className="w-4 h-4" />
            </button>
            {!tempMode && (
              <div className="absolute right-0 top-full mt-1 px-2.5 py-1.5 bg-white rounded-lg shadow-lg border border-gray-100 text-xs font-medium text-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {t("dash.tempTooltip")}
              </div>
            )}
          </div>
        </div>

        {/* center stage */}
        <div className="flex-1 flex flex-col items-center justify-end px-6 pb-24 -mt-6">
          {tempMode ? (
            <>
              <motion.div
                className="relative w-20 h-20 mb-5"
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
                  src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d3c3f358_ChatGPTImage17desetde202619_47_55.png"
                  alt="Zyntra"
                  className="relative w-20 h-20 object-contain drop-shadow-2xl"
                />
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-2">
                {t("dash.tempTitle")}
              </h1>
              <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                {t("dash.tempDesc")}
              </p>
            </>
          ) : (
            <>
              <motion.div
                className="relative w-20 h-20 mb-5"
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
                  src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d3c3f358_ChatGPTImage17desetde202619_47_55.png"
                  alt="Zyntra"
                  className="relative w-20 h-20 object-contain drop-shadow-2xl"
                />
              </motion.div>
              <p className="text-xs text-gray-500 mb-1">
                {greeting()}, {firstName}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6">
                {t("dash.headline")}
              </h1>
            </>
          )}

          {/* input */}
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-4">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={t("dash.placeholder")}
              rows={2}
              className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between mt-1.5">
              <div className="relative flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setModelOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-gray-100 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <img src={LOGO} alt="Ayzen" className="w-4 h-4 rounded object-contain" />
                    {t("dash.auto")}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {modelOpen && (
                      <ModelSelector
                        selected={model}
                        plan={plan}
                        onSelect={(id) => {
                          setModel(id);
                          setModelOpen(false);
                        }}
                        onClose={() => setModelOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    msg ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <p className="absolute bottom-12 left-0 right-0 text-center text-[11px] text-gray-400 max-w-xl mx-auto px-6 whitespace-nowrap -translate-x-8">
          {t("dash.disclaimer")}
        </p>
      </main>
    </div>
    <MobileDashboard />
    </>
  );
}
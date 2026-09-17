import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  Search,
  BookOpen,
  Workflow,
  ChevronsUpDown,
  PanelLeftClose,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import UserPopover from "@/components/ayzen/UserPopover";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import { ChatPlusIcon, BooksIcon, IntegrationIcon } from "@/components/ayzen/SidebarIcons";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

export default function DashboardSidebar({ activePage = "dashboard" }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;

  return (
    <aside className={`${collapsed ? "w-16" : "w-60"} bg-[#F4F4F6] flex flex-col rounded-r-2xl transition-all duration-200`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-2.5`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
            <span className="text-base font-bold text-black">Zyntra</span>
          </Link>
        )}
        {collapsed && (
          <Link
            to="/dashboard"
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center aspect-square py-2 rounded-lg hover:bg-gray-200/60 transition-colors"
          >
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
          </Link>
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

      <div className={`${collapsed ? "px-3" : "px-2.5"} space-y-1`}>
        {collapsed ? (
          <>
            <button className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link to="/dashboard" className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <ChatPlusIcon className="w-4 h-4" />
            </Link>
            <Link to="/library" className={`w-full flex items-center justify-center aspect-square py-2 rounded-lg transition-colors ${activePage === "library" ? "bg-gray-200/60 text-gray-800" : "text-gray-800 hover:bg-gray-200/60"}`}>
              <BooksIcon className="w-4 h-4" />
            </Link>
            <button className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <IntegrationIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium">
              <Plus className="w-3.5 h-3.5 shrink-0" />
              {t("dash.newConversation")}
            </Link>

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

            <Link
              to="/library"
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activePage === "library" ? "bg-gray-200/60 text-gray-900" : "text-gray-700 hover:bg-gray-200/60"}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {t("dash.library")}
            </Link>
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
        <div className="px-3 pb-1">
          <button className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* user footer */}
      <div className={`relative ${collapsed ? "px-3" : "px-2.5"} py-2`}>
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
          className={`w-full flex items-center ${collapsed ? "justify-center aspect-square rounded-lg hover:bg-gray-200/60" : "gap-2.5 px-2 rounded-2xl bg-[#f4f5f7] border border-gray-200/70 hover:bg-[#eceef0]"} transition-colors`}
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
  );
}
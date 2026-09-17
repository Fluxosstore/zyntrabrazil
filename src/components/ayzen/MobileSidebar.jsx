import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquarePlus,
  Search,
  BookOpen,
  Workflow,
  ChevronsUpDown,
  PanelLeftClose,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41.png";

export default function MobileSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#F1F3F5] flex flex-col z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <Link to="/" className="flex items-center gap-2">
                <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
                <span className="text-base font-bold text-black">Zyntra</span>
              </Link>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nav */}
            <div className="px-2.5 space-y-1">
              <Link to="/dashboard" onClick={onClose} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#1D1D1F] text-white text-xs font-medium">
                <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
                {t("dash.newConversation")}
              </Link>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  placeholder={t("dash.searchConversation")}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
                />
              </div>

              <Link to="/library" onClick={onClose} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.library")}
              </Link>
              <Link to="/automations" onClick={onClose} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-200/60 text-xs font-medium transition-colors">
                <Workflow className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.automations")}
              </Link>
            </div>

            <div className="h-px bg-gray-200 my-2 mx-2.5" />

            {/* Chats */}
            <div className="px-4 pt-1 pb-1">
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("dash.chats")}
              </span>
            </div>
            <div className="flex-1 px-2.5">
              <p className="px-2 text-xs text-gray-400">{t("dash.noChats")}</p>
            </div>

            {/* User footer */}
            <div className="px-2.5 py-2 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl bg-[#f4f5f7] hover:bg-[#eceef0] transition-colors"
              >
                <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
                  <Image
                    src={getAvatarForUser(user?.id)}
                    alt="Profile"
                    className="relative w-7 h-7 object-cover"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-black truncate">
                    {user?.full_name || firstName}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{t("dash.plan")}</p>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
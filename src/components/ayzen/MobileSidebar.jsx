import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquarePlus,
  Search,
  BookOpen,
  Workflow,
  Code2,
  ChevronsUpDown,
  PanelLeftClose,
  Plus,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import UserPopover from "@/components/ayzen/UserPopover";
import ChatListItem from "@/components/ayzen/chat/ChatListItem";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

export default function MobileSidebar({ open, onClose, conversations = [], activeConversationId, onNewConversation, onSelectConversation, onDeleteConversation, onRenameConversation, onTogglePin, onToggleSelect }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;

  const handleNewConversation = () => {
    if (onNewConversation) onNewConversation();
    else navigate("/dashboard");
    onClose();
  };

  const filteredConversations = searchQuery.trim()
    ? conversations.filter((c) =>
        (c.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : conversations;

  const handleSelect = onSelectConversation || ((convId) => {
    try {
      localStorage.setItem(`zyntra_open_conversation_${user?.id || 'guest'}`, convId);
    } catch {}
    navigate("/dashboard");
    onClose();
  });

  const navItemClass =
    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-xs font-medium transition-colors";

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
            className="md:hidden fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white flex flex-col z-50 shadow-2xl rounded-r-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3">
              <Link to="/" className="flex items-center gap-2">
                <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
                <span className="text-base font-bold text-black">Zyntra</span>
              </Link>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            <div className="px-2 space-y-0.5">
              <button
                onClick={handleNewConversation}
                className={navItemClass}
              >
                <MessageSquarePlus className="w-4 h-4 text-gray-600 shrink-0" />
                {t("dash.newConversation")}
              </button>
              <Link to="/dashboard" onClick={onClose} className={navItemClass}>
                <Search className="w-4 h-4 text-gray-600 shrink-0" />
                {t("dash.searchConversation")}
              </Link>
              <Link to="/library" onClick={onClose} className={navItemClass}>
                <BookOpen className="w-4 h-4 text-gray-600 shrink-0" />
                {t("dash.library")}
              </Link>
              <Link to="/automations" onClick={onClose} className={navItemClass}>
                <Workflow className="w-4 h-4 text-gray-600 shrink-0" />
                {t("dash.automations")}
              </Link>
              {user?.role === "admin" && (
                <Link to="/codrax" onClick={onClose} className={navItemClass}>
                  <Code2 className="w-4 h-4 text-gray-600 shrink-0" />
                  Codrax
                </Link>
              )}
            </div>

            <div className="h-px bg-gray-100 my-2 mx-2.5" />

            {/* Search */}
            <div className="px-2 pb-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("dash.searchConversation")}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
                />
              </div>
            </div>

            {/* Chats */}
            <div className="flex items-center justify-between px-4 pt-1 pb-1">
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("dash.chats")}
              </span>
              <button
                onClick={handleNewConversation}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 px-2 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <p className="px-2.5 text-xs text-gray-400">{t("dash.noChats")}</p>
              ) : (
                <div className="space-y-0.5">
                  {filteredConversations.map((conv) => (
                    <ChatListItem
                      key={conv.id}
                      conv={conv}
                      active={conv.id === activeConversationId}
                      onSelect={handleSelect}
                      onPin={onTogglePin}
                      onRenameCommit={onRenameConversation}
                      onSelectToggle={onToggleSelect}
                      onDelete={onDeleteConversation}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* User footer */}
            <div className="relative px-2.5 py-2.5">
              <AnimatePresence>
                {popoverOpen && (
                  <UserPopover
                    key="mobile-user-popover"
                    user={user}
                    firstName={firstName}
                    planLabel={planLabel}
                    onLogout={() => logout()}
                    onClose={() => setPopoverOpen(false)}
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => setPopoverOpen((v) => !v)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#f4f5f7] hover:bg-[#eceef0] transition-colors"
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
                  <p className="text-[10px] text-gray-500 truncate">{planLabel}</p>
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
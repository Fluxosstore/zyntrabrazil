import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronsUpDown, PanelLeftClose, Plus, ChevronRight, Folder, MoreVertical } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import UserPopover from "@/components/ayzen/UserPopover";
import { ChatPlusIcon, BooksIcon, IntegrationIcon } from "@/components/ayzen/SidebarIcons";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { base44 } from "@/api/base44Client";
import ChatListItem from "@/components/ayzen/chat/ChatListItem";
import NewFolderModal from "@/components/ayzen/chat/NewFolderModal";
import { useFolders } from "@/hooks/useFolders";

const LOGO =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

export default function MobileSidebar({ open, onClose, conversations = [], activeConversationId, onNewConversation, onSelectConversation, onDeleteConversation, onRenameConversation, onTogglePin, onToggleSelect, onMoveToFolder }) {
  const { folders, reloadFolders } = useFolders();
  const [expandedFolders, setExpandedFolders] = useState({});
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;
  const isAdmin = user?.role === "admin";

  const formatCredits = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  useEffect(() => {
    (async () => {
      try {
        const records = await base44.entities.TokenUsage.list("-created_date", 500);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        const monthly = records.
        filter((r) => new Date(r.created_date).getTime() >= monthStart).
        reduce((s, r) => s + (r.tokens || 0), 0);
        const credits = CREDITS_BY_PLAN[plan] || CREDITS_BY_PLAN.free;
        const planCredits = Math.max(0, credits.month - monthly);
        const purchased = user?.balance || 0;
        setBalance(planCredits + purchased);
      } catch {
        setBalance(CREDITS_BY_PLAN[plan]?.month || 0);
      }
    })();
  }, [plan, user?.id, user?.balance]);

  const handleNewConversation = () => {
    if (onNewConversation) onNewConversation();
    else navigate("/dashboard");
    onClose();
  };

  const filteredConversations = searchQuery.trim() ?
  conversations.filter((c) =>
  (c.title || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  ) :
  conversations;

  const handleSelect = onSelectConversation || ((convId) => {
    try {
      localStorage.setItem(`zyntra_open_conversation_${user?.id || 'guest'}`, convId);
    } catch {}
    navigate("/dashboard");
    onClose();
  });

  return (
    <AnimatePresence>
      {open &&
      <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/50 z-40" />


          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white flex flex-col z-50 shadow-2xl rounded-r-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <img src={LOGO} alt="Zyntra" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-lg font-bold text-black">Zyntra</span>
              </Link>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">

                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <div className="px-3 space-y-1">
              <button
                onClick={handleNewConversation}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-sm font-medium hover:opacity-90 transition-opacity">

                <ChatPlusIcon className="w-4 h-4 shrink-0" />
                {t("dash.newConversation")}
              </button>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("dash.searchConversation")}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#F4F4F6] border border-gray-300/70 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400" />

              </div>

              <div className="rounded-xl bg-gray-200/50 p-1 space-y-0.5">
                <Link
                  to="/library"
                  onClick={onClose}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60 transition-colors">

                  <BooksIcon className="w-4 h-4 text-gray-500 shrink-0" />
                  {t("dash.library")}
                </Link>
                <Link
                  to="/automations"
                  onClick={onClose}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60 transition-colors">

                  <IntegrationIcon className="w-4 h-4 text-gray-500 shrink-0" />
                  {t("dash.automations")}
                </Link>
                {isAdmin &&
              <Link
                to="/codrax"
                onClick={onClose}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60 transition-colors">

                  Codrax
                </Link>
              }
              </div>
            </div>

            {/* Pastas section */}
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold tracking-wider text-gray-400">
                  Pastas
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={() => setFolderModalOpen(true)}
                className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition-colors">

                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Chats list */}
            <div className="flex-1 px-3 overflow-y-auto">
              {/* Folders with nested chats */}
              {folders.map((folder) => {
                const folderChats = filteredConversations.filter((c) => c.folder_id === folder.id);
                const isExpanded = expandedFolders[folder.id] !== false;
                return (
                  <div key={folder.id} className="space-y-0.5">
                    <div
                      onClick={() => setExpandedFolders((p) => ({ ...p, [folder.id]: !isExpanded }))}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors group"
                    >
                      <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      <Folder className="w-4 h-4 shrink-0" style={{ color: folder.color || "#6C31E3" }} />
                      <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
                      {folderChats.length > 0 && <span className="text-xs text-gray-400">{folderChats.length}</span>}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 flex items-center justify-center rounded shrink-0 text-gray-400 hover:bg-gray-200 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    {isExpanded && folderChats.length > 0 && (
                      <div className="space-y-0.5">
                        {folderChats.map((conv) =>
                          <ChatListItem
                            key={conv.id}
                            conv={conv}
                            active={conv.id === activeConversationId}
                            onSelect={handleSelect}
                            onPin={onTogglePin}
                            onRenameCommit={onRenameConversation}
                            onSelectToggle={onToggleSelect}
                            onDelete={onDeleteConversation}
                            folders={folders}
                            onMoveToFolder={onMoveToFolder}
                            indent
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Chats without folder */}
              <div className="px-2 pt-2 pb-1">
                <span className="text-xs font-semibold tracking-wider text-gray-400">
                  Hoje
                </span>
              </div>
              {filteredConversations.filter((c) => !c.folder_id).length === 0 && folders.length === 0 ?
            <p className="px-2 text-xs text-gray-400">{t("dash.noChats")}</p> :

            <div className="space-y-0.5">
                  {filteredConversations.filter((c) => !c.folder_id).map((conv) =>
                <ChatListItem
                  key={conv.id}
                  conv={conv}
                  active={conv.id === activeConversationId}
                  onSelect={handleSelect}
                  onPin={onTogglePin}
                  onRenameCommit={onRenameConversation}
                  onSelectToggle={onToggleSelect}
                  onDelete={onDeleteConversation}
                  folders={folders}
                  onMoveToFolder={onMoveToFolder} />

              )}
                </div>
            }
            </div>

            {/* credits bar */}
            <div className="px-3 pb-1">
              <div className="flex items-center justify-between rounded-xl bg-[#eceef0] border border-gray-300/70 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CoinStackIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-black">{formatCredits(balance)}</span>
                </div>
                <Link to="/recharge-credits" onClick={onClose} className="px-3 py-2 rounded-lg text-sm font-medium text-black bg-[#eceef0] hover:bg-[#e2e4e8] transition-colors">
                  {t("dash.recharge")}
                </Link>
              </div>
            </div>

            {/* User footer */}
            <div className="relative px-3 py-2">
              <AnimatePresence>
                {popoverOpen &&
              <UserPopover
                key="mobile-user-popover"
                user={user}
                firstName={firstName}
                planLabel={planLabel}
                onLogout={() => logout()}
                onClose={() => setPopoverOpen(false)} />

              }
              </AnimatePresence>
              <button
                onClick={() => setPopoverOpen((v) => !v)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#eceef0] border border-gray-300/70 hover:bg-[#e2e4e8] transition-colors">

                <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
                  <Image
                    src={getAvatarForUser(user?.id)}
                    alt="Profile"
                    className="relative w-9 h-9 object-cover" />

                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-black truncate">
                    {user?.full_name || firstName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{planLabel}</p>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            </div>

            <NewFolderModal open={folderModalOpen} onClose={() => setFolderModalOpen(false)} onCreated={reloadFolders} />
          </motion.aside>
        </>
      }
    </AnimatePresence>
  );
}
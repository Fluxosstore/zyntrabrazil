import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  Search,
  Code2,
  ChevronsUpDown,
  PanelLeftClose,
  Settings,
  ChevronRight,
  Folder,
  MoreVertical } from
"lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import UserPopover from "@/components/ayzen/UserPopover";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import { ChatPlusIcon, BooksIcon, IntegrationIcon } from "@/components/ayzen/SidebarIcons";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { base44 } from "@/api/base44Client";
import ChatListItem from "@/components/ayzen/chat/ChatListItem";
import NewFolderModal from "@/components/ayzen/chat/NewFolderModal";
import FolderMenu from "@/components/ayzen/chat/FolderMenu";
import { useFolders } from "@/hooks/useFolders";

const LOGO =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

export default function DashboardSidebar({ activePage = "dashboard", conversations = [], activeConversationId, onNewConversation, onSelectConversation, onDeleteConversation, onRenameConversation, onTogglePin, onToggleSelect, onMoveToFolder, onRemoveFromFolder, balanceRefreshKey }) {
  const { folders, reloadFolders } = useFolders();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [foldersSectionOpen, setFoldersSectionOpen] = useState(false);
  const [folderMenuId, setFolderMenuId] = useState(null);
  const [editFolder, setEditFolder] = useState(null);
  const folderMenuRef = useRef(null);
  useEffect(() => {
    if (!folderMenuId) return;
    function handleClickOutside(e) {
      if (folderMenuRef.current && !folderMenuRef.current.contains(e.target)) {
        setFolderMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [folderMenuId]);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {return localStorage.getItem("zyntra_sidebar_collapsed") === "true";} catch {return false;}
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  const toggleCollapsed = (val) => {
    const next = typeof val === "boolean" ? val : !collapsed;
    setCollapsed(next);
    try {localStorage.setItem("zyntra_sidebar_collapsed", String(next));} catch {}
  };
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const handleNew = onNewConversation || (() => navigate("/dashboard"));

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
  }, [plan, user?.id, user?.balance, balanceRefreshKey]);

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
  });

  return (
    <aside className={`${collapsed ? "w-16" : "w-60"} bg-[#F4F4F6] flex flex-col rounded-r-2xl transition-all duration-200`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-2.5`}>
        {!collapsed &&
        <button onClick={() => toggleCollapsed(true)} className="flex items-center gap-2">
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
            <span className="text-base font-bold text-black">Zyntra</span>
          </button>
        }
        {collapsed &&
        <button
          onClick={() => toggleCollapsed(false)}
          className="w-full flex items-center justify-center aspect-square py-2 rounded-lg hover:bg-gray-200/60 transition-colors">
          
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
          </button>
        }
        {!collapsed &&
        <button
          onClick={() => toggleCollapsed(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
          
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        }
      </div>

      <div className={`${collapsed ? "px-3" : "px-3"} space-y-1`}>
        {collapsed ?
        <>
            <button className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={handleNew} className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
              <ChatPlusIcon className="w-4 h-4" />
            </button>
            <Link to="/library" className={`w-full flex items-center justify-center aspect-square py-2 rounded-lg transition-colors ${activePage === "library" ? "bg-gray-200/60 text-gray-800" : "text-gray-800 hover:bg-gray-200/60"}`}>
              <BooksIcon className="w-4 h-4" />
            </Link>
            <Link to="/automations" className={`w-full flex items-center justify-center aspect-square py-2 rounded-lg transition-colors ${activePage === "automations" ? "bg-gray-200/60 text-gray-800" : "text-gray-800 hover:bg-gray-200/60"}`}>
              <IntegrationIcon className="w-4 h-4" />
            </Link>
            {isAdmin &&
          <Link to="/codrax" className={`w-full flex items-center justify-center aspect-square py-2 rounded-lg transition-colors ${activePage === "codrax" ? "bg-gray-200/60 text-gray-800" : "text-gray-800 hover:bg-gray-200/60"}`}>
                <Code2 className="w-4 h-4" />
              </Link>
          }
          </> :

        <>
            <button onClick={handleNew} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#7C5DCF] text-white text-xs font-medium hover:bg-[#6B4DD0] transition-colors">
              <ChatPlusIcon className="w-3.5 h-3.5 shrink-0" />
              {t("dash.newConversation")}
            </button>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("dash.searchConversation")}
              className="w-full h-8 pl-8 pr-10 rounded-xl bg-[#F4F4F6] border border-gray-300/70 text-xs placeholder:text-gray-400 focus:outline-none focus:border-gray-400" />
            
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                Ctrl K
              </span>
            </div>

            <div className="rounded-xl bg-gray-200/50 p-1 space-y-0.5">
              <Link
              to="/library"
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activePage === "library" ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:bg-white/60"}`}>
              
                <BooksIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.library")}
              </Link>
              <Link
              to="/automations"
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activePage === "automations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:bg-white/60"}`}>
              
                <IntegrationIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                {t("dash.automations")}
              </Link>
              {isAdmin &&
            <Link
              to="/codrax"
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${activePage === "codrax" ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:bg-white/60"}`}>
              
                  <Code2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  Codrax
                </Link>
            }
            </div>
          </>
        }
      </div>

      {!collapsed &&
      <>
          <div className="flex items-center justify-between px-3 pt-3 pb-1">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400">Pastas</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setFoldersSectionOpen((v) => !v)}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className={`w-3 h-3 transition-transform ${foldersSectionOpen ? "rotate-90" : ""}`} />
              </button>
              <button onClick={() => setFolderModalOpen(true)} className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 px-3 overflow-y-auto">
            {/* Folders with nested chats */}
            {foldersSectionOpen && folders.map((folder) => {
              const folderChats = filteredConversations.filter((c) => c.folder_id === folder.id);
              const isExpanded = expandedFolders[folder.id] !== false;
              return (
                <div key={folder.id} ref={folderMenuId === folder.id ? folderMenuRef : null} className="relative space-y-0.5">
                  <div
                    onClick={() => setExpandedFolders((p) => ({ ...p, [folder.id]: !isExpanded }))}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-200/60 transition-colors group"
                  >
                    <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: folder.color || "#6C31E3" }} />
                    <span className="flex-1 text-xs font-medium truncate">{folder.name}</span>
                    {folderChats.length > 0 && <span className="text-[10px] text-gray-400">{folderChats.length}</span>}
                    <button
                      onClick={(e) => { e.stopPropagation(); setFolderMenuId(folderMenuId === folder.id ? null : folder.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-300/50 transition-colors"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className={`w-3 h-3 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                  <AnimatePresence>
                    {folderMenuId === folder.id && (
                      <FolderMenu
                        onEdit={() => setEditFolder(folder)}
                        onDelete={async () => {
                          try { await base44.entities.Folder.delete(folder.id); } catch {}
                          reloadFolders();
                          setFolderMenuId(null);
                        }}
                        onClose={() => setFolderMenuId(null)}
                      />
                    )}
                  </AnimatePresence>
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
                          onRemoveFromFolder={onRemoveFromFolder}
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
              <span className="text-[10px] font-semibold tracking-wider text-gray-400">
                {t("dash.chats")}
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
        </>
      }
      {collapsed && <div className="flex-1" />}
      {collapsed &&
      <div className="px-3 pb-1">
          <Link to="/settings" className="w-full flex items-center justify-center aspect-square py-2 rounded-lg text-gray-800 hover:bg-gray-200/60 transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      }

      {/* credits bar */}
      {!collapsed &&
      <div className="px-3 pb-1">
          <div className="flex items-center justify-between rounded-xl bg-[#eceef0] border border-gray-300/70 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CoinStackIcon className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-black">{formatCredits(balance)}</span>
            </div>
            <Link to="/recharge-credits" className="px-3 py-1.5 rounded-lg text-xs font-medium text-black bg-[#eceef0] hover:bg-[#e2e4e8] transition-colors">
              {t("dash.recharge")}
            </Link>
          </div>
        </div>
      }

      {/* user footer */}
      <div className={`relative ${collapsed ? "px-3" : "px-3"} py-2`}>
        <AnimatePresence>
          {popoverOpen &&
          <UserPopover
            key="user-popover"
            user={user}
            firstName={firstName}
            planLabel={planLabel}
            onLogout={() => logout()}
            onClose={() => setPopoverOpen(false)}
            collapsed={collapsed} />

          }
        </AnimatePresence>
        <button
          onClick={() => setPopoverOpen((v) => !v)}
          className={`w-full flex items-center ${collapsed ? "justify-center aspect-square rounded-lg hover:bg-gray-200/60" : "gap-2.5 px-2.5 py-2 rounded-xl bg-[#eceef0] border border-gray-300/70 hover:bg-[#e2e4e8]"} transition-colors`}>
          
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
            <Image
              src={getAvatarForUser(user?.id)}
              alt="Profile"
              className="relative w-7 h-7 object-cover" />
            
          </div>
          {!collapsed &&
          <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-black truncate">
                  {user?.full_name || firstName}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{planLabel}</p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </>
          }
        </button>
        </div>

        <NewFolderModal open={folderModalOpen || !!editFolder} editFolder={editFolder} onClose={() => { setFolderModalOpen(false); setEditFolder(null); }} onCreated={() => { reloadFolders(); setEditFolder(null); }} />
        </aside>);

        }
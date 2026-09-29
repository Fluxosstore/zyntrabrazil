import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Check,
  LayoutGrid,
  List,
  Folder,
  Image as ImageIcon,
  FileText,
  FilePlus,
  Star,
  Music,
  Video,
  PanelLeftClose,
  MessageSquarePlus,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import LibraryItems from "@/components/ayzen/LibraryItems";
import MobileLibraryContent from "@/components/ayzen/library/MobileLibraryContent";

const TABS = [
  { id: "all", icon: Folder },
  { id: "images", icon: ImageIcon },
  { id: "docs", icon: FilePlus },
  { id: "responses", icon: Star },
  { id: "files", icon: FileText },
];

const SUB_FILTERS = [
  { id: "all", icon: LayoutGrid },
  { id: "docs", icon: FileText },
  { id: "images", icon: ImageIcon },
  { id: "audio", icon: Music },
  { id: "video", icon: Video },
];

const EMPTY_ICON = {
  all: FileText,
  images: ImageIcon,
  files: FileText,
  docs: FileText,
  responses: Star,
};

export default function LibraryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [view, setView] = useState("list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("recent");
  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return;
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sortOpen]);

  const sortOptions = [
    { id: "recent", label: "Mais recentes" },
    { id: "oldest", label: "Mais antigas" },
  ];

  const showNoResults = activeTab === "files" && subFilter !== "all";

  const showControls = activeTab !== "responses";
  const searchKey = `library.search${activeTab === "all" ? "" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  const emptyTitleKey = `library.emptyTitle${activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  const emptyDescKey = `library.emptyDesc${activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  const EmptyIcon = EMPTY_ICON[activeTab];

  return (
    <>
      {/* Desktop (legacy - now uses mobile layout) */}
      <div className="hidden h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="library" />

        <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-5">
            <h1 className="text-2xl font-bold text-black">{t("library.title")}</h1>
            <p className="text-sm text-gray-500 mt-1.5">{t("library.desc")}</p>
          </div>

          {/* Filter tabs */}
          <div className="px-8 pb-4">
            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      active
                        ? "bg-white border border-gray-300 text-black shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t(`library.tab${tab.id.charAt(0).toUpperCase()}${tab.id.slice(1)}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + controls */}
          {showControls && (
            <div className="px-8 pb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder={t(searchKey)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
                />
              </div>
              <button className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                {t("library.recent")}
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setView("grid")}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    view === "grid" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    view === "list" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Sub-filter (files only) */}
          {activeTab === "files" && (
            <div className="px-8 pb-4">
              <div className="flex items-center gap-1.5">
                {SUB_FILTERS.map((sub) => {
                  const Icon = sub.icon;
                  const labelKey = `library.sub${sub.id.charAt(0).toUpperCase() + sub.id.slice(1)}`;
                  const active = subFilter === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSubFilter(sub.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        active
                          ? "bg-black text-white"
                          : "bg-[#F3F3F5] text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items / Empty state */}
          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            <LibraryItems
              activeTab={activeTab}
              subFilter={subFilter}
              view={view}
              emptyState={
                <div className="h-full border border-gray-200 rounded-2xl flex flex-col items-center justify-center">
                  {showNoResults ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-gray-700">{t("library.noResultsTitle")}</p>
                      <p className="mt-1.5 text-sm text-gray-400 text-center max-w-sm">{t("library.noResultsDesc")}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <EmptyIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-black">{t(emptyTitleKey)}</p>
                      <p className="mt-1.5 text-sm text-gray-500 text-center max-w-sm">{t(emptyDescKey)}</p>
                    </>
                  )}
                </div>
              }
            />
          </div>
        </main>
      </div>

      {/* Mobile (also used on desktop/notebook) */}
      <div className="h-screen flex flex-col bg-[#F4F4F6] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 safe-area-top">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60 rounded-lg"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              try { localStorage.removeItem(`zyntra_open_conversation_${undefined}`); } catch {}
              window.location.href = "/dashboard";
            }}
            className="w-9 h-9 flex items-center justify-center text-[#333333] active:bg-gray-200/60 rounded-lg"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Page title */}
          <div className="pt-1 pb-4">
            <h1 className="text-2xl font-bold text-black leading-tight">{t("library.title")}</h1>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t("library.desc")}</p>
          </div>

          {/* Filter tabs */}
          <div className="flex justify-center pb-3">
            <div className="flex items-center gap-0.5 bg-[#EFEFF1] rounded-full p-1 max-w-full overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t(`library.tab${tab.id.charAt(0).toUpperCase()}${tab.id.slice(1)}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + filter */}
          {showControls && (
            <div className="flex items-center gap-2 pb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder={t(searchKey)}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-[#EBEBEB] text-sm text-black placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center justify-between gap-1.5 h-9 w-40 px-3.5 rounded-full bg-[#EBEBEB] text-xs font-medium text-gray-700 active:bg-gray-200 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="flex-1 text-left truncate">{sortOptions.find((o) => o.id === sortOrder)?.label || t("library.recent")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg shadow-black/10 border border-gray-100 py-1.5 z-50">
                    {sortOptions.map((opt) => {
                      const active = sortOrder === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSortOrder(opt.id);
                            setSortOpen(false);
                          }}
                          className={`w-[calc(100%-0.75rem)] mx-auto flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active ? "bg-[#E6E6ED] text-black" : "text-black hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                          {active && <Check className="w-4 h-4 text-gray-700" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-filter (files only) */}
          {activeTab === "files" && (
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-3">
              <div className="inline-flex items-center gap-1.5">
                {SUB_FILTERS.map((sub) => {
                  const Icon = sub.icon;
                  const labelKey = `library.sub${sub.id.charAt(0).toUpperCase() + sub.id.slice(1)}`;
                  const active = subFilter === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSubFilter(sub.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        active
                          ? "bg-white text-black border border-gray-200 shadow-sm"
                          : "bg-[#EBEBEB] text-gray-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <MobileLibraryContent
            activeTab={activeTab}
            subFilter={subFilter}
            searchQuery={mobileSearch}
          />
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}
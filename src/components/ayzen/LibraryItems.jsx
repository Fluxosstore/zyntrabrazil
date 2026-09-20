import React, { useEffect, useState } from "react";
import { Download, Trash2, MessageSquare, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const TAB_TYPE_MAP = {
  all: null,
  images: "image",
  files: null,
  docs: "doc",
  responses: "response",
};

const SUB_TYPE_MAP = {
  all: null,
  docs: "doc",
  images: "image",
  audio: "audio",
  video: "video",
};

export default function LibraryItems({ activeTab, subFilter = "all", view = "list", emptyState = null }) {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchItems = async () => {
    try {
      const data = await base44.entities.LibraryItem.list("-created_date", 200);
      setItems(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await base44.entities.LibraryItem.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {}
  };

  const handleDownload = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "imagem-zyntra.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const filtered = items.filter((i) => {
    let matchesTab;
    if (activeTab === "files") {
      matchesTab = i.type !== "response";
      const subType = SUB_TYPE_MAP[subFilter];
      if (subType) matchesTab = matchesTab && i.type === subType;
    } else {
      const targetType = TAB_TYPE_MAP[activeTab];
      matchesTab = !targetType || i.type === targetType;
    }
    const matchesQuery = !query || (i.title || "").toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return emptyState;
  }

  if (view === "grid") {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {item.url ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📄</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-black truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-500">{item.model} • {formatDate(item.created_date)}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDownload(item.url)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Baixar">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500" title="Excluir">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center px-4 py-2 border-b border-gray-100">
        <span className="text-[10px] font-semibold tracking-wider text-gray-400">NOME</span>
      </div>
      {filtered.map((item) => (
        <div key={item.id} className="group flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
          {/* Thumbnail */}
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            {item.url ? (
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📄</div>
            )}
          </div>
          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">{item.title}</p>
            <p className="text-xs text-gray-500 truncate">{item.model} • {formatDate(item.created_date)}</p>
          </div>
          {/* Model badge */}
          {item.model && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {item.model}
            </span>
          )}
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Abrir conversa">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDownload(item.url)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Baixar">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Excluir">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
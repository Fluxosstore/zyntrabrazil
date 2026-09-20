import React, { useEffect, useState } from "react";
import { Download, Trash2, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import LibraryImageModal from "@/components/ayzen/LibraryImageModal";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchSize(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const len = res.headers.get("content-length");
    return len ? parseInt(len) : null;
  } catch {
    return null;
  }
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
  const [sizes, setSizes] = useState({});
  const [modalItem, setModalItem] = useState(null);

  const fetchItems = async () => {
    try {
      const data = await base44.entities.LibraryItem.list("-created_date", 200);
      setItems(data);
      data.forEach(async (item) => {
        if (item.url) {
          const size = await fetchSize(item.url);
          if (size) setSizes((prev) => ({ ...prev, [item.id]: size }));
        }
      });
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
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => item.url && item.type === "image" && setModalItem(item)}
              >
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
        <LibraryImageModal item={modalItem} onClose={() => setModalItem(null)} />
      </>
    );
  }

  return (
    <>
      <div>
        {/* Header row */}
        <div className="grid grid-cols-[1fr_120px_80px_120px] gap-4 px-4 py-2 border-b border-gray-100">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">NOME</span>
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">TIPO</span>
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">TAMANHO</span>
          <span className="text-[10px] font-semibold tracking-wider text-gray-400">MODIFICADO</span>
        </div>
        {filtered.map((item) => (
          <div key={item.id} className="group grid grid-cols-[1fr_120px_80px_120px] gap-4 items-center px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            {/* Name + thumbnail */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 cursor-pointer"
                onClick={() => item.url && item.type === "image" && setModalItem(item)}
              >
                {item.url ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📄</div>
                )}
              </div>
              <p className="text-sm font-medium text-black truncate">{item.title}</p>
            </div>
            {/* Type */}
            <div className="flex items-center gap-1.5 min-w-0">
              {item.model && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-medium shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {item.model}
                </span>
              )}
            </div>
            {/* Size */}
            <span className="text-xs text-gray-500">{formatSize(sizes[item.id])}</span>
            {/* Modified */}
            <span className="text-xs text-gray-500">{formatDate(item.created_date)}</span>
          </div>
        ))}
      </div>
      <LibraryImageModal item={modalItem} onClose={() => setModalItem(null)} />
    </>
  );
}
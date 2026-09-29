import React, { useEffect, useState } from "react";
import { Copy, MessageSquarePlus, Trash2, FileText, Music, Video, Image as ImageIcon, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import {
  MODELS_BY_PLAN, IMAGE_MODELS, IMAGE_MODELS_BY_PLAN,
  AUDIO_MODELS, AUDIO_MODELS_BY_PLAN, LOGO,
} from "@/components/ayzen/ModelSelector";

const ASTRONAUT =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/81e46fe3d_empty-astronaut-removebg-preview.png";
const GPT_LOGO = "https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg";

const MODEL_LOGO_BY_NAME = (() => {
  const map = { "Zyntra Auto": LOGO };
  const arrays = [
    ...Object.values(MODELS_BY_PLAN),
    IMAGE_MODELS,
    ...Object.values(IMAGE_MODELS_BY_PLAN),
    AUDIO_MODELS,
    ...Object.values(AUDIO_MODELS_BY_PLAN),
  ];
  for (const arr of arrays) {
    for (const m of arr || []) {
      if (m && m.name && m.logo) map[m.name] = m.logo;
    }
  }
  return map;
})();

function getModelLogo(model) {
  if (!model) return GPT_LOGO;
  if (MODEL_LOGO_BY_NAME[model]) return MODEL_LOGO_BY_NAME[model];
  const m = model.toLowerCase();
  if (m.includes("gpt") || m.includes("chatgpt") || m.includes("openai")) return GPT_LOGO;
  if (m.includes("gemini")) return "https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg";
  if (m.includes("claude")) return "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg";
  if (m.includes("deepseek")) return "https://upload.wikimedia.org/wikipedia/commons/b/ba/Deepseek-logo-icon.svg";
  if (m.includes("grok")) return "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";
  return GPT_LOGO;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const TAB_TYPE_MAP = { all: null, images: "image", files: null, docs: "doc", responses: "response" };
const SUB_TYPE_MAP = { all: null, docs: "doc", images: "image", audio: "audio", video: "video" };

function inferMediaKind(item) {
  if (item.type === "image") return "image";
  if (item.type === "response") return "response";
  const url = (item.url || "").toLowerCase();
  const model = (item.model || "").toLowerCase();
  if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/.test(url) || /audio|tts/.test(model)) return "audio";
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/.test(url) || /video/.test(model)) return "video";
  return item.type || "file";
}

function ThumbIcon({ item, className = "w-5 h-5 text-gray-400" }) {
  const kind = inferMediaKind(item);
  const Icon = kind === "audio" ? Music : kind === "video" ? Video : kind === "image" ? ImageIcon : kind === "response" ? Star : FileText;
  return <Icon className={className} />;
}

export default function DesktopLibraryContent({ activeTab, subFilter = "all", searchQuery = "" }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerItem, setViewerItem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.LibraryItem.list("-created_date", 200);
        setItems(data);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      await base44.entities.LibraryItem.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {}
  };

  const handleEditImage = (item) => {
    localStorage.setItem(
      `zyntra_edit_image_${user?.id || "guest"}`,
      JSON.stringify({ url: item.url, prompt: item.prompt || item.title, model: item.model })
    );
    navigate("/dashboard");
  };

  const filtered = items.filter((i) => {
    let matchesTab;
    if (activeTab === "files") {
      matchesTab = i.type !== "response";
      const subType = SUB_TYPE_MAP[subFilter];
      if (subType) {
        if (subType === "audio" || subType === "video") {
          matchesTab = matchesTab && inferMediaKind(i) === subType;
        } else {
          matchesTab = matchesTab && i.type === subType;
        }
      }
    } else {
      const targetType = TAB_TYPE_MAP[activeTab];
      matchesTab = !targetType || i.type === targetType;
    }
    const matchesQuery = !searchQuery || (i.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  const emptyTitleKey = `library.emptyTitle${activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  const emptyDescKey = `library.emptyDesc${activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;

  const emptyState = (
    <div className="flex-1 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center py-20 px-6">
      <img src={ASTRONAUT} alt="" className="w-32 h-32 object-contain mb-5 opacity-90" />
      <p className="text-base font-semibold text-black text-center">{t(emptyTitleKey)}</p>
      <p className="mt-1.5 text-sm text-gray-500 text-center max-w-sm">{t(emptyDescKey)}</p>
    </div>
  );

  // "Tudo" tab — sectioned view
  if (activeTab === "all") {
    if (filtered.length === 0) return emptyState;

    const images = filtered.filter((i) => i.type === "image");
    const responses = filtered.filter((i) => i.type === "response");
    const others = filtered.filter((i) => i.type !== "image" && i.type !== "response");

    return (
      <div className="space-y-8">
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">Imagens geradas</h2>
              <button className="text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors">
                {t("library.viewAll")}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((item) => (
                <div key={item.id} className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div
                    className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => item.url && setViewerItem(item)}
                  >
                    {item.url ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white text-black shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-black truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <img src={getModelLogo(item.model)} alt="" className="w-3.5 h-3.5 object-contain" />
                      <p className="text-[10px] text-gray-500">{item.model || "IA"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {responses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">{t("library.savedResponses")}</h2>
              <button className="text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors">
                {t("library.viewAll")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {responses.slice(0, 4).map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F1F1F3] flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={getModelLogo(item.model)} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black line-clamp-3 leading-snug">{item.title || item.prompt}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {item.model || "ChatGPT"} • {formatDate(item.created_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {others.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-black mb-4">Itens recentes</h2>
            <div className="grid grid-cols-2 gap-4">
              {others.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-2xl">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.type === "image" && item.url ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ThumbIcon item={item} className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.model} • {formatDate(item.created_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // "Respostas" tab — grouped by model
  if (activeTab === "responses") {
    if (filtered.length === 0) return emptyState;
    const grouped = {};
    filtered.forEach((item) => {
      const model = item.model || "IA";
      if (!grouped[model]) grouped[model] = [];
      grouped[model].push(item);
    });
    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([model, modelItems]) => (
          <div key={model}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={getModelLogo(modelItems[0]?.model)} alt="" className="w-5 h-5 object-contain" />
              </div>
              <h2 className="text-sm font-bold text-black">{model}</h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                {modelItems.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {modelItems.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={getModelLogo(item.model)} alt="" className="w-4 h-4 object-contain" />
                      </div>
                      <p className="text-sm font-semibold text-black leading-tight">{item.model || "ChatGPT"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditImage(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{item.title || item.prompt}</p>
                  <p className="text-right text-xs text-gray-500 mt-2">{formatDate(item.created_date)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) return emptyState;

  // Images tab
  if (activeTab === "images") {
    return (
      <div className="grid grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
            <div
              className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
              onClick={() => item.url && setViewerItem(item)}
            >
              {item.url ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white text-black shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-black truncate">{item.title}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <img src={getModelLogo(item.model)} alt="" className="w-3.5 h-3.5 object-contain" />
                <p className="text-[10px] text-gray-500">{item.model || "IA"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Docs / Files tabs
  return (
    <div className="space-y-2">
      {filtered.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
            {item.type === "image" && item.url ? (
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <ThumbIcon item={item} className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.model} • {formatDate(item.created_date)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Copy, MessageSquarePlus, Trash2, FileText, Music, Video, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import MobileImageViewer from "@/components/ayzen/library/MobileImageViewer";
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

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

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
  const Icon = kind === "audio" ? Music : kind === "video" ? Video : kind === "image" ? ImageIcon : FileText;
  return <Icon className={className} />;
}

function getModelLogo(model) {
  if (!model) return GPT_LOGO;
  if (MODEL_LOGO_BY_NAME[model]) return MODEL_LOGO_BY_NAME[model];
  const m = model.toLowerCase();
  if (m.includes("gpt") || m.includes("chatgpt") || m.includes("openai")) return GPT_LOGO;
  if (m.includes("gemini")) return "https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg";
  if (m.includes("claude")) return "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg";
  if (m.includes("deepseek")) return "https://upload.wikimedia.org/wikipedia/commons/b/ba/Deepseek-logo-icon.svg";
  if (m.includes("grok")) return "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg";
  if (m.includes("fish")) return "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fish.audio/&size=256";
  if (m.includes("minimax")) return "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://minimaxi.com/&size=256";
  if (m.includes("qwen")) return "https://openrouter.ai/images/icons/Qwen.png";
  if (m.includes("deepgram")) return "https://openrouter.ai/images/icons/Deepgram.svg";
  if (m.includes("microsoft") || m.includes("mai")) return "https://openrouter.ai/images/icons/MAI.png";
  return GPT_LOGO;
}

export default function MobileLibraryContent({ activeTab, subFilter = "all", searchQuery = "" }) {
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

  const emptyTitleKey = `library.emptyTitle${
    activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  }`;
  const emptyDescKey = `library.emptyDesc${
    activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  }`;

  const emptyState = (
    <div className="flex-1 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center py-16 px-6">
      <img src={ASTRONAUT} alt="" className="w-28 h-28 object-contain mb-5 opacity-90" />
      <p className="text-sm font-semibold text-black text-center">{t(emptyTitleKey)}</p>
      <p className="mt-1.5 text-sm text-gray-500 text-center max-w-xs">{t(emptyDescKey)}</p>
    </div>
  );

  // "Tudo" tab — separated sections: images, responses, audio/files
  if (activeTab === "all") {
    if (filtered.length === 0) return emptyState;

    const images = filtered.filter((i) => i.type === "image");
    const responses = filtered.filter((i) => i.type === "response");
    const others = filtered.filter((i) => i.type !== "image" && i.type !== "response");

    return (
      <>
        <div className="space-y-6">
          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-bold text-black">Imagens geradas</h2>
                <button className="text-xs text-gray-400 font-medium">{t("library.viewAll")}</button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {images.slice(0, 12).map((item) => (
                  <AllTabImageCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onOpen={() => item.url && setViewerItem(item)}
                  />
                ))}
              </div>
            </div>
          )}
          {responses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-bold text-black">{t("library.savedResponses")}</h2>
                <button className="text-xs text-gray-400 font-medium">{t("library.viewAll")}</button>
              </div>
              <div className="space-y-2">
                {responses.slice(0, 3).map((item) => (
                  <SimpleResponseCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-black mb-2.5">Itens recentes</h2>
              <div className="space-y-2">
                {others.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
        <MobileImageViewer
          item={viewerItem}
          items={images}
          onClose={() => setViewerItem(null)}
          onDelete={handleDelete}
        />
      </>
    );
  }

  // "Respostas" tab — grouped by model with actions
  if (activeTab === "responses") {
    if (filtered.length === 0) return emptyState;

    const grouped = {};
    filtered.forEach((item) => {
      const model = item.model || "IA";
      if (!grouped[model]) grouped[model] = [];
      grouped[model].push(item);
    });

    return (
      <div className="space-y-5">
        {Object.entries(grouped).map(([model, modelItems]) => (
          <div key={model}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={getModelLogo(modelItems[0]?.model)} alt="" className="w-4 h-4 object-contain" />
              </div>
              <h2 className="text-sm font-bold text-black">{model}</h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                {modelItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {modelItems.map((item) => (
                <DetailedResponseCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={handleEditImage}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Images, Documents, Files tabs
  if (filtered.length === 0) return emptyState;

  if (activeTab === "images") {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 overflow-hidden bg-white"
            >
              <div
                className="relative aspect-square bg-gray-100 overflow-hidden"
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
                  className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white active:bg-black/70 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-black truncate">{item.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {item.model} • {formatDate(item.created_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <MobileImageViewer
          item={viewerItem}
          items={filtered}
          onClose={() => setViewerItem(null)}
          onDelete={handleDelete}
        />
      </>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

function SimpleResponseCard({ item }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F1F1F3] flex items-center justify-center shrink-0 overflow-hidden">
          <img src={getModelLogo(item.model)} alt="" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-black line-clamp-2 leading-snug">{item.title || item.prompt}</p>
          <p className="text-xs text-gray-500 mt-1">
            {item.model || "ChatGPT"} • {formatDate(item.created_date)}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailedResponseCard({ item, onDelete, onEdit }) {
  return (
    <div className="p-3.5 bg-white border border-gray-200 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
            <img src={getModelLogo(item.model)} alt="" className="w-4 h-4 object-contain" />
          </div>
          <p className="text-sm font-semibold text-black leading-tight">{item.model || "ChatGPT"}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 active:bg-gray-100">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 active:bg-gray-100"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 active:bg-red-50 active:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{item.title || item.prompt}</p>
      <p className="text-right text-xs text-gray-500 mt-2">{formatDate(item.created_date)}</p>
    </div>
  );
}

function AllTabImageCard({ item, onDelete, onOpen }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div
        className="relative aspect-square bg-gray-100 overflow-hidden"
        onClick={onOpen}
      >
        {item.url ? (
          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-white text-black active:bg-gray-100 transition-colors shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-black truncate">{item.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <img src={getModelLogo(item.model)} alt="" className="w-3.5 h-3.5 object-contain" />
          <p className="text-[10px] text-gray-500">{item.model || "IA"}</p>
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {item.type === "image" && item.url ? (
          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <ThumbIcon item={item} className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black truncate">{item.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.model} • {formatDate(item.created_date)}
        </p>
      </div>
    </div>
  );
}
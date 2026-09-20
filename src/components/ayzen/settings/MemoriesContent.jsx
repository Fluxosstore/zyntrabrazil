import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Plus, X, Save, Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function MemoriesContent() {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [autoExtraction, setAutoExtraction] = useState(false);
  const [useMemories, setUseMemories] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [memoryText, setMemoryText] = useState("");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingMemory, setSavingMemory] = useState(false);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    setAutoExtraction(!!user?.auto_extraction);
    setUseMemories(!!user?.use_memories);
  }, [user]);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const list = await base44.entities.Memory.list("-created_date", 100);
      setMemories(list || []);
    } catch (e) {
      console.error("Erro ao carregar memórias:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoExtraction = async (checked) => {
    setAutoExtraction(checked);
    setToggling("auto");
    try {
      await base44.auth.updateMe({ auto_extraction: checked });
      await refreshUser();
    } catch (e) {
      setAutoExtraction(!checked);
    } finally {
      setToggling(null);
    }
  };

  const handleToggleUseMemories = async (checked) => {
    setUseMemories(checked);
    setToggling("use");
    try {
      await base44.auth.updateMe({ use_memories: checked });
      await refreshUser();
    } catch (e) {
      setUseMemories(!checked);
    } finally {
      setToggling(null);
    }
  };

  const handleSaveMemory = async () => {
    if (!memoryText.trim()) return;
    setSavingMemory(true);
    try {
      await base44.entities.Memory.create({ content: memoryText.trim() });
      setMemoryText("");
      setShowAddForm(false);
      await loadMemories();
    } catch (e) {
      console.error("Erro ao salvar memória:", e);
    } finally {
      setSavingMemory(false);
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      await base44.entities.Memory.delete(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error("Erro ao deletar memória:", e);
    }
  };

  const count = memories.length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.memories")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.memoriesSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-start gap-3 p-5">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                    {t("settings.memories")}
                  </p>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-base font-bold text-black mt-0.5">{t("settings.memoriesSaved")}</p>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">{t("settings.memoriesCardDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.memoriesSavedCount")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{count}</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.autoExtraction")}
                </p>
                <p className={`text-sm font-bold mt-1 ${autoExtraction ? "text-green-600" : "text-black"}`}>
                  {autoExtraction ? t("settings.enabled") : t("settings.disabled")}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.useMemoriesConvo")}
                </p>
                <p className={`text-sm font-bold mt-1 ${useMemories ? "text-green-600" : "text-black"}`}>
                  {useMemories ? t("settings.enabled") : t("settings.disabled")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Controles de memória */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.memoryControls")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.memoryControlsDesc")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex-1">
                <p className="text-sm font-bold text-black">{t("settings.autoExtractionToggle")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.autoExtractionToggleDesc")}</p>
              </div>
              <Switch
                checked={autoExtraction}
                onCheckedChange={handleToggleAutoExtraction}
                disabled={toggling === "auto"}
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex-1">
                <p className="text-sm font-bold text-black">{t("settings.useMemoriesToggle")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.useMemoriesToggleDesc")}</p>
              </div>
              <Switch
                checked={useMemories}
                onCheckedChange={handleToggleUseMemories}
                disabled={toggling === "use"}
              />
            </div>
          </div>
        </section>

        {/* Memórias salvas */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-black">{t("settings.memoriesSaved")}</h2>
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gray-200 text-xs font-bold text-gray-600">
              {count}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 flex flex-col items-center text-center">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : count === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-black">{t("settings.noMemoriesTitle")}</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">{t("settings.noMemoriesDesc")}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
              {memories.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-3 p-4 group">
                  <p className="text-sm text-black flex-1 break-words">{m.content}</p>
                  <button
                    onClick={() => handleDeleteMemory(m.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("settings.addMemory")}
            </button>

            {showAddForm && (
              <div className="rounded-xl border border-gray-300 bg-white p-4">
                <textarea
                  autoFocus
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  placeholder={t("settings.addMemoryPlaceholder")}
                  rows={3}
                  className="w-full text-sm text-black placeholder:text-gray-500 focus:outline-none resize-none bg-transparent"
                />
                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setMemoryText("");
                    }}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    {t("settings.cancel")}
                  </button>
                  <button
                    onClick={handleSaveMemory}
                    disabled={!memoryText.trim() || savingMemory}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {savingMemory ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {t("settings.save")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
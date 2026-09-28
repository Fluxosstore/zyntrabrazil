import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Plus, X, Save, Trash2, Loader2, MessageCircle, Brain } from "lucide-react";
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
  const [forgetting, setForgetting] = useState(false);

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

  const handleForgetAll = async () => {
    if (memories.length === 0) return;
    setForgetting(true);
    try {
      await base44.entities.Memory.deleteMany({});
      setMemories([]);
    } catch (e) {
      console.error("Erro ao esquecer memórias:", e);
    } finally {
      setForgetting(false);
    }
  };

  const count = memories.length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Memórias</h1>
          <p className="text-sm text-gray-500 mt-1">Informações que a IA lembra sobre você</p>
        </div>

        

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 items-start">
          {/* Left: Controles de memória */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-base font-bold text-black">Controles de memória</h2>
              <HelpCircle className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
            <p className="text-xs text-gray-500 mb-4">Defina quando a Ayzen pode aprender e quando deve usar o que já sabe sobre você.</p>

            {/* Toggle rows */}
            <div className="space-y-3">
              {/* Extração automática */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-black">Extração automática</p>
                      <span className="text-[11px] font-medium text-gray-400">{autoExtraction ? "Ativa" : "Inativa"}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">A IA aprende sobre você automaticamente durante as conversas</p>
                  </div>
                </div>
                <Switch
                  checked={autoExtraction}
                  onCheckedChange={handleToggleAutoExtraction}
                  disabled={toggling === "auto"} />
                
              </div>

              {/* Usar memórias */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-black">Usar memórias nas conversas</p>
                      <span className="text-[11px] font-medium text-gray-400">{useMemories ? "Ativa" : "Inativa"}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">A IA usa o que já guardou pra personalizar as respostas</p>
                  </div>
                </div>
                <Switch
                  checked={useMemories}
                  onCheckedChange={handleToggleUseMemories}
                  disabled={toggling === "use"} />
                
              </div>
            </div>

            {/* Footer: Esquecer tudo */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleForgetAll}
                disabled={forgetting || count === 0}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                
                {forgetting ?
                <Loader2 className="w-4 h-4 animate-spin" /> :

                <Trash2 className="w-4 h-4" />
                }
                Esquecer tudo
              </button>
            </div>
          </div>

          {/* Right: Memórias salvas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-black">Memórias salvas</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7a52d5] text-white text-xs font-medium hover:bg-[#6b4bd0] transition-colors">
                
                <Plus className="w-3.5 h-3.5" />
                Adicionar memória
              </button>
            </div>

            {/* Add form */}
            {showAddForm &&
            <div className="mb-4 rounded-xl border border-gray-300 bg-white p-4">
                <textarea
                autoFocus
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Escreva algo que a IA deve lembrar sobre você..."
                rows={3}
                className="w-full text-sm text-black placeholder:text-gray-500 focus:outline-none resize-none bg-transparent" />
              
                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                  onClick={() => {
                    setShowAddForm(false);
                    setMemoryText("");
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  
                    <X className="w-3.5 h-3.5" />
                    Cancelar
                  </button>
                  <button
                  onClick={handleSaveMemory}
                  disabled={!memoryText.trim() || savingMemory}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  
                    {savingMemory ?
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> :

                  <Save className="w-3.5 h-3.5" />
                  }
                    Salvar
                  </button>
                </div>
              </div>
            }

            {/* Content area */}
            {loading ?
            <div className="flex-1 flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div> :
            count === 0 ?
            <div className="flex-1 flex items-center justify-center py-8">
                <div className="w-full rounded-xl border-2 border-dashed border-gray-200 p-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img
                    src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d3c3f358_ChatGPTImage17desetde202619_47_55.png"
                    alt="Sem memórias"
                    className="w-16 h-16 object-contain opacity-80" />
                  
                  </div>
                  <p className="text-sm font-bold text-black">Nenhuma memória salva ainda</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">A IA vai guardar aqui o que aprender sobre você nas conversas.</p>
                </div>
              </div> :

            <div className="flex-1 space-y-2">
                {memories.map((m) =>
              <div key={m.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 group">
                    <p className="text-sm text-black flex-1 break-words">{m.content}</p>
                    <button
                  onClick={() => handleDeleteMemory(m.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
              )}
              </div>
            }
          </div>
        </section>
      </div>
    </div>);

}
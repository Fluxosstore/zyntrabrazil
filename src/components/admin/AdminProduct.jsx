import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2, Check, X, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEFAULT_MODELS = [
  { id: "deepseek", name: "DeepSeek V3", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d6d9b4c6f_deepseek.svg", enabled: true },
  { id: "gemini", name: "Gemini 2.5 Pro", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg", enabled: true },
  { id: "gpt", name: "GPT-5", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg", enabled: true },
  { id: "claude", name: "Claude Sonnet 4.5", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c0a57947c_claude.svg", enabled: true },
  { id: "grok", name: "Grok 4", logo: "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ad894e6fd_grok.svg", enabled: true },
];

export default function AdminProduct() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newModel, setNewModel] = useState({ id: "", name: "", logo: "" });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await base44.entities.ProductConfig.list();
      if (data.length > 0) {
        setConfig(data[0]);
      } else {
        const created = await base44.entities.ProductConfig.create({
          product_name: "Zyntra",
          product_description: "O hub de IA profissional que centraliza os modelos mais potentes do mundo em uma única assinatura.",
          product_tagline: "Todas as IAs, uma só conversa.",
          available_models: DEFAULT_MODELS,
          support_email: "suporte@zyntra.com",
          primary_color: "#7E57C2",
        });
        setConfig(created);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.ProductConfig.update(config.id, {
        product_name: config.product_name,
        product_description: config.product_description,
        product_tagline: config.product_tagline,
        available_models: config.available_models,
        support_email: config.support_email,
        primary_color: config.primary_color,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
    setSaving(false);
  };

  const toggleModel = (id) => {
    setConfig({
      ...config,
      available_models: config.available_models.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m),
    });
  };

  const removeModel = (id) => {
    setConfig({
      ...config,
      available_models: config.available_models.filter(m => m.id !== id),
    });
  };

  const addModel = () => {
    if (!newModel.name.trim()) return;
    setConfig({
      ...config,
      available_models: [...config.available_models, {
        id: newModel.id || newModel.name.toLowerCase().replace(/\s+/g, "_"),
        name: newModel.name,
        logo: newModel.logo || "",
        enabled: true,
      }],
    });
    setNewModel({ id: "", name: "", logo: "" });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
        Erro ao carregar configuração do produto.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Produto</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configure o nome, descrição e modelos do produto</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
          </button>
        </div>

        {/* Product Identity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Identidade do produto</h2>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Nome do produto</label>
            <input
              value={config.product_name || ""}
              onChange={e => setConfig({ ...config, product_name: e.target.value })}
              className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Tagline / Slogan</label>
            <input
              value={config.product_tagline || ""}
              onChange={e => setConfig({ ...config, product_tagline: e.target.value })}
              placeholder="Todas as IAs, uma só conversa."
              className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Descrição do produto</label>
            <textarea
              value={config.product_description || ""}
              onChange={e => setConfig({ ...config, product_description: e.target.value })}
              rows={4}
              className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">E-mail de suporte</label>
              <input
                value={config.support_email || ""}
                onChange={e => setConfig({ ...config, support_email: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Cor primária</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={config.primary_color || "#7E57C2"}
                  onChange={e => setConfig({ ...config, primary_color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  value={config.primary_color || ""}
                  onChange={e => setConfig({ ...config, primary_color: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono focus:outline-none focus:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Models */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Modelos de IA</h2>
              <p className="text-xs text-gray-500 mt-0.5">Gerencie os modelos disponíveis no produto</p>
            </div>
            <span className="text-xs text-gray-500">{config.available_models?.length || 0} modelos</span>
          </div>

          {/* Model List */}
          <div className="space-y-2">
            {config.available_models?.map((model) => (
              <div key={model.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {model.logo ? (
                    <img src={model.logo} alt={model.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">{model.name?.charAt(0)}</span>
                  )}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-900">{model.name}</span>
                <button
                  onClick={() => toggleModel(model.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${model.enabled ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${model.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <button
                  onClick={() => removeModel(model.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Model */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-2">Adicionar novo modelo</p>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                value={newModel.name}
                onChange={e => setNewModel({ ...newModel, name: e.target.value })}
                placeholder="Nome (ex: Llama 4)"
                className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
              <input
                value={newModel.logo}
                onChange={e => setNewModel({ ...newModel, logo: e.target.value })}
                placeholder="URL do logo (opcional)"
                className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
              <button
                onClick={addModel}
                disabled={!newModel.name.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
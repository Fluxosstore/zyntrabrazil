import React, { useState, useEffect } from "react";
import { ChevronRight, Lock, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";

const MAX_SKILLS = 20;

export default function SkillFormContent({ onBack, editSkill, onSaved }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editSkill) {
      setName(editSkill.name || "");
      setDescription(editSkill.description || "");
      setInstructions(editSkill.instructions || "");
    }
  }, [editSkill]);

  const isNameValid = /^[a-z0-9-]+$/.test(name);

  const handleSave = async () => {
    setError("");

    if (!name.trim() || !instructions.trim()) {
      setError(t("settings.skillRequired"));
      return;
    }

    if (!isNameValid) {
      setError(t("settings.skillNameError"));
      return;
    }

    setSaving(true);
    try {
      if (editSkill) {
        await base44.entities.Skill.update(editSkill.id, {
          name: name.trim(),
          description: description.trim(),
          instructions: instructions.trim(),
        });
      } else {
        const existing = await base44.entities.Skill.list();
        if (existing.length >= MAX_SKILLS) {
          setError(t("settings.skillLimitReached"));
          setSaving(false);
          return;
        }
        await base44.entities.Skill.create({
          name: name.trim(),
          description: description.trim(),
          instructions: instructions.trim(),
          active: true,
        });
      }
      onSaved?.();
    } catch (err) {
      setError(err.message || t("settings.skillSaveError"));
    }
    setSaving(false);
  };

  const previewName = name.trim() || "proposta-comercial";
  const previewDesc =
    description.trim() ||
    "Quando essa habilidade deve ser usada (Ex: Para escrever propostas comerciais)";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-10 py-5 md:py-8 space-y-6 w-full">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Habilidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Instruções reutilizáveis que a IA segue quando você ativa
          </p>
        </div>

        {/* Two-column: preview + form */}
        <div className="grid grid-cols-1 lg:grid-cols-[720px_1fr] gap-6 items-start">
          {/* Left: breadcrumb + Prévia no chat */}
          <div className="space-y-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <button onClick={onBack} className="hover:text-gray-600 transition-colors">
                Minhas habilidades
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600">
                {editSkill ? t("settings.editSkill") : "Nova habilidade"}
              </span>
            </div>

            {/* Prévia no chat */}
            <div className="rounded-2xl bg-[#7C5DFA] p-5 flex flex-col text-white lg:sticky lg:top-4">
              <h2 className="text-base font-bold mb-4">Prévia no chat</h2>

              <p className="text-xs text-white/70 mb-1">No chat:</p>
              <p className="text-2xl font-bold tracking-tight mb-4 break-words">
                /{previewName}
              </p>

              <div className="rounded-xl bg-white/15 p-3.5 mb-6">
                <p className="text-sm text-white/90 leading-relaxed break-words">
                  {previewDesc}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-[11px] font-medium text-white/70">Gatilho</span>
                <span className="text-[11px] font-medium text-white/70">
                  Comando de barra
                </span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
            <h2 className="text-lg font-bold text-black">
              {editSkill ? t("settings.editSkill") : "Nova habilidade"}
            </h2>

            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 64))}
                placeholder="proposta-comercial"
                className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Só letras minúsculas, números e hífen. Vira o comando /nome no chat.
                </p>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {name.length}/64
                </span>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">Descrição</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 1024))}
                placeholder="Quando essa habilidade deve ser usada (Ex: Para escrever propostas comerciais)"
                className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-400">
                  {description.length}/1024
                </span>
              </div>
            </div>

            {/* Instruções */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">Instruções</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.slice(0, 30000))}
                placeholder="Escreva como a IA deve agir quando essa habilidade estiver ativa"
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-y transition-colors"
              />
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-400">
                  {instructions.length}/30000
                </span>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5DFA] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {saving ? t("settings.skillSaving") : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
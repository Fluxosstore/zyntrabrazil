import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">
            {editSkill ? t("settings.editSkill") : t("settings.newSkill")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.skillsSubtitle")}</p>
        </div>

        {/* Back link */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("settings.back")}
        </button>

        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-black">
            {editSkill ? t("settings.editSkill") : t("settings.newSkill")}
          </h2>

          {/* Nome */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">{t("settings.skillName")}</label>
              <span className="text-xs text-gray-400">{name.length}/64</span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 64))}
              placeholder={t("settings.skillNamePlaceholder")}
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="text-xs text-gray-500">{t("settings.skillNameHelper")}</p>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">{t("settings.skillDesc")}</label>
              <span className="text-xs text-gray-400">{description.length}/1024</span>
            </div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1024))}
              placeholder={t("settings.skillDescPlaceholder")}
              className="w-full h-11 px-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Instruções */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">{t("settings.skillInstructions")}</label>
              <span className="text-xs text-gray-400">{instructions.length}/30000</span>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, 30000))}
              placeholder={t("settings.skillInstructionsPlaceholder")}
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-y"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onBack}
              className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              {t("settings.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B5563] text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? t("settings.skillSaving") : t("settings.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
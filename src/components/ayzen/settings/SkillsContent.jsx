import React, { useState, useEffect } from "react";
import { Crown, Wand2, Trash2, Pencil, Plus, Loader2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";

const MAX_SKILLS = 20;

export default function SkillsContent({ plan = "free", onCreateSkill, onEditSkill }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isPaid = plan && plan !== "free";

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Skill.list("-created_date", 100);
      setSkills(list || []);
    } catch (err) {
      console.error("Erro ao carregar habilidades:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPaid) loadSkills();
  }, [isPaid]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("[data-skill-menu]")) setMenuOpenId(null);
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpenId]);

  if (!isPaid) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8 space-y-8">
          <div>
            <p className="text-xs text-gray-400">{t("settings.title")}</p>
            <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.skills")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("settings.skillsSubtitle")}</p>
          </div>

          <div className="border-t border-gray-200" />

          <section>
            <h2 className="text-base font-bold text-black mb-1">{t("settings.mySkills")}</h2>
            <p className="text-xs text-gray-500 mb-3">{t("settings.mySkillsDesc")}</p>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-black">{t("settings.skillsPremiumTitle")}</p>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium shrink-0">
                      {t("settings.premiumFeature")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 md:whitespace-nowrap">{t("settings.skillsPremiumDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/plan-selection")}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
              >
                {t("settings.seePlans")}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const activeCount = skills.filter((s) => s.active).length;
  const inactiveCount = skills.length - activeCount;
  const available = MAX_SKILLS - skills.length;

  const handleToggle = async (skill) => {
    try {
      await base44.entities.Skill.update(skill.id, { active: !skill.active });
      setSkills((prev) => prev.map((s) => s.id === skill.id ? { ...s, active: !s.active } : s));
    } catch (err) {
      console.error("Erro ao alternar habilidade:", err);
    }
  };

  const handleDelete = async (skill) => {
    setDeletingId(skill.id);
    try {
      await base44.entities.Skill.delete(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      setMenuOpenId(null);
    } catch (err) {
      console.error("Erro ao excluir habilidade:", err);
    }
    setDeletingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.skills")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.skillsSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Summary card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-black">{t("settings.skillsLibraryTitle")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.skillsLibraryDesc")}</p>
              </div>
              {skills.length > 0 && (
                <button
                  onClick={onCreateSkill}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("settings.newSkillBtn")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsActive")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{activeCount}</p>
              </div>
              <div className="p-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsInactive")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{inactiveCount}</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.skillsAvailable")}
                </p>
                <p className="text-lg font-bold text-black mt-0.5">{available}</p>
              </div>
            </div>
          </div>
        </section>

        {/* My skills */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.mySkills")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.mySkillsDesc")}</p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Wand2 className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-black">{t("settings.createFirstSkill")}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("settings.createFirstSkillDesc")}</p>
                </div>
              </div>
              <button
                onClick={onCreateSkill}
                className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0 whitespace-nowrap"
              >
                {t("settings.createFirstSkillBtn")}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3"
                >
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(skill)}
                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                      skill.active ? "bg-black" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        skill.active ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">/{skill.name}</span>
                      {skill.active ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                          {t("settings.skillActiveLabel")}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                          {t("settings.skillInactiveLabel")}
                        </span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{skill.description}</p>
                    )}
                  </div>

                  {/* Actions menu */}
                  <div className="relative" data-skill-menu>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === skill.id ? null : skill.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpenId === skill.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        <button
                          onClick={() => {
                            onEditSkill?.(skill);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          {t("settings.editSkillBtn")}
                        </button>
                        <button
                          onClick={() => handleDelete(skill)}
                          disabled={deletingId === skill.id}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                        >
                          {deletingId === skill.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {t("settings.deleteSkill")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
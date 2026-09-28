import React, { useState, useEffect } from "react";
import { Plus, Loader2, ChevronDown, Trash2, Pencil, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";

const ASTRONAUT_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/81e46fe3d_empty-astronaut-removebg-preview.png";

// Habilidades atribuídas (globais / da empresa) — exemplo estático
const ASSIGNED_SKILLS = [
  {
    id: "a1",
    name: "acabamento-pro",
    description:
      "Craft verificável: grid 4/8px, anatomia de botão, todos os estados, movimento e hierarquia de superfície.",
    tag: "Global"
  },
  {
    id: "a2",
    name: "animacao-de-interface",
    description:
      "Animação como decisão: gate de frequência, propósito nomeado, tabela de durações e curvas.",
    tag: "Global"
  },
  {
    id: "a3",
    name: "apple-design",
    description:
      "Interface fluida estilo Apple: resposta imediata, gesto 1:1, interruptibilidade, física no release.",
    tag: "Global"
  },
  {
    id: "a4",
    name: "auditoria-de-ui",
    description:
      "Passe objetivo de acessibilidade, foco, formulários, overflow, imagens, dark mode e toque.",
    tag: "Global"
  },
  {
    id: "a5",
    name: "catalogo-de-estilos",
    description:
      "Sete direções prontas (Preciso, Editorial, Brutal, Orgânico, Noturno, Luxo, Vitrine) pra executar por inteiro.",
    tag: "Global"
  }
];

const TOTAL_ASSIGNED = 14;

export default function SkillsContent({ plan = "free", onCreateSkill, onEditSkill }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isPaid = plan && plan !== "free";

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedAssigned, setExpandedAssigned] = useState(null);
  const [showAllAssigned, setShowAllAssigned] = useState(false);

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

  const handleToggle = async (skill) => {
    try {
      await base44.entities.Skill.update(skill.id, { active: !skill.active });
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, active: !s.active } : s))
      );
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

  // Lista de atribuídas: mostra 5 por padrão, todas quando expandido
  const assignedToShow = showAllAssigned ? ASSIGNED_SKILLS : ASSIGNED_SKILLS.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Habilidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            Instruções reutilizáveis que a IA segue quando você ativa
          </p>
        </div>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left: Minhas habilidades */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <h2 className="text-base font-bold text-black mb-1">Minhas habilidades</h2>
            <p className="text-xs text-gray-500 mb-4">
              Cadastre instruções reutilizáveis e ative no chat digitando{" "}
              <span className="font-medium text-black">/nome-da-habilidade</span>.
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : skills.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center text-center px-6 py-10">
                <img
                  src={ASTRONAUT_IMG}
                  alt="Sem habilidades"
                  className="w-40 h-40 object-contain mb-6"
                />
                <p className="text-base font-bold text-black">Crie sua primeira habilidade</p>
                <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
                  Escreva uma vez, ative sempre que precisar, sem repetir contexto em toda conversa.
                </p>
                <button
                  onClick={onCreateSkill}
                  className="mt-6 flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7C5DCF] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Criar primeira habilidade
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5 flex items-center gap-3"
                  >
                    <button
                      onClick={() => handleToggle(skill)}
                      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                        skill.active ? "bg-[#7C5DCF]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          skill.active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black">/{skill.name}</span>
                        {skill.active ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
                            Ativa
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                            Inativa
                          </span>
                        )}
                      </div>
                      {skill.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{skill.description}</p>
                      )}
                    </div>
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
                            Editar
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
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={onCreateSkill}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova habilidade
                </button>
              </div>
            )}
          </div>

          {/* Right: Atribuídas a você */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-black">Atribuídas a você</h2>
              <span className="text-xs text-gray-500">{TOTAL_ASSIGNED} habilidades</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Habilidades da empresa ou direcionadas a você por um administrador.
            </p>

            <div className="flex-1 space-y-2">
              {assignedToShow.map((skill) => {
                const expanded = expandedAssigned === skill.id;
                return (
                  <div
                    key={skill.id}
                    className="rounded-xl border border-gray-200 bg-white p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-black">/{skill.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium shrink-0">
                            {skill.tag}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-gray-500 leading-relaxed ${
                            expanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {skill.description}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedAssigned(expanded ? null : skill.id)
                        }
                        className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition-colors shrink-0 mt-0.5"
                      >
                        Ver instruções
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAllAssigned((v) => !v)}
              className="mt-4 mx-auto flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Ver todas ({TOTAL_ASSIGNED})
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
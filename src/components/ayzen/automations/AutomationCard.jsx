import React from "react";
import {
  Mail, Reply, MessageSquare, Sunrise, CheckSquare, CalendarPlus, Video,
  FolderSync, FolderTree, Languages, GitPullRequest, BarChart3,
  TrendingUp, AlertCircle, Cake, Clock, Zap, Bell,
} from "lucide-react";

const ICONS = {
  Mail, Reply, MessageSquare, Sunrise, CheckSquare, CalendarPlus, Video,
  FolderSync, FolderTree, Languages, GitPullRequest, BarChart3,
  TrendingUp, AlertCircle, Cake, Clock, Zap, Bell,
};

const TRIGGER_STYLES = {
  schedule: { label: "Agendado", bg: "bg-blue-50", text: "text-blue-600", icon: "Clock" },
  connector: { label: "Tempo real", bg: "bg-amber-50", text: "text-amber-600", icon: "Zap" },
  entity: { label: "Por evento", bg: "bg-violet-50", text: "text-violet-600", icon: "Bell" },
};

export default function AutomationCard({ template, onToggle, active }) {
  const Icon = ICONS[template.icon] || Clock;
  const trigStyle = TRIGGER_STYLES[template.trigger];
  const TrigIcon = ICONS[trigStyle.icon];
  const isSoon = template.soon;

  return (
    <div className="group flex flex-col p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#7E57C2]/40 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-[#7E57C2]" style={{ width: 18, height: 18 }} />
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${trigStyle.bg} ${trigStyle.text}`}>
          <TrigIcon style={{ width: 10, height: 10 }} />
          {trigStyle.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-black mb-1.5">{template.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{template.desc}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          {template.needs.length === 0 ? (
            <span className="text-[10px] text-gray-400">Sem dependências</span>
          ) : (
            <span className="text-[10px] text-gray-400">
              {template.needs.length} {template.needs.length === 1 ? "conector" : "conectores"}
            </span>
          )}
        </div>
        {isSoon ? (
          <span className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            Em breve
          </span>
        ) : (
          <button
            onClick={() => onToggle?.(template.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              active
                ? "bg-[#7E57C2] text-white hover:bg-[#6E46B2]"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {active ? "Ativada" : "Ativar"}
          </button>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { ChevronRight } from "lucide-react";
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

export default function MobileAutomationCard({ template, onClick: onClickProp }) {
  const Icon = ICONS[template.icon] || Clock;

  return (
    <button
      onClick={onClickProp}
      className="w-full flex items-center gap-3 px-3 py-3 bg-[#F4F4F6] rounded-2xl text-left active:bg-gray-200/70 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-[#F3EEFF] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#7B5BC8]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-black truncate">{template.title}</p>
        <p className="text-xs text-gray-500 truncate">{template.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
    </button>
  );
}
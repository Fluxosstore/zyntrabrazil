import React, { useState, useRef } from "react";
import {
  PanelLeft,
  ChevronDown,
  MessageSquarePlus,
  Plus,
  Mic,
  ArrowUp,
  Paperclip,
  X,
  VenetianMask,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import ChatMessages from "@/components/ayzen/chat/ChatMessages";
import ModelSelector, { getModelInfo } from "@/components/ayzen/ModelSelector";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41.png";

export default function MobileDashboard({
  msg, setMsg, handleSend,
  messages, loading,
  model, plan,
  attachedFile, setAttachedFile,
  conversations, activeConversationId,
  onNewConversation, onSelectConversation,
  onDeleteConversation, onRenameConversation,
  onTogglePin, onToggleSelect,
  onEditMessage, onReprocess,
  tempMode, setTempMode,
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const fileInputRef = useRef(null);

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greetingMorning");
    if (h < 18) return t("dash.greetingAfternoon");
    return t("dash.greetingNight");
  }
  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const modelInfo = getModelInfo(model, plan);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setModelOpen(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setModelOpen(v => !v)}
            className="flex items-center gap-1.5"
          >
            <img src={modelInfo.logo} alt={modelInfo.name} className="w-5 h-5 rounded object-contain" />
            <span className="text-sm font-semibold text-black">{modelInfo.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {modelOpen && (
            <ModelSelector
              selected={model}
              plan={plan}
              onSelect={(id) => { setModelOpen(false); }}
              onClose={() => setModelOpen(false)}
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTempMode?.(v => !v)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:bg-gray-100 ${tempMode ? "text-[#7E57C2]" : "text-gray-700"}`}
          >
            <VenetianMask className="w-5 h-5" />
          </button>
          <button
            onClick={() => { onNewConversation(); }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages or empty state */}
      {messages.length > 0 ? (
        <div className="flex-1 overflow-hidden">
          <ChatMessages
            messages={messages}
            loading={loading}
            onEdit={onEditMessage}
            onReprocess={onReprocess}
            plan={plan}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C084FC] via-[#9D75FF] to-[#DBC5FF] blur-xl opacity-60" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#DBC5FF] via-[#9D75FF] to-[#C084FC] shadow-2xl" />
          </div>
          <p className="text-sm text-gray-500 mb-1">
            {greeting()}, {firstName}
          </p>
          <h1 className="text-xl font-bold text-black text-center px-4">
            {t("dash.mobileHeadline")}
          </h1>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-2">
        <div className="w-full bg-[#F9F9F9] rounded-2xl border border-gray-200 p-3">
          {attachedFile && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-white rounded-lg w-fit">
              <Paperclip className="w-3 h-3 text-gray-500 shrink-0" />
              <span className="text-xs text-gray-700 truncate max-w-[180px]">{attachedFile.name}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={t("dash.placeholder")}
            rows={1}
            className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!msg.trim() && !attachedFile}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  msg || attachedFile ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-400 px-4">
          {t("dash.disclaimer")}
        </p>
      </div>

      <MobileSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={() => { onNewConversation(); closeSidebar(); }}
        onSelectConversation={(id) => { onSelectConversation(id); closeSidebar(); }}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        onTogglePin={onTogglePin}
        onToggleSelect={onToggleSelect}
      />
    </div>
  );
}
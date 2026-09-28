import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import PlusMenu from "@/components/ayzen/chat/PlusMenu";
import ToolsPanel from "@/components/ayzen/chat/ToolsPanel";
import ConnectorsPanel from "@/components/ayzen/chat/ConnectorsPanel";
import { CONNECTORS } from "@/components/ayzen/settings/connectorsData";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

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
  onMoveToFolder, onRemoveFromFolder,
  onEditMessage, onReprocess,
  imagining,
  tempMode, setTempMode,
  setModel,
  useWebSearch, setUseWebSearch,
  saveMemories, setSaveMemories,
  useMemories, setUseMemories,
  reasoning, setReasoning,
  activeConnectorIds, onToggleConnector,
  balanceRefreshKey,
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false);
  const [connectorsPanelOpen, setConnectorsPanelOpen] = useState(false);
  const fileInputRef = useRef(null);
  const plusRef = useRef(null);
  const navigate = useNavigate();
  const { listening, toggle: toggleMic } = useSpeechRecognition({ msg, setMsg });

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
      setPlusMenuOpen(false);
      setToolsPanelOpen(false);
      setConnectorsPanelOpen(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (plusRef.current && !plusRef.current.contains(e.target)) {
        setPlusMenuOpen(false);
        setToolsPanelOpen(false);
        setConnectorsPanelOpen(false);
      }
    }
    if (plusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [plusMenuOpen]);

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
        <div className="flex items-center gap-2">
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
                placement="bottom"
                onSelect={(id) => { setModel(id); setModelOpen(false); }}
                onClose={() => setModelOpen(false)}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTempMode(v => !v)}
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatMessages
            messages={messages}
            loading={loading}
            imagining={imagining}
            onEdit={onEditMessage}
            onReprocess={onReprocess}
            plan={plan}
            model={model}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            className="relative w-20 h-20 mb-6"
            animate={{
              scale: [1, 1.08, 0.96, 1.05, 1],
              rotate: [0, 6, -4, 3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6d3c3f358_ChatGPTImage17desetde202619_47_55.png"
              alt="Zyntra"
              className="relative w-20 h-20 object-contain drop-shadow-2xl"
            />
          </motion.div>
          {tempMode ? (
            <>
              <h1 className="text-xl font-bold text-black text-center mb-2">
                {t("dash.tempTitle")}
              </h1>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {t("dash.tempDesc")}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-1">
                {greeting()}, {firstName}
              </p>
              <h1 className="text-xl font-bold text-black text-center px-4">
                {t("dash.headline")}
              </h1>
            </>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-2">
        <div className="w-full bg-[#F9F9F9] rounded-2xl border border-gray-200 p-3">
          {activeConnectorIds && activeConnectorIds.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {activeConnectorIds.map((id) => {
                const meta = CONNECTORS.find((c) => c.id === id);
                if (!meta) return null;
                return (
                  <span key={id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white text-[11px] font-medium text-gray-700">
                    <img src={meta.logo} alt="" className="w-3 h-3 object-contain rounded-full" />
                    {meta.name}
                  </span>
                );
              })}
            </div>
          )}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (msg.trim() || attachedFile) handleSend();
              }
            }}
            placeholder={t("dash.placeholder")}
            rows={1}
            className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <div className="flex items-center justify-between mt-2">
            <div ref={plusRef} className="relative">
              <button
                onClick={() => {
                  setPlusMenuOpen(v => !v);
                  setToolsPanelOpen(false);
                  setConnectorsPanelOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center text-black"
              >
                <Plus className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {plusMenuOpen && !toolsPanelOpen && !connectorsPanelOpen && (
                  <PlusMenu
                    onOpenTools={() => setToolsPanelOpen(true)}
                    onOpenConnectors={() => setConnectorsPanelOpen(true)}
                    onAttachFile={() => fileInputRef.current?.click()}
                  />
                )}
                {plusMenuOpen && toolsPanelOpen && (
                  <ToolsPanel
                    onBack={() => setToolsPanelOpen(false)}
                    useWebSearch={useWebSearch}
                    setUseWebSearch={setUseWebSearch}
                    saveMemories={saveMemories}
                    setSaveMemories={setSaveMemories}
                    useMemories={useMemories}
                    setUseMemories={setUseMemories}
                    reasoning={reasoning}
                    setReasoning={setReasoning}
                  />
                )}
                {plusMenuOpen && connectorsPanelOpen && (
                  <ConnectorsPanel
                    onBack={() => setConnectorsPanelOpen(false)}
                    activeIds={activeConnectorIds}
                    onToggleConnector={onToggleConnector}
                    onConnectApps={() => {
                      setPlusMenuOpen(false);
                      setConnectorsPanelOpen(false);
                      navigate("/settings", { state: { section: "connectors" } });
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                  listening ? "bg-red-500 text-white" : "bg-[#F2F2F2] text-black"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!msg.trim() && !attachedFile}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F2F2] text-black transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
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
        onMoveToFolder={onMoveToFolder}
        onRemoveFromFolder={onRemoveFromFolder}
        balanceRefreshKey={balanceRefreshKey}
      />
    </div>
  );
}
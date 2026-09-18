import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Plus,
  ChevronDown,
  Mic,
  VenetianMask,
  X,
  Paperclip,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import MobileDashboard from "@/components/ayzen/MobileDashboard";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import ModelSelector, { getModelInfo } from "@/components/ayzen/ModelSelector";
import ArrowUpIcon from "@/components/ayzen/ArrowUpIcon";
import PlusMenu from "@/components/ayzen/chat/PlusMenu";
import ToolsPanel from "@/components/ayzen/chat/ToolsPanel";
import ConnectorsPanel from "@/components/ayzen/chat/ConnectorsPanel";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const firstName = (user?.full_name || user?.email || "você").split(" ")[0];
  const [msg, setMsg] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState("auto");
  const [tempMode, setTempMode] = useState(false);
  const navigate = useNavigate();
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false);
  const [connectorsPanelOpen, setConnectorsPanelOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const plusRef = useRef(null);
  const fileInputRef = useRef(null);
  const plan = user?.plan || "free";

  const [greetingText, setGreetingText] = useState("");
  useEffect(() => {
    function updateGreeting() {
      const h = new Date().getHours();
      if (h < 12) setGreetingText(t("dash.greetingMorning"));
      else if (h < 18) setGreetingText(t("dash.greetingAfternoon"));
      else setGreetingText(t("dash.greetingNight"));
    }
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [t]);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setPlusMenuOpen(false);
      setToolsPanelOpen(false);
      setConnectorsPanelOpen(false);
    }
  };

  return (
    <>
    <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pr-2 gap-2">
      <DashboardSidebar activePage="dashboard" />

      {/* Main */}
      <main className="flex-1 flex flex-col relative bg-white rounded-2xl overflow-hidden">
        {/* top bar */}
        <div className="h-9 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E57C2]" />
            <span className="font-medium">{t("dash.topBar")}</span>
            <span className="text-[#7E57C2] font-medium">{t("dash.weekChange")}</span>
            <span className="text-gray-400">›</span>
          </div>
          <div className="relative group">
            <button
              onClick={() => setTempMode((v) => !v)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                tempMode ? "bg-[#F3EEFF] text-[#7E57C2]" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <VenetianMask className="w-4 h-4" />
            </button>
            {!tempMode && (
              <div className="absolute right-0 top-full mt-1 px-2.5 py-1.5 bg-white rounded-lg shadow-lg border border-gray-100 text-xs font-medium text-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {t("dash.tempTooltip")}
              </div>
            )}
          </div>
        </div>

        {/* center stage */}
        <div className="flex-1 flex flex-col items-center justify-end px-6 pb-24 -mt-6">
          {tempMode ? (
            <>
              <motion.div
                className="relative w-20 h-20 mb-5"
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
              <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-2">
                {t("dash.tempTitle")}
              </h1>
              <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                {t("dash.tempDesc")}
              </p>
            </>
          ) : (
            <>
              <motion.div
                className="relative w-20 h-20 mb-5"
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
              <p className="text-xs text-gray-500 mb-1">
                {greetingText}, {firstName}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-6">
                {t("dash.headline")}
              </h1>
            </>
          )}

          {/* input */}
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-4">
            {attachedFile && (
              <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-gray-50 rounded-lg w-fit">
                <Paperclip className="w-3 h-3 text-gray-500 shrink-0" />
                <span className="text-xs text-gray-700 truncate max-w-[200px]">{attachedFile.name}</span>
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
              rows={2}
              className="w-full resize-none text-sm text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="flex items-center justify-between mt-1.5">
              <div className="relative flex items-center gap-2">
                <div ref={plusRef} className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.txt,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => {
                      setPlusMenuOpen((v) => !v);
                      setToolsPanelOpen(false);
                      setConnectorsPanelOpen(false);
                    }}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      plusMenuOpen ? "bg-gray-100 text-gray-600" : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
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
                      <ToolsPanel onBack={() => setToolsPanelOpen(false)} />
                    )}
                    {plusMenuOpen && connectorsPanelOpen && (
                      <ConnectorsPanel
                        onBack={() => setConnectorsPanelOpen(false)}
                        onConnectApps={() => {
                          setPlusMenuOpen(false);
                          setConnectorsPanelOpen(false);
                          navigate("/settings", { state: { section: "connectors" } });
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setModelOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-gray-100 text-xs font-medium text-gray-700 transition-colors"
                  >
                    <img src={getModelInfo(model, plan).logo} alt={getModelInfo(model, plan).name} className="w-4 h-4 rounded object-contain" />
                    {getModelInfo(model, plan).name}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {modelOpen && (
                      <ModelSelector
                        selected={model}
                        plan={plan}
                        onSelect={(id) => {
                          setModel(id);
                          setModelOpen(false);
                        }}
                        onClose={() => setModelOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    msg ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <p className="absolute bottom-12 left-0 right-0 text-center text-[11px] text-gray-400 max-w-xl mx-auto px-6 whitespace-nowrap -translate-x-8">
          {t("dash.disclaimer")}
        </p>
      </main>
    </div>
    <MobileDashboard />
    </>
  );
}
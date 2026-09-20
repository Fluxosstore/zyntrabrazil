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
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileDashboard from "@/components/ayzen/MobileDashboard";
import ModelSelector, { getModelInfo, IMAGE_MODELS } from "@/components/ayzen/ModelSelector";
import ArrowUpIcon from "@/components/ayzen/ArrowUpIcon";
import PlusMenu from "@/components/ayzen/chat/PlusMenu";
import ToolsPanel from "@/components/ayzen/chat/ToolsPanel";
import ConnectorsPanel from "@/components/ayzen/chat/ConnectorsPanel";
import ChatMessages from "@/components/ayzen/chat/ChatMessages";
import { isImageGenerationIntent, messagesToPrompt } from "@/lib/chatUtils";
import { getConversationTitle } from "@/lib/conversationUtils";
import { base44 } from "@/api/base44Client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

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
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("zyntra_conversations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagining, setImagining] = useState(false);
  const { listening, toggle: toggleMic } = useSpeechRecognition({ msg, setMsg });

  useEffect(() => {
    try {
      localStorage.setItem("zyntra_conversations", JSON.stringify(conversations));
    } catch (err) {
      console.error("Erro ao salvar conversas:", err);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      const editData = localStorage.getItem("zyntra_edit_image");
      if (editData) {
        const { url, prompt, model } = JSON.parse(editData);
        localStorage.removeItem("zyntra_edit_image");
        setReferenceImage(url);
        setModel("gpt-image");
        const convId = `conv_${Date.now()}`;
        setConversations(prev => [{ id: convId, title: "Editar imagem", messages: [], pinned: false, selected: false, created_date: new Date().toISOString() }, ...prev]);
        setActiveConversationId(convId);
        setMessages([{
          role: "assistant",
          content: "Aqui está a imagem selecionada para edição. Descreva as modificações que deseja:",
          image: url,
          model: { name: model || "Zyntra Auto", logo: getModelInfo("auto").logo },
        }]);
      }
    } catch (err) {
      console.error("Erro ao carregar imagem para edição:", err);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      setConversations(prev => prev.map(c =>
        c.id === activeConversationId ? { ...c, messages } : c
      ));
    }
  }, [messages, activeConversationId]);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [saveMemories, setSaveMemories] = useState(false);
  const [useMemories, setUseMemories] = useState(false);
  const [reasoning, setReasoning] = useState(50);
  const [referenceImage, setReferenceImage] = useState(null);
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

  const handleSend = async () => {
    if (!msg.trim() && !attachedFile) return;

    let fileUrl = null;
    let fileContent = null;

    // Processa arquivo anexado
    if (attachedFile) {
      try {
        if (attachedFile.type?.startsWith("image/")) {
          // Imagens: faz upload para obter URL pública (storage, não consome créditos de IA)
          const uploadResult = await base44.integrations.Core.UploadPublicFile({
            file: attachedFile,
          });
          fileUrl = uploadResult.file_url;
          fileContent = { type: "image", content: fileUrl };
        } else {
          // Textos/PDFs: lê o conteúdo diretamente no navegador (sem gastar créditos de IA)
          const text = await attachedFile.text();
          fileContent = { type: "text", content: text };
        }
      } catch (err) {
        console.error("Erro ao processar arquivo:", err);
      }
    }

    // Constrói a mensagem do usuário
    let userMessage = { role: "user", content: msg };
    let fileUrlsForLLM = [];

    if (fileContent) {
      if (fileContent.type === "image") {
        fileUrlsForLLM = [fileContent.content];
        userMessage = { role: "user", content: msg || "O que há nesta imagem?" };
      } else {
        userMessage = {
          role: "user",
          content: `${msg}\n\n[Arquivo anexado: ${attachedFile.name}]\n\n${fileContent.content}`,
        };
      }
    }

    const isImageRequest = isImageGenerationIntent(msg) || IMAGE_MODELS.some((m) => m.id === model);
    const newMessages = [...messages, userMessage];

    if (!activeConversationId) {
      const convId = `conv_${Date.now()}`;
      const title = getConversationTitle(msg || userMessage.content);
      setConversations(prev => [{ id: convId, title, messages: [], pinned: false, selected: false, created_date: new Date().toISOString() }, ...prev]);
      setActiveConversationId(convId);
    }

    setMessages(newMessages);
    setMsg("");
    setAttachedFile(null);
    setLoading(true);
    if (isImageRequest) setImagining(true);

    try {
      if (isImageRequest) {
        const modelInfo = getModelInfo(model, plan);
        const imageStyleByModel = {
          "gpt-image": "estilo fotorrealista cinematográfico, iluminação dramática, alta qualidade",
          "gemini-image": "estilo vibrante e colorido, composição dinâmica, detalhes nítidos",
          "claude-image": "estilo artístico refinado, equilíbrio harmônico, estética elegante",
        };
        const styleHint = imageStyleByModel[model] || "";
        const enhancedPrompt = styleHint ? `${msg}. ${styleHint}` : msg;
        const result = await base44.functions.invoke("openrouterImage", {
          prompt: enhancedPrompt,
          model,
          referenceImage: referenceImage || undefined,
        });
        const imageUrl = result.data?.url;
        if (!imageUrl) throw new Error("Nenhuma imagem retornada");
        base44.entities.TokenUsage.create({ tokens: 500, model: modelInfo.name }).catch(() => {});
        // Salva na biblioteca
        base44.entities.LibraryItem.create({
          title: msg.length > 40 ? msg.slice(0, 40) + "..." : msg,
          type: "image",
          url: imageUrl,
          model: modelInfo.name,
          prompt: msg,
        }).catch(() => {});
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Aqui está a imagem gerada:",
            image: imageUrl,
            model: { name: modelInfo.name, logo: modelInfo.logo },
          },
        ]);
        setReferenceImage(null);
      } else {
        const prompt = messagesToPrompt(newMessages);
        const result = await base44.functions.invoke("openrouterChat", {
          prompt,
          model,
          useWebSearch,
          reasoning,
          saveMemories,
          useMemories,
        });
        const _respText = result.data?.content || "";
        base44.entities.TokenUsage.create({ tokens: Math.ceil((prompt.length + _respText.length) / 4), model: getModelInfo(model, plan).name }).catch(() => {});
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: _respText || "Sem resposta",
            model: { name: getModelInfo(model, plan).name, logo: getModelInfo(model, plan).logo },
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Erro: ${err.message || "Falha na requisição"}`,
          model: { name: getModelInfo(model, plan).name, logo: getModelInfo(model, plan).logo },
        },
      ]);
    } finally {
      setLoading(false);
      setImagining(false);
    }
  };

  const handleEditMessage = (text, index) => {
    setMessages((prev) => prev.slice(0, index));
    setMsg(text);
  };

  const handleReprocess = async (text, modelId, index) => {
    const baseMessages = messages.slice(0, index + 1);
    setMessages(baseMessages);
    setLoading(true);
    try {
      const prompt = messagesToPrompt(baseMessages);
      const result = await base44.functions.invoke("openrouterChat", {
        prompt,
        model: modelId,
        useWebSearch: false,
        reasoning,
        saveMemories: false,
        useMemories,
      });
      const _respText = result.data?.content || "";
      base44.entities.TokenUsage.create({ tokens: Math.ceil((prompt.length + _respText.length) / 4), model: getModelInfo(modelId, plan).name }).catch(() => {});
      setMessages([
        ...baseMessages,
        {
          role: "assistant",
          content: _respText || "Sem resposta",
          model: { name: getModelInfo(modelId, plan).name, logo: getModelInfo(modelId, plan).logo },
        },
      ]);
    } catch (err) {
      setMessages([
        ...baseMessages,
        {
          role: "assistant",
          content: `Erro: ${err.message || "Falha na requisição"}`,
          model: { name: getModelInfo(modelId, plan).name, logo: getModelInfo(modelId, plan).logo },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleSelectConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConversationId(convId);
      setMessages(conv.messages || []);
    }
  };

  const handleDeleteConversation = (convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConversationId === convId) {
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const handleRenameConversation = (convId, newTitle) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitle } : c));
  };

  const handleTogglePin = (convId) => {
    setConversations(prev => {
      const updated = prev.map(c => c.id === convId ? { ...c, pinned: !c.pinned } : c);
      return [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    });
  };

  const handleToggleSelect = (convId) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, selected: !c.selected } : c));
  };

  return (
    <>
    <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pr-2 gap-2">
      <DashboardSidebar
        activePage="dashboard"
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onTogglePin={handleTogglePin}
        onToggleSelect={handleToggleSelect}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col relative bg-white rounded-2xl overflow-hidden">
        {/* top bar */}
        <div className="h-9 flex items-center justify-between px-5 border-b border-gray-100">
          <button
            onClick={() => navigate("/ranking")}
            className="flex items-center gap-2 text-xs text-gray-500 hover:opacity-80 transition-opacity"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7E57C2]" />
            <span className="font-medium">{t("dash.topBar")}</span>
            <span className="text-[#7E57C2] font-medium">{t("dash.weekChange")}</span>
            <span className="text-gray-400">›</span>
          </button>
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {messages.length === 0 && (
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
          </div>
          )}
          {messages.length > 0 && (
            <div className="w-full flex-1 flex flex-col min-h-0">
              <ChatMessages
                messages={messages}
                loading={loading}
                imagining={imagining}
                onEdit={handleEditMessage}
                onReprocess={handleReprocess}
                plan={plan}
                model={model}
              />
            </div>
          )}

          {/* input */}
          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-4 mb-6">
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (msg.trim() || attachedFile) handleSend();
                }
              }}
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
                <button
                  onClick={toggleMic}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    listening ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!msg.trim() && !attachedFile}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    msg || attachedFile ? "bg-[#1D1D1F] text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <p className="text-center text-[11px] text-gray-400 mb-6 px-6">
          {t("dash.disclaimer")}
        </p>
      </main>
    </div>
    <MobileDashboard
      msg={msg}
      setMsg={setMsg}
      handleSend={handleSend}
      messages={messages}
      loading={loading}
      model={model}
      plan={plan}
      attachedFile={attachedFile}
      setAttachedFile={setAttachedFile}
      conversations={conversations}
      activeConversationId={activeConversationId}
      onNewConversation={handleNewConversation}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
      onRenameConversation={handleRenameConversation}
      onTogglePin={handleTogglePin}
      onToggleSelect={handleToggleSelect}
      onEditMessage={handleEditMessage}
      onReprocess={handleReprocess}
      tempMode={tempMode}
      setTempMode={setTempMode}
      setModel={setModel}
      useWebSearch={useWebSearch}
      setUseWebSearch={setUseWebSearch}
      saveMemories={saveMemories}
      setSaveMemories={setSaveMemories}
      useMemories={useMemories}
      setUseMemories={setUseMemories}
      reasoning={reasoning}
      setReasoning={setReasoning}
    />
    </>
  );
}
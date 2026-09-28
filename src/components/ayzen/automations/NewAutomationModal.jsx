import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Plus, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MODELS_BY_PLAN, getModelInfo } from "@/components/ayzen/ModelSelector";

const PURPLE = "#7B5BC8";

export default function NewAutomationModal({ open, onClose, onCreated, prefill }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const plan = user?.plan || "free";
  const models = MODELS_BY_PLAN[plan] || MODELS_BY_PLAN.free;

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("diaria");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [model, setModel] = useState("auto");
  const [webSearch, setWebSearch] = useState(false);
  const [teamOfAis, setTeamOfAis] = useState(false);
  const [notifyOnlyRelevant, setNotifyOnlyRelevant] = useState(false);
  const [deliverTelegram, setDeliverTelegram] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open && prefill) {
      setName(prefill.name || "");
      setInstructions(prefill.instructions || "");
      setFrequency(prefill.frequency || "diaria");
      setHour(prefill.hour ?? 8);
      setMinute(prefill.minute ?? 0);
    }
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const canCreate = name.trim() && instructions.trim() && !saving;

  const handleCreate = async () => {
    if (!canCreate) return;
    setSaving(true);
    try {
      await base44.entities.Automation.create({
        name: name.trim(),
        frequency,
        time_hour: hour,
        time_minute: minute,
        instructions: instructions.trim(),
        model,
        web_search: webSearch,
        team_of_ais: teamOfAis,
        notify_only_relevant: notifyOnlyRelevant,
        deliver_telegram: deliverTelegram,
        active: true,
      });
      toast({ title: "Automação criada com sucesso!" });
      onCreated?.();
      handleClose();
    } catch (err) {
      toast({
        title: "Erro ao criar automação",
        description: err.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setName("");
    setInstructions("");
    setModel("auto");
    setWebSearch(false);
    setTeamOfAis(false);
    setNotifyOnlyRelevant(false);
    setDeliverTelegram(false);
    setOpenDropdown(null);
    onClose();
  };

  const frequencies = [
    { id: "diaria", label: "Diária" },
    { id: "dias_uteis", label: "Dias úteis" },
    { id: "semanal", label: "Semanal" },
    { id: "mensal", label: "Mensal" },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-black">Nova automação</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" ref={dropdownRef}>
              {/* Name */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Briefing matinal"
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7B5BC8]"
              />

              {/* Quando */}
              <div>
                <p className="text-sm font-semibold text-black mb-2">Quando</p>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                  {frequencies.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFrequency(f.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                        frequency === f.id ? "bg-white text-black shadow-sm" : "text-gray-500"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  {/* Hour */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => toggleDropdown("hour")}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-black"
                    >
                      {String(hour).padStart(2, "0")}h
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {openDropdown === "hour" && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                        {hours.map((h) => (
                          <button
                            key={h}
                            onClick={() => { setHour(h); setOpenDropdown(null); }}
                            className={`w-full px-3.5 py-2 text-sm text-left hover:bg-gray-100 ${h === hour ? "text-[#7B5BC8] font-semibold" : "text-black"}`}
                          >
                            {String(h).padStart(2, "0")}h
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Minute */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => toggleDropdown("minute")}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-black"
                    >
                      {String(minute).padStart(2, "0")}min
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {openDropdown === "minute" && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                        {minutes.map((m) => (
                          <button
                            key={m}
                            onClick={() => { setMinute(m); setOpenDropdown(null); }}
                            className={`w-full px-3.5 py-2 text-sm text-left hover:bg-gray-100 ${m === minute ? "text-[#7B5BC8] font-semibold" : "text-black"}`}
                          >
                            {String(m).padStart(2, "0")}min
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Faça */}
              <div>
                <p className="text-sm font-semibold text-black mb-2">Faça</p>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Leia meus e-mails não lidos das últimas 24 horas e resuma em tópicos. Depois busque as principais notícias do meu setor."
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7B5BC8] resize-none"
                />
              </div>

              {/* Escolha a IA */}
              <div>
                <p className="text-sm font-semibold text-black mb-2">Escolha a IA</p>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("model")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-black"
                  >
                    <span className="flex items-center gap-2">
                      <img src={getModelInfo(model, plan).logo} alt="" className="w-4 h-4 rounded object-contain" />
                      {getModelInfo(model, plan).name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {openDropdown === "model" && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                      <button
                        onClick={() => { setModel("auto"); setOpenDropdown(null); }}
                        className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-left hover:bg-gray-100 ${model === "auto" ? "text-[#7B5BC8] font-semibold" : "text-black"}`}
                      >
                        <img src={getModelInfo("auto").logo} alt="" className="w-4 h-4 rounded object-contain" />
                        Vintra Auto
                      </button>
                      {models.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { setModel(m.id); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-left hover:bg-gray-100 ${model === m.id ? "text-[#7B5BC8] font-semibold" : "text-black"}`}
                        >
                          <img src={m.logo} alt="" className="w-4 h-4 rounded object-contain" />
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#7B5BC8]">
                  <Plus className="w-4 h-4" />
                  IA reserva
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black">Busca na web</span>
                  <Switch
                    checked={webSearch}
                    onCheckedChange={setWebSearch}
                    className="data-[state=checked]:bg-[#7B5BC8]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">Executar com o Time de IAs</span>
                    <Switch
                      checked={teamOfAis}
                      onCheckedChange={setTeamOfAis}
                      className="data-[state=checked]:bg-[#7B5BC8]"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Várias IAs do plano trabalham juntas e consomem mais créditos por execução
                  </p>
                </div>
              </div>

              {/* Só me avise se */}
              <div>
                <p className="text-sm font-semibold text-black mb-2">Só me avise se</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Somente quando houver algo relevante</span>
                  <Switch
                    checked={notifyOnlyRelevant}
                    onCheckedChange={setNotifyOnlyRelevant}
                    className="data-[state=checked]:bg-[#7B5BC8]"
                  />
                </div>
              </div>

              {/* Entregue em */}
              <div>
                <p className="text-sm font-semibold text-black mb-2">Entregue em</p>
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-[#2AABEE] flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black">Avisar no Telegram</p>
                    <p className="text-xs text-gray-500 mt-0.5">Receba o resultado direto no seu Telegram</p>
                  </div>
                  <button className="px-4 py-2 rounded-full border border-gray-300 text-xs font-medium text-black shrink-0">
                    Conectar
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  O resultado sempre fica salvo na conversa desta automação.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0 space-y-3 bg-white">
              <p className="text-sm text-gray-500">
                Custo estimado: <span className="font-semibold text-black">Médio</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-black text-sm font-medium active:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!canCreate}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    canCreate
                      ? "bg-[#7B5BC8] text-white active:bg-[#6A4DB8]"
                      : "bg-[#D1C4E9] text-white/70 cursor-not-allowed"
                  }`}
                >
                  {saving ? "Criando..." : "Criar automação"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
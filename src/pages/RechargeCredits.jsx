import React, { useState, useEffect } from "react";
import { ChevronLeft, Check, Lock, Loader2, CreditCard, Grid3x3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import { CREDITS_BY_PLAN } from "@/lib/quotaUtils";
import { CoinStackIcon } from "@/components/ayzen/SettingsIcons";
import PixPaymentModal from "@/components/ayzen/PixPaymentModal";

const CREDIT_RATE = 4000; // créditos por R$ 1

const AMOUNT_OPTIONS = [
{ value: 20, label: "R$ 20,00", credits: 80000 },
{ value: 50, label: "R$ 50,00", credits: 200000 },
{ value: 100, label: "R$ 100,00", credits: 400000 }];


function formatCredits(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function RechargeCredits() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = user?.plan || "free";

  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'pix' | 'cartao' | null
  const [installments, setInstallments] = useState(1);
  const [balance, setBalance] = useState(0);
  const [paying, setPaying] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState(null);
  const [pixModal, setPixModal] = useState({ open: false, data: null });
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const records = await base44.entities.TokenUsage.list("-created_date", 500);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        const monthly = records.
        filter((r) => new Date(r.created_date).getTime() >= monthStart).
        reduce((s, r) => s + (r.tokens || 0), 0);
        const credits = CREDITS_BY_PLAN[plan] || CREDITS_BY_PLAN.free;
        setBalance(Math.max(0, credits.month - monthly));
      } catch (e) {
        setBalance(CREDITS_BY_PLAN[plan]?.month || 0);
      }
    })();
  }, [plan]);

  const amount = isCustom ? Math.max(0, parseFloat(customAmount) || 0) : selectedAmount;
  const credits = Math.round(amount * CREDIT_RATE);

  const installmentOptions = [
  { count: 1, label: "À vista", value: amount },
  { count: 2, label: "2x", value: amount / 2 },
  { count: 3, label: "3x", value: amount / 3 },
  { count: 4, label: "4x", value: amount / 4 },
  { count: 5, label: "5x", value: amount / 5 },
  { count: 6, label: "6x", value: amount / 6 }];


  const canPay = amount > 0 && paymentMethod !== null;

  const handlePay = async () => {
    if (!canPay || paying) return;
    setPaying(true);

    try {
      if (paymentMethod === "pix") {
        const res = await base44.functions.invoke("mercadopagoPayment", {
          planId: "credits",
          cycle: "avulso",
          amount: amount,
          planName: "Créditos avulsos"
        });
        setOrderId(res.order_id);
        setPixModal({
          open: true,
          data: {
            qrCodeBase64: res.qr_code_base64,
            pixCode: res.qr_code,
            amount: formatBRL(amount),
            orderId: res.order_id
          }
        });
        setPaying(false);
      } else if (paymentMethod === "cartao") {
        // Cartão: opens payment page in a new tab
        const checkoutUrl = `https://pay.quickway.tech/checkout?amount=${amount}&credits=${credits}`;
        window.open(checkoutUrl, "_blank");
        setPopupUrl(checkoutUrl);
        setPaymentOpen(true);
        setPaying(false);
      }
    } catch (err) {
      console.error("Erro ao iniciar pagamento:", err);
      setPaying(false);
    }
  };

  const handlePixPaid = () => {
    setPixModal({ open: false, data: null });
    navigate("/settings");
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="settings" />
        <main className="flex-1 flex flex-col bg-[#FAFAFB] rounded-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-10 py-8">
              {/* Back link */}
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
                
                <ChevronLeft className="w-4 h-4" />
                Voltar para a carteira
              </button>

              {/* Title */}
              <h1 className="text-2xl font-bold text-black mb-1">Recarregar créditos</h1>
              <p className="text-sm text-gray-500 mb-6">
                Escolha quanto colocar e como pagar. Os créditos entram assim que o pagamento é confirmado.
              </p>

              {/* Pending recharge alert */}
              <div className="mb-8">
                <div className="w-full rounded-xl px-5 py-3 bg-[hsl(var(--accent))]">
                  <p className="text-sm text-gray-700 text-left">
                    Você tem 1 de 2 recargas aguardando pagamento. No limite, para criar outra, cancele uma delas ou espere vencer.
                  </p>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Quanto colocar */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h2 className="text-base font-bold text-black mb-1">Quanto colocar</h2>
                    <p className="text-xs text-gray-500 mb-4">Escolha um valor ou digite o seu.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {AMOUNT_OPTIONS.map((opt) => {
                        const selected = !isCustom && selectedAmount === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setIsCustom(false);
                              setSelectedAmount(opt.value);
                            }}
                            className={`relative rounded-xl border p-4 text-left transition-all ${
                            selected ?
                            "border-black border-2 bg-white" :
                            "border-gray-200 bg-white hover:border-gray-300"}`
                            }>
                            
                            {selected &&
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            }
                            <p className="text-sm font-bold text-black">{opt.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatCredits(opt.credits)} créditos</p>
                          </button>);

                      })}
                      {/* Outro valor */}
                      <button
                        onClick={() => setIsCustom(true)}
                        className={`relative rounded-xl border p-4 text-left transition-all ${
                        isCustom ?
                        "border-black border-2 bg-white" :
                        "border-gray-200 bg-white hover:border-gray-300"}`
                        }>
                        
                        {isCustom &&
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        }
                        <p className="text-sm font-bold text-black">Outro valor</p>
                        <p className="text-xs text-gray-500 mt-0.5">você escolhe</p>
                      </button>
                    </div>

                    {/* Custom amount input */}
                    {isCustom &&
                    <div className="mt-3">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">R$</span>
                          <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0,00"
                          min="5"
                          autoFocus
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400" />
                        
                        </div>
                        {customAmount && parseFloat(customAmount) > 0 &&
                      <p className="text-xs text-gray-500 mt-2">
                            {formatCredits(credits)} créditos
                          </p>
                      }
                      </div>
                    }
                  </div>

                  {/* Como pagar */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h2 className="text-base font-bold text-black mb-1">Como pagar</h2>
                    <p className="text-xs text-gray-500 mb-4">Escolha o método de pagamento.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pix */}
                      <button
                        onClick={() => {
                          setPaymentMethod("pix");
                          setPaymentOpen(false);
                        }}
                        className={`relative rounded-xl border p-4 flex items-center gap-3 transition-all ${
                        paymentMethod === "pix" ?
                        "border-black border-2 bg-white" :
                        "border-gray-200 bg-white hover:border-gray-300"}`
                        }>
                        
                        {paymentMethod === "pix" &&
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        }
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                          <Grid3x3 className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-black">Pix</p>
                          <p className="text-xs text-gray-500">cai na hora</p>
                        </div>
                      </button>

                      {/* Cartão */}
                      <button
                        onClick={() => {
                          setPaymentMethod("cartao");
                          setInstallments(1);
                        }}
                        className={`relative rounded-xl border p-4 flex items-center gap-3 transition-all ${
                        paymentMethod === "cartao" ?
                        "border-black border-2 bg-white" :
                        "border-gray-200 bg-white hover:border-gray-300"}`
                        }>
                        
                        {paymentMethod === "cartao" &&
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        }
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-black">Cartão</p>
                          <p className="text-xs text-gray-500">parcela em até 6x</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Até quantas parcelas (only when Cartão selected) */}
                  {paymentMethod === "cartao" &&
                  <>
                      <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <h2 className="text-base font-bold text-black mb-1">Até quantas parcelas</h2>
                        <p className="text-xs text-gray-500 mb-4">Divida em até 6x no cartão.</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {installmentOptions.map((opt) => {
                          const selected = installments === opt.count;
                          return (
                            <button
                              key={opt.count}
                              onClick={() => setInstallments(opt.count)}
                              className={`relative rounded-xl border p-3 text-left transition-all ${
                              selected ?
                              "border-black border-2 bg-white" :
                              "border-gray-200 bg-white hover:border-gray-300"}`
                              }>
                              
                                {selected &&
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  </div>
                              }
                                <p className="text-sm font-bold text-black">{opt.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {opt.count === 1 ? formatBRL(opt.value) : `${formatBRL(opt.value)} cada`}
                                </p>
                              </button>);

                        })}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Cada parcela tem no mínimo R$ 5,00.</p>
                      </div>

                      {/* Pagamento em ambiente seguro */}
                      <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-600" />
                            <h3 className="text-sm font-bold text-black">Pagamento em ambiente seguro</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 italic">VISA</span>
                            <span className="text-xs font-bold text-gray-400 italic">mastercard</span>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                            Você digita o cartão em pay.quickway.tech, com conexão segura, e não aqui.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                            A Ayzen não recebe nem guarda os dados do seu cartão.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                            Assim que o pagamento é confirmado, o crédito entra automaticamente.
                          </li>
                        </ul>
                        <p className="text-[11px] text-gray-400 mt-4">
                          Cobrança processada por Quickway. Segundo a Quickway: PCI DSS nível 1 e TLS 1.3.
                        </p>
                      </div>
                    </>
                  }
                </div>

                {/* Right column - Summary */}
                <div className="lg:sticky lg:top-4">
                  <div className="rounded-2xl bg-[#7C5DCF] text-white p-5 flex flex-col">
                    <h2 className="text-base font-bold mb-3">Resumo</h2>
                    <p className="text-3xl font-bold tracking-tight mb-5">{formatBRL(amount)}</p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">Créditos</span>
                        <span className="text-sm font-medium text-white">{formatCredits(credits)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">Validade</span>
                        <span className="text-sm font-medium text-white">12 meses</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">Seu saldo</span>
                        <span className="text-sm font-medium text-white">{formatCredits(balance)}</span>
                      </div>
                    </div>

                    {paymentOpen && paymentMethod === "cartao" ?
                    <div className="rounded-xl bg-white/10 p-4 mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
                            <Loader2 className="w-3 h-3 animate-spin" />
                          </div>
                          <p className="text-sm font-medium text-white">Pagamento aberto em outra aba</p>
                        </div>
                        <p className="text-xs text-white/70 mb-3">
                          Termine o pagamento lá. Avisamos aqui assim que o crédito entrar.
                        </p>
                        <button
                        onClick={() => popupUrl && window.open(popupUrl, "_blank")}
                        className="text-xs text-white underline hover:text-white/80 transition-colors">
                        
                          Abrir a aba de novo
                        </button>
                      </div> :

                    <button
                      onClick={handlePay}
                      disabled={!canPay || paying}
                      className="w-full h-12 rounded-xl bg-white text-[#7C5DCF] text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4">
                      
                        {paying ?
                      <Loader2 className="w-4 h-4 animate-spin" /> :

                      <CoinStackIcon className="w-4 h-4" />
                      }
                        {paying ? "Processando..." : `Pagar ${formatBRL(amount)}`}
                      </button>
                    }

                    <p className="text-[11px] text-white/60 text-center">Nenhuma recarga neste ciclo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden min-h-screen bg-[#F4F4F6] flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => navigate("/settings")}
            className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 active:bg-gray-100 rounded-lg">
            
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-black">Recarregar créditos</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Pending recharge alert */}
          <div className="w-full rounded-full bg-[#e5e7eb] px-4 py-2.5">
            <p className="text-xs text-gray-700 text-left">
              Você tem 1 de 2 recargas aguardando pagamento. No limite, para criar outra, cancele uma delas ou espere vencer.
            </p>
          </div>

          {/* Quanto colocar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-base font-bold text-black mb-1">Quanto colocar</h2>
            <p className="text-xs text-gray-500 mb-3">Escolha um valor ou digite o seu.</p>
            <div className="grid grid-cols-2 gap-2">
              {AMOUNT_OPTIONS.map((opt) => {
                const selected = !isCustom && selectedAmount === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedAmount(opt.value);
                    }}
                    className={`relative rounded-xl border p-3 text-left transition-all ${
                    selected ? "border-black border-2" : "border-gray-200"}`
                    }>
                    
                    {selected &&
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    }
                    <p className="text-sm font-bold text-black">{opt.label}</p>
                    <p className="text-xs text-gray-500">{formatCredits(opt.credits)} créditos</p>
                  </button>);

              })}
              <button
                onClick={() => setIsCustom(true)}
                className={`relative rounded-xl border p-3 text-left transition-all ${
                isCustom ? "border-black border-2" : "border-gray-200"}`
                }>
                
                {isCustom &&
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                }
                <p className="text-sm font-bold text-black">Outro valor</p>
                <p className="text-xs text-gray-500">você escolhe</p>
              </button>
            </div>
            {isCustom &&
            <div className="mt-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">R$</span>
                <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0,00"
                autoFocus
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400" />
              
              </div>
            }
          </div>

          {/* Como pagar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-base font-bold text-black mb-1">Como pagar</h2>
            <p className="text-xs text-gray-500 mb-3">Escolha o método de pagamento.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPaymentMethod("pix");
                  setPaymentOpen(false);
                }}
                className={`relative rounded-xl border p-3 flex items-center gap-2 transition-all ${
                paymentMethod === "pix" ? "border-black border-2" : "border-gray-200"}`
                }>
                
                {paymentMethod === "pix" &&
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                }
                <Grid3x3 className="w-5 h-5 text-gray-700 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Pix</p>
                  <p className="text-[11px] text-gray-500">cai na hora</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setPaymentMethod("cartao");
                  setInstallments(1);
                }}
                className={`relative rounded-xl border p-3 flex items-center gap-2 transition-all ${
                paymentMethod === "cartao" ? "border-black border-2" : "border-gray-200"}`
                }>
                
                {paymentMethod === "cartao" &&
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                }
                <CreditCard className="w-5 h-5 text-gray-700 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Cartão</p>
                  <p className="text-[11px] text-gray-500">parcela em até 6x</p>
                </div>
              </button>
            </div>
          </div>

          {/* Parcelas (mobile) */}
          {paymentMethod === "cartao" &&
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <h2 className="text-base font-bold text-black mb-1">Até quantas parcelas</h2>
              <p className="text-xs text-gray-500 mb-3">Divida em até 6x no cartão.</p>
              <div className="grid grid-cols-3 gap-2">
                {installmentOptions.map((opt) => {
                const selected = installments === opt.count;
                return (
                  <button
                    key={opt.count}
                    onClick={() => setInstallments(opt.count)}
                    className={`relative rounded-xl border p-2 text-left transition-all ${
                    selected ? "border-black border-2" : "border-gray-200"}`
                    }>
                    
                      {selected &&
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-black flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" strokeWidth={3} />
                        </div>
                    }
                      <p className="text-xs font-bold text-black">{opt.label}</p>
                      <p className="text-[10px] text-gray-500">
                        {opt.count === 1 ? formatBRL(opt.value) : `${formatBRL(opt.value)} cada`}
                      </p>
                    </button>);

              })}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Cada parcela tem no mínimo R$ 5,00.</p>
            </div>
          }

          {/* Summary (mobile) */}
          <div className="rounded-2xl bg-[#7C5DCF] text-white p-4">
            <h2 className="text-base font-bold mb-2">Resumo</h2>
            <p className="text-2xl font-bold tracking-tight mb-4">{formatBRL(amount)}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Créditos</span>
                <span className="text-sm font-medium text-white">{formatCredits(credits)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Validade</span>
                <span className="text-sm font-medium text-white">12 meses</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Seu saldo</span>
                <span className="text-sm font-medium text-white">{formatCredits(balance)}</span>
              </div>
            </div>
            {paymentOpen && paymentMethod === "cartao" ?
            <div className="rounded-xl bg-white/10 p-3 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm font-medium text-white">Pagamento aberto em outra aba</p>
                </div>
                <p className="text-xs text-white/70 mb-2">Termine o pagamento lá. Avisamos aqui assim que o crédito entrar.</p>
                <button
                onClick={() => popupUrl && window.open(popupUrl, "_blank")}
                className="text-xs text-white underline">
                
                  Abrir a aba de novo
                </button>
              </div> :

            <button
              onClick={handlePay}
              disabled={!canPay || paying}
              className="w-full h-11 rounded-xl bg-white text-[#7C5DCF] text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 mb-3">
              
                {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {paying ? "Processando..." : `Pagar ${formatBRL(amount)}`}
              </button>
            }
            <p className="text-[11px] text-white/60 text-center">Nenhuma recarga neste ciclo</p>
          </div>
        </div>
      </div>

      {/* PIX Modal */}
      {pixModal.open && pixModal.data &&
      <PixPaymentModal
        open={true}
        onClose={() => setPixModal({ open: false, data: null })}
        qrCodeBase64={pixModal.data.qrCodeBase64}
        pixCode={pixModal.data.pixCode}
        planName="Créditos avulsos"
        amount={pixModal.data.amount}
        orderId={pixModal.data.orderId}
        onPaid={handlePixPaid} />

      }
    </>);

}
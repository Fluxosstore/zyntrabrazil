import React, { useState, useEffect } from "react";
import { ShieldCheck, Fingerprint, Lock, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { isWebAuthnSupported, createPasskey, detectDeviceName } from "@/lib/webauthnUtils";

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatLastAccess(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}., ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

export default function AccountContent() {
  const { user } = useAuth();
  const [passkeys, setPasskeys] = useState([]);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyAdding, setPasskeyAdding] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    loadPasskeys();
  }, []);

  const loadPasskeys = async () => {
    setPasskeyLoading(true);
    try {
      const res = await base44.functions.invoke("passkeyAuth", { action: "list" });
      const data = res.data || res;
      setPasskeys(data.passkeys || []);
    } catch (e) {} finally {
      setPasskeyLoading(false);
    }
  };

  const handleAddPasskeyClick = () => {
    if (!isWebAuthnSupported()) {
      alert("Seu dispositivo não suporta passkeys.");
      return;
    }
    setPwdInput("");
    setPwdError("");
    setShowPwdModal(true);
  };

  const handleAddPasskey = async () => {
    if (!pwdInput) {
      setPwdError("Digite sua senha para confirmar.");
      return;
    }
    setShowPwdModal(false);
    setPasskeyAdding(true);
    try {
      const startRes = await base44.functions.invoke("passkeyAuth", { action: "startRegistration" });
      const startData = startRes.data || startRes;
      const rpId = window.location.hostname;
      const credential = await createPasskey({
        challenge: startData.challenge,
        rpId,
        rpName: "Zyntra",
        userId: startData.userId,
        userEmail: startData.userEmail
      });
      await base44.functions.invoke("passkeyAuth", {
        action: "finishRegistration",
        credentialId: credential.credentialId,
        publicKey: credential.publicKey,
        algorithm: credential.algorithm,
        challenge: startData.challenge,
        challengeSignature: startData.challengeSignature,
        deviceName: detectDeviceName(),
        password: pwdInput
      });
      setPwdInput("");
      await loadPasskeys();
    } catch (e) {
      if (e.name !== "NotAllowedError") {
        alert("Não foi possível cadastrar a passkey.");
      }
    } finally {
      setPasskeyAdding(false);
    }
  };

  const handleDeletePasskey = async (id) => {
    try {
      await base44.functions.invoke("passkeyAuth", { action: "delete", id });
      await loadPasskeys();
    } catch (e) {}
  };

  const has2FA = false;
  const hasPasskey = passkeys.length > 0;
  const activeLayers = (has2FA ? 1 : 0) + (hasPasskey ? 1 : 0);
  const totalLayers = 2;
  const layerPct = activeLayers / totalLayers * 100;
  const isWeak = activeLayers < 2;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-10 py-5 md:py-8 space-y-5 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Segurança</h1>
          <p className="text-sm text-gray-500 mt-1">Proteja o acesso à sua conta com verificação em duas etapas e passkeys.</p>
        </div>

        <div className="border-t border-gray-200 hidden" />

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
          {/* Left: Proteção da conta */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-black">Proteção da conta</h2>
                <p className="text-xs text-gray-500 mt-0.5">{activeLayers} de {totalLayers} camadas ativas</p>
              </div>
              {isWeak &&
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FCE4E4] text-[11px] font-medium text-[#D9534F]">
                  Fraca
                </span>
              }
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${layerPct}%`, backgroundColor: isWeak ? "#F1A4A0" : "#22C55E" }} />
              
            </div>

            {/* Items */}
            <div className="space-y-3">
              {/* 2FA */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#FCE4E4] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#D9534F]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-black">Autenticação em duas etapas</p>
                      <span className="text-[11px] font-medium text-[#D9534F]">Inativa</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Peça um código do app autenticador a cada login.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#7a52d5] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors shrink-0">
                  Ativar
                </button>
              </div>

              {/* Passkeys */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FCE4E4] flex items-center justify-center shrink-0">
                      <Fingerprint className="w-5 h-5 text-[#D9534F]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-black">Passkeys</p>
                        <span className="text-[11px] font-medium text-[#D9534F]">{hasPasskey ? "Ativa" : "Inativa"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Entre sem senha usando a biometria do seu dispositivo (digital, FaceID, Windows Hello).</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddPasskeyClick}
                    disabled={passkeyAdding}
                    className="px-4 py-2 rounded-xl bg-[#7a52d5] text-white text-sm font-medium hover:bg-[#6b4bd0] transition-colors shrink-0 disabled:opacity-50">
                    
                    {passkeyAdding ? "Cadastrando..." : "Adicionar passkey"}
                  </button>
                </div>

                {/* Passkey list */}
                {passkeyLoading ?
                <div className="mt-4 flex items-center justify-center py-3">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                  </div> :
                passkeys.length > 0 ?
                <div className="mt-4 space-y-2">
                    {passkeys.map((pk) =>
                  <div key={pk.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                            <Fingerprint className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-black truncate">{pk.device_name || "Dispositivo"}</p>
                            <p className="text-[10px] text-gray-400">Cadastrada em {new Date(pk.created_date).toLocaleDateString("pt-BR")}</p>
                          </div>
                        </div>
                        <button
                      onClick={() => handleDeletePasskey(pk.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      
                          Remover
                        </button>
                      </div>
                  )}
                  </div> :
                null}
              </div>
            </div>
          </div>

          {/* Right: Acesso */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
            <h2 className="text-base font-bold text-black mb-4">Acesso</h2>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 mb-1">E-MAIL DE LOGIN</p>
                <p className="text-sm text-black truncate">{user?.email || "—"}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 mb-1">ÚLTIMO ACESSO</p>
                <p className="text-sm text-black">{formatLastAccess(user?.updated_date || user?.created_date)}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 mb-1">FORMAS DE ENTRAR</p>
                <p className="text-sm text-black">Senha{hasPasskey ? " • Passkey" : ""}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Admin panel link */}
        {user?.role === "admin" &&
        <section>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-black">Painel de Administração</p>
                <p className="text-xs text-gray-500 mt-0.5">Gerencie pedidos, usuários, cupons e configurações</p>
              </div>
              <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black transition-colors shrink-0">
              
                Acessar painel
              </Link>
            </div>
          </section>
        }
      </div>

      {/* Password modal for passkey confirmation */}
      {showPwdModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPwdModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-violet-600" />
                </div>
                <h3 className="text-sm font-bold text-black">Confirmar senha</h3>
              </div>
              <button onClick={() => setShowPwdModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Digite sua senha para vincular a passkey. Ela será usada para entrar automaticamente com biometria.
            </p>
            <input
            type="password"
            value={pwdInput}
            onChange={(e) => {setPwdInput(e.target.value);setPwdError("");}}
            onKeyDown={(e) => {if (e.key === "Enter") handleAddPasskey();}}
            autoFocus
            placeholder="Sua senha"
            className="w-full h-10 px-3 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors" />
          
            {pwdError && <p className="mt-2 text-xs text-red-500">{pwdError}</p>}
            <button
            onClick={handleAddPasskey}
            className="w-full mt-4 h-10 rounded-lg bg-[#1D1D1F] text-white text-sm font-semibold hover:bg-black transition-colors">
            
              Confirmar e cadastrar
            </button>
          </div>
        </div>
      }
    </div>);

}
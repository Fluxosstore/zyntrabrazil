import React, { useState, useEffect } from "react";
import { Shield, Key, Plus, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";
import { base44 } from "@/api/base44Client";
import { isWebAuthnSupported, createPasskey, detectDeviceName } from "@/lib/webauthnUtils";

const MONTHS = {
  pt: ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  es: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
};

function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const months = MONTHS[lang] || MONTHS.pt;
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function AccountContent() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const plan = user?.plan || "free";
  const planLabel = PLAN_LABELS[plan] || PLAN_LABELS.free;
  const memberSince = user?.created_date ? formatDate(user.created_date, lang) : "—";
  const [passkeys, setPasskeys] = useState([]);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyAdding, setPasskeyAdding] = useState(false);

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

  const handleAddPasskey = async () => {
    if (!isWebAuthnSupported()) {
      alert("Seu dispositivo não suporta passkeys.");
      return;
    }
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
        userEmail: startData.userEmail,
      });
      await base44.functions.invoke("passkeyAuth", {
        action: "finishRegistration",
        credentialId: credential.credentialId,
        publicKey: credential.publicKey,
        algorithm: credential.algorithm,
        challenge: startData.challenge,
        challengeSignature: startData.challengeSignature,
        deviceName: detectDeviceName(),
      });
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.account")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.accountSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Perfil */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.profile")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.profileLabel")}</p>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
                <Image
                  src={getAvatarForUser(user?.id)}
                  alt="Profile"
                  className="relative w-14 h-14 object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-black">
                    {user?.full_name || (user?.email || "—").split("@")[0]}
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#2e7d32] text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                    {t("settings.activeBadge")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{t("settings.dataLinked")}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.emailLabel")}
                </p>
                <p className="text-sm text-black mt-1 truncate">{user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.memberSinceLabel")}
                </p>
                <p className="text-sm text-black mt-1">{memberSince}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                  {t("settings.planLabelShort")}
                </p>
                <p className="text-sm text-black mt-1">{planLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section>
          <h2 className="text-base font-bold text-black mb-1">{t("settings.security")}</h2>
          <p className="text-xs text-gray-500 mb-3">{t("settings.securityLabel")}</p>

          <div className="space-y-3">
            {/* Autenticação em duas etapas */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-black">{t("settings.twoFactor")}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {t("settings.twoFactorStatus")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{t("settings.twoFactorDesc")}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 transition-colors shrink-0">
                {t("settings.activate")}
              </button>
            </div>

            {/* Passkeys */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{t("settings.passkeys")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("settings.passkeysDesc")}</p>
                </div>
              </div>

              {passkeyLoading ? (
                <div className="mt-5 flex items-center justify-center py-3">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                </div>
              ) : passkeys.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-5">{t("settings.noPasskey")}</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {passkeys.map((pk) => (
                    <div key={pk.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                          <Key className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-black truncate">{pk.device_name || "Dispositivo"}</p>
                          <p className="text-[10px] text-gray-400">Cadastrada em {new Date(pk.created_date).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePasskey(pk.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <button
                  onClick={handleAddPasskey}
                  disabled={passkeyAdding}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-black hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {passkeyAdding ? (
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {passkeyAdding ? "Cadastrando..." : t("settings.addPasskey")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Painel de Administração - apenas admin */}
        {user?.role === "admin" && (
          <section>
            <h2 className="text-base font-bold text-black mb-1">Administração</h2>
            <p className="text-xs text-gray-500 mb-3">Acesso restrito ao painel de gerenciamento</p>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">Painel de Administração</p>
                  <p className="text-xs text-gray-500 mt-0.5">Gerencie pedidos, usuários, cupons e configurações</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black transition-colors shrink-0"
              >
                Acessar painel
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { Shield, Key, Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { getAvatarForUser } from "@/lib/avatars";
import { PLAN_LABELS } from "@/components/ayzen/ModelSelector";

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

              <p className="text-xs text-gray-400 text-center mt-5">{t("settings.noPasskey")}</p>

              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-black hover:bg-gray-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  {t("settings.addPasskey")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
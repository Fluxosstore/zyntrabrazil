import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Monitor,
  Settings,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";
import Flag from "@/components/ayzen/Flag";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";
import { getAvatarForUser } from "@/lib/avatars";

const THEMES = [
  { code: "light", icon: Sun, label: "Claro" },
  { code: "dark", icon: Moon, label: "Escuro" },
  { code: "system", icon: Monitor, label: "Sistema" },
];

const LANGS = [
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
];

export default function UserPopover({ user, firstName, planLabel, onLogout, onClose, collapsed }) {
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme] = useState("light");
  const ref = useRef(null);

  const langLabel = LANGS.find((l) => l.code === lang)?.label || "Português";

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`absolute bottom-0 left-0 ${collapsed ? "w-60" : "right-0"} bg-white rounded-2xl shadow-xl shadow-black/15 border border-gray-100 overflow-hidden z-50`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7E57C2] to-[#EC4899] opacity-30 blur-[3px]" />
          <Image
            src={getAvatarForUser(user?.id)}
            alt="Profile"
            className="relative w-9 h-9 object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-black truncate">
            {user?.full_name || firstName}
          </p>
          <span className="inline-block mt-0.5 text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {planLabel}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Preferences */}
      <div className="px-3.5 py-3 space-y-3">
        <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          {t("dash.popoverPreferences")}
        </p>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-black">{t("dash.popoverTheme")}</p>
            <p className="text-[10px] text-gray-400">
              {THEMES.find((th) => th.code === theme)?.label}
            </p>
          </div>
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
            {THEMES.map((th) => {
              const Icon = th.icon;
              const active = theme === th.code;
              return (
                <button
                  key={th.code}
                  onClick={() => setTheme(th.code)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    active
                      ? "bg-[#7E57C2] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-black">{t("dash.popoverLanguage")}</p>
            <p className="text-[10px] text-gray-400">{langLabel}</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
            {LANGS.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    active
                      ? "bg-white ring-1 ring-[#7E57C2]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Flag code={l.code} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Account */}
      <div className="px-3.5 py-3 space-y-1">
        <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
          {t("dash.popoverAccount")}
        </p>
        <button className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-gray-50 text-left">
          <Settings className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-medium text-black">
            {t("dash.popoverSettings")}
          </span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-gray-50 text-left">
          <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-medium text-black">
            {t("dash.popoverRanking")}
          </span>
          <span className="ml-auto text-[9px] font-bold text-[#16a34a] bg-[#dcfce7] rounded-full px-1.5 py-0.5">
            {t("dash.popoverNew")}
          </span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-gray-50 text-left">
          <Bell className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-medium text-black">
            {t("dash.popoverNews")}
          </span>
        </button>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Footer */}
      <div className="px-3.5 py-2.5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg hover:bg-red-50 text-left"
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
          <span className="text-xs font-medium text-red-600">
            {t("dash.popoverLogout")}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
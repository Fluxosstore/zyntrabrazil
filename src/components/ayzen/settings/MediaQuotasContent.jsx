import React from "react";
import { Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const GPT = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/698f8c822_chatgpt.svg";
const GEMINI = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/c545d8735_gemini.svg";

const MEDIA_ITEMS = [
  { id: "gpt-audio", name: "GPT Audio", catKey: "settings.mediaAudios", limit: 80, logo: GPT, status: "limited" },
  { id: "gemini-flash-image", name: "Gemini Flash Image", catKey: "settings.mediaImages", limit: 100, logo: GEMINI, status: "limited" },
  { id: "whisper", name: "Whisper Large v3", catKey: "settings.mediaTranscriptions", limit: 15, logo: GPT, status: "limited" },
  { id: "nano-banana", name: "Nano Banana", catKey: "settings.mediaImages", limit: 0, logo: GEMINI, status: "notincluded" },
  { id: "elevenlabs", name: "Voz ElevenLabs", catKey: "settings.mediaAudios", limit: 0, logo: null, status: "unlimited" },
  { id: "empty", name: "", catKey: "", limit: 0, logo: null, status: "empty" }
];

export default function MediaQuotasContent({ plan }) {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="text-base font-bold text-black mb-1">{t("settings.mediaQuotas")}</h2>
      <p className="text-xs text-gray-500 mb-3">{t("settings.mediaQuotasDesc")}</p>
      <div className="grid grid-cols-2 gap-4">
        {MEDIA_ITEMS.map((item) => {
          if (item.status === "empty") {
            return <div key={item.id} className="rounded-2xl border border-gray-200 bg-gray-50/60" />;
          }

          const consumed = 0;
          const pctVal = item.limit > 0 ? Math.min(100, Math.round((consumed / item.limit) * 100)) : 0;

          return (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black leading-tight">{item.name}</p>
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400">{t(item.catKey)}</p>
                  </div>
                </div>
                {item.status === "limited" && (
                  <span className="text-[10px] text-gray-400 shrink-0">● {pctVal}%</span>
                )}
              </div>

              {item.status === "limited" && (
                <>
                  <p className="text-lg font-bold text-black">{consumed} / {item.limit}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: `${pctVal}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">{t("settings.mediaRenews")}</p>
                </>
              )}

              {item.status === "notincluded" && (
                <p className="text-sm text-gray-400 mt-1">{t("settings.mediaNotIncluded")}</p>
              )}

              {item.status === "unlimited" && (
                <>
                  <p className="text-lg font-bold text-black">{t("settings.mediaUnlimited")}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{t("settings.mediaGenerated", { n: 0 })}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
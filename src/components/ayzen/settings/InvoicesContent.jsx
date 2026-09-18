import React from "react";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function InvoicesContent() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 py-8 space-y-8">
        <div>
          <p className="text-xs text-gray-400">{t("settings.title")}</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{t("settings.invoices")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("settings.invoicesSubtitle")}</p>
        </div>

        <div className="border-t border-gray-200" />

        <div className="rounded-2xl border border-gray-200 bg-[#fafafa] flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center mb-3">
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-base font-bold text-black">{t("settings.noInvoices")}</p>
          <p className="text-sm text-gray-500 mt-1">{t("settings.noInvoicesDesc")}</p>
        </div>
      </div>
    </div>
  );
}
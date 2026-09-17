import React from "react";
import { Calendar, Mail, Users, ListTodo, HardDrive } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function IntegrationsSection() {
  const { t } = useLanguage();
  const integrations = [
    { icon: Calendar, name: t("integrations.int1Name"), desc: t("integrations.int1Desc") },
    { icon: Mail, name: t("integrations.int2Name"), desc: t("integrations.int2Desc") },
    { icon: Users, name: t("integrations.int3Name"), desc: t("integrations.int3Desc") },
    { icon: ListTodo, name: t("integrations.int4Name"), desc: t("integrations.int4Desc") },
    { icon: HardDrive, name: t("integrations.int5Name"), desc: t("integrations.int5Desc") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#8878c3] uppercase">
            {t("integrations.badge")}
          </span>
          <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
            <span className="text-gray-900">{t("integrations.title")}</span>
            <br />
            <span className="text-[#7b61ff]">{t("integrations.titleHighlight")}</span>
          </h2>
          <p className="mt-5 text-sm text-[#666666] leading-relaxed">
            {t("integrations.desc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {integrations.map((it) => (
            <div
              key={it.name}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 group-hover:bg-violet-600 flex items-center justify-center mb-4 transition-colors">
                <it.icon className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {it.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm text-[#555555] leading-relaxed">
            {t("integrations.footer")}
          </p>
          <a
            href="#"
            className="inline-block mt-3 text-sm font-medium text-[#7E57C2] hover:underline"
          >
            {t("integrations.readPrivacy")}
          </a>
        </div>
      </div>
    </section>
  );
}
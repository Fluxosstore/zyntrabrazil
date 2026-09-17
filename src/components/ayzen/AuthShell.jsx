import React, { useState, useRef, useEffect } from "react";
import { Sun, ChevronDown, Check } from "lucide-react";
import Flag from "@/components/ayzen/Flag";

const LANGS = [
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
];

const HERO_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3d455afee_ChatGPTImage17desetde202601_13_21.png";

export default function AuthShell({ children }) {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("PT");
  const langRef = useRef(null);
  const current = LANGS.find((l) => l.code === lang);

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left hero */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* right-edge fade so the image melts into the white panel */}
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/60 to-transparent" />
        <div className="relative flex flex-col justify-end p-12 z-10">
          <p className="text-xs font-medium tracking-[0.2em] text-white/80 uppercase mb-3">
            Plataforma de IA Conversacional
          </p>
          <h2 className="text-3xl font-bold text-white leading-tight mb-3 max-w-md">
            Todas as IAs, uma só conversa.
          </h2>
          <p className="text-sm text-white/80 max-w-md leading-relaxed">
            Acesse os modelos mais avançados em um único lugar, com seu
            histórico sempre à mão.
          </p>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 relative flex flex-col">
        {/* top-right controls */}
        <div className="absolute top-6 right-8 flex items-center gap-3 z-10">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 bg-[#F2F2F2] rounded-full pl-2 pr-2.5 py-1.5 text-sm font-medium text-black"
            >
              <Flag code={current.code} />
              <span className="text-xs font-medium text-black">{current.code}</span>
              <ChevronDown className="w-3 h-3 text-black" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-1 overflow-hidden">
                {LANGS.map((l) => {
                  const active = l.code === lang;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={`mx-1 flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                        active ? "bg-[#EBEDF4] text-black" : "text-[#333] hover:bg-[#EBEDF4]"
                      }`}
                    >
                      <Flag code={l.code} />
                      <span className="flex-1">{l.label}</span>
                      {active && <Check className="w-4 h-4 text-[#7E57C2]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#4A4A4A] hover:bg-gray-100 transition-colors">
            <Sun className="w-4 h-4" />
          </button>
        </div>

        {/* centered content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* bottom-right copyright */}
        <div className="px-8 py-6 text-right">
          <p className="text-xs text-[#555]">© 2026 Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Sun } from "lucide-react";

const HERO_IMG =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/3d455afee_ChatGPTImage17desetde202601_13_21.png";

export default function AuthShell({ children }) {
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
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <span className="text-base">🇧🇷</span> PT
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <Sun className="w-4 h-4" />
          </button>
        </div>

        {/* centered content */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
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
import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Search,
  SquarePen,
  Images,
  Plug,
  Megaphone,
  MapPin,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Image } from "@/components/ui/image";

const NAV_ITEMS = [
  { icon: SquarePen, label: "Novo chat", action: "new" },
  { icon: Images, label: "Imagens", to: "/register" },
  { icon: Plug, label: "Plugins", to: "/register" },
  { icon: Megaphone, label: "Pesquisa aprofundada", to: "/register" },
  { icon: MapPin, label: "Mapas", to: "/register", badge: "NOVO" },
];

const UTILITY_ITEMS = [
  { icon: Sparkles, label: "Confira planos e preços", to: "/register", trailing: ExternalLink },
  { icon: Settings, label: "Configurações", to: "/register" },
  { icon: HelpCircle, label: "Ajuda", to: "/register", trailing: ChevronRight },
];

export default function PublicChatSidebar({ open, onClose, onNewChat }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white flex flex-col rounded-r-2xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Image
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/057474ffd_quality_restoration_20260928203908003.png"
              alt="Zyntra"
              className="w-7 h-7 rounded-lg"
              fittingType="fit"
            />
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="flex-1 text-sm font-medium text-black">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </>
            );
            const cls =
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors";
            return item.action === "new" ? (
              <button key={item.label} className={cls} onClick={onNewChat}>
                {content}
              </button>
            ) : (
              <Link key={item.label} to={item.to} className={cls} onClick={onClose}>
                {content}
              </Link>
            );
          })}

          <div className="my-2 mx-3 border-t border-gray-100" />

          {UTILITY_ITEMS.map((item) => {
            const Icon = item.icon;
            const Trailing = item.trailing;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="flex-1 text-sm font-medium text-black">{item.label}</span>
                {Trailing && <Trailing className="w-4 h-4 text-gray-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer auth card */}
        <div className="p-4 border-t border-gray-100">
          <p className="font-semibold text-black text-sm leading-snug">
            Receba respostas personalizadas para você
          </p>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Entre para receber respostas com base em chats salvos, além de criar imagens e carregar arquivos.
          </p>
          <Link
            to="/login"
            onClick={onClose}
            className="mt-3 block text-center py-2.5 rounded-full bg-white border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
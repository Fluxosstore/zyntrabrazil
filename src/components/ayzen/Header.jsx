import React, { useState } from "react";
import { Menu, X, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 pt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo (separate, left) */}
          <a href="#" className="flex items-center gap-2 py-1 z-10">
            <Image
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/589397f87_ChatGPTImage16desetde202623_41_31.png"
              alt="Ayzen"
              className="w-10 h-10 rounded-lg"
              fittingType="fit"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Zyntra
            </span>
          </a>

          {/* Right group: nav pill + theme pill */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Main pill */}
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xl border border-white/60 rounded-full pl-2 pr-2 py-2 shadow-lg shadow-violet-200/30">
              {/* Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                <a
                  href="#ias"
                  className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition-colors"
                >
                  IAs
                </a>
                {[
                  { label: "Benefícios", href: "#beneficios" },
                  { label: "Planos", href: "#planos" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Blog", href: "#blog" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <span className="h-5 w-px bg-gray-200 mx-1 hidden lg:block" />

              <a
                href="#"
                className="hidden lg:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full transition-colors"
              >
                Entrar
              </a>

              <a
                href="#planos"
                className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-violet-600/25"
              >
                Assinar
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </a>

              {/* Mobile toggle */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Theme pill */}
            <div className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-xl border border-white/60 rounded-full px-2 py-2 shadow-lg shadow-violet-200/30">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white transition-colors">
                <Sun className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Moon className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Monitor className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                PT
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-4 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {["IAs", "Benefícios", "Planos", "FAQ", "Blog", "Entrar"].map(
              (label) => (
                <a
                  key={label}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-violet-600 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
import React, { useState, useEffect } from "react";
import { Menu, X, Globe, Moon, Search, Sparkles } from "lucide-react";

const navLinks = [
  { label: "IAs", href: "#ias" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAFA]/85 backdrop-blur-xl border-b border-gray-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Ayzen
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Moon className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Globe className="w-4 h-4" />
          </button>
          <a
            href="#"
            className="hidden md:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors"
          >
            Entrar
          </a>
          <a
            href="#planos"
            className="inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5"
          >
            Assinar
          </a>
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FAFAFA] border-t border-gray-200 px-6 py-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-violet-600"
              >
                {link.label}
              </a>
            ))}
            <a href="#" className="text-base font-medium text-gray-700">
              Entrar
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
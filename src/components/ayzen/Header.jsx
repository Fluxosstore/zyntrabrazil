import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { Image } from "@/components/ui/image";
import LanguageSwitcher from "@/components/ayzen/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

const navLinkDefs = [
  { key: "nav.ias", href: "#ias", id: "ias" },
  { key: "nav.beneficios", href: "#beneficios", id: "beneficios" },
  { key: "nav.planos", href: "#planos", id: "planos" },
  { key: "nav.faq", href: "#faq", id: "faq" },
  { key: "nav.blog", href: "#blog", id: "blog" },
];

export default function Header() {
  const { t } = useLanguage();
  const navLinks = navLinkDefs.map((l) => ({ ...l, label: t(l.key) }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry most in view
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 pt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo (separate, left) */}
          <a href="#" className="flex items-center gap-2 py-1 z-10">
            <Image
              src="https://media.base44.com/images/public/6aab2e6298f803d865228a5d/589397f87_ChatGPTImage16desetde202623_41_31.png"
              alt="Zyntra"
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
                {navLinks.map((l) => {
                  const isActive = activeId === l.id;
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors border ${
                        isActive
                          ? "text-gray-900 bg-gray-100 border-gray-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </nav>

              <span className="h-5 w-px bg-gray-200 mx-1 hidden lg:block" />

              <a
                href="/login"
                className="hidden lg:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full transition-colors"
              >
                {t("header.entrar")}
              </a>

              <a
                href="#planos"
                className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-md shadow-violet-600/25"
              >
                {t("header.assinar")}
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
              <LanguageSwitcher variant="text" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-4 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium px-3 py-2 rounded-lg ${
                  activeId === l.id
                    ? "text-violet-600 bg-gray-50"
                    : "text-gray-700 hover:text-violet-600 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-gray-700 hover:text-violet-600 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {t("header.entrar")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
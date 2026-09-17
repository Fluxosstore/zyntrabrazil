import React, { createContext, useContext, useState, useCallback } from "react";
import { translations } from "@/lib/translations";

const LanguageContext = createContext();

const STORAGE_KEY = "zyntra_lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "PT";
    }
    return "PT";
  });

  const setLang = useCallback((code) => {
    setLangState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang.toLowerCase()] || translations.pt;
      let str = dict[key];
      if (str === undefined) str = translations.pt[key] || key;
      if (vars && typeof str === "string") {
        Object.keys(vars).forEach((v) => {
          str = str.replace(`{${v}}`, vars[v]);
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback so components never crash if used outside provider
    return {
      lang: "PT",
      setLang: () => {},
      t: (key) => key,
    };
  }
  return ctx;
}
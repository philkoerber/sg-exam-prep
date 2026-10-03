"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { messages, type Language } from "@/lib/messages";

const STORAGE_KEY = "sg-language";
const LanguageContext = createContext<{
  language: Language;
  text: typeof messages.ja;
  sessionActive: boolean;
  setLanguage: (language: Language) => void;
  setSessionActive: (active: boolean) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<Language>("ja");
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ja" || saved === "en") {
        // Hydrate the browser preference after the static Japanese HTML mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreference(saved);
      }
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }, []);

  function setLanguage(language: Language) {
    setPreference(language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Keep the selection in memory if persistence is blocked.
    }
  }

  const language = sessionActive ? "ja" : preference;
  return (
    <LanguageContext.Provider
      value={{
        language,
        text: messages[language],
        sessionActive,
        setLanguage,
        setSessionActive,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required.");
  return context;
}

// Sessions temporarily override the interface without changing the saved choice.
// Cleanup also restores it when the user navigates away during a session.
export function useSessionLanguage(active: boolean) {
  const { setSessionActive } = useLanguage();
  useLayoutEffect(() => {
    setSessionActive(active);
    return () => setSessionActive(false);
  }, [active, setSessionActive]);
}

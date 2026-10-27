import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { startGlobalTranslation } from "../utils/domTranslator";

const LanguageContext = createContext(null);

function getInitialLanguage() {
  try {
    return localStorage.getItem("spendly_language") === "bn"
      ? "bn"
      : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem("spendly_language", language);
    } catch (error) {
      console.error("Could not save language preference:", error);
    }
  }, [language]);

  useEffect(() => {
    const stopTranslation = startGlobalTranslation(language);

    return () => {
      if (typeof stopTranslation === "function") {
        stopTranslation();
      }
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
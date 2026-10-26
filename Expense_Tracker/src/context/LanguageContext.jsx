
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { translations } from "../utils/translations";

const LanguageContext = createContext();

const supportedLanguages = Object.keys(
  translations
);

function getInitialLanguage() {
  const savedLanguage =
    localStorage.getItem("spendly_language");

  if (
    savedLanguage &&
    supportedLanguages.includes(savedLanguage)
  ) {
    return savedLanguage;
  }

  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] =
    useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(
      "spendly_language",
      language
    );
  }, [language]);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const currentKey of keys) {
      value = value?.[currentKey];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
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


const CACHE_KEY = "spendly_translation_cache";
const pendingTranslations = new Map();

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("Could not save translation cache:", error);
  }
}

export async function translateToBangla(text) {
  if (typeof text !== "string" || !text.trim()) {
    return text;
  }

  const originalText = text;
  const normalizedText = text.trim();

  const cache = getCache();

  if (cache[normalizedText]) {
    return cache[normalizedText];
  }

  if (pendingTranslations.has(normalizedText)) {
    return pendingTranslations.get(normalizedText);
  }

  const request = (async () => {
    try {
      // Use a plain URL string, not a Markdown link.
      const url = new URL(
        "https://api.mymemory.translated.net/get"
      );

      url.searchParams.set("q", normalizedText);
      url.searchParams.set("langpair", "en|bn");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translated = data.responseData?.translatedText;

      if (
        data.responseStatus !== 200 ||
        typeof translated !== "string" ||
        !translated.trim()
      ) {
        throw new Error("Translation unavailable");
      }

      // Do not cache failed or unchanged translations.
      if (translated.trim() === normalizedText) {
        return originalText;
      }

      const updatedCache = getCache();
      updatedCache[normalizedText] = translated.trim();
      saveCache(updatedCache);

      return translated.trim();
    } catch (error) {
      console.error("Translation failed:", error);
      return originalText;
    } finally {
      pendingTranslations.delete(normalizedText);
    }
  })();

  pendingTranslations.set(normalizedText, request);

  return request;
}

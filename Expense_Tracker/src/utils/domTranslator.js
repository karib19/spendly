
import { translateToBangla } from "./translate";

const CACHE_KEY = "spendly_translation_cache";

const originalNodes = new WeakMap();
const originalAttributes = new WeakMap();
const translatedNodes = new WeakMap();
const translatedAttributes = new WeakMap();

const ATTRIBUTES_TO_TRANSLATE = [
  "placeholder",
  "title",
  "aria-label",
  "alt",
];

const TEXT_SKIP_SELECTOR = [
  "script",
  "style",
  "noscript",
  "code",
  "pre",
  "textarea",
  "input",
  "[contenteditable='true']",
  ".notranslate",
].join(",");

const ATTRIBUTE_SKIP_SELECTOR = [
  "script",
  "style",
  "noscript",
  "code",
  "pre",
  "[contenteditable='true']",
  ".notranslate",
].join(",");

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function hasEnglishText(text) {
  return /[a-zA-Z]/.test(text);
}

function preserveWhitespace(original, replacement) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";

  return leading + replacement + trailing;
}

function shouldSkipText(element) {
  return Boolean(
    !element || element.closest(TEXT_SKIP_SELECTOR)
  );
}

function shouldSkipAttribute(element) {
  return Boolean(
    !element || element.closest(ATTRIBUTE_SKIP_SELECTOR)
  );
}

function getOriginalAttributeMap(element) {
  let map = originalAttributes.get(element);

  if (!map) {
    map = new Map();
    originalAttributes.set(element, map);
  }

  return map;
}

function getTranslatedAttributeMap(element) {
  let map = translatedAttributes.get(element);

  if (!map) {
    map = new Map();
    translatedAttributes.set(element, map);
  }

  return map;
}

function rememberOriginalNode(node, original) {
  if (!originalNodes.has(node)) {
    originalNodes.set(node, original);
  }
}

function rememberOriginalAttribute(element, attribute, original) {
  const map = getOriginalAttributeMap(element);

  if (!map.has(attribute)) {
    map.set(attribute, original);
  }
}

function getReverseCache() {
  const reverse = new Map();

  for (const [english, bangla] of Object.entries(getCache())) {
    if (english && bangla && english !== bangla) {
      reverse.set(bangla.trim(), english);
    }
  }

  return reverse;
}

function restoreEnglish() {
  if (typeof document === "undefined" || !document.body) {
    return;
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const reverse = getReverseCache();
  let node;

  while ((node = walker.nextNode())) {
    const original = originalNodes.get(node);

    if (original !== undefined) {
      node.nodeValue = original;
      continue;
    }

    // Restore cached translations when the original is unavailable.
    const current = node.nodeValue || "";
    const english = reverse.get(current.trim());

    if (english) {
      node.nodeValue = preserveWhitespace(current, english);
    }
  }

  document
    .querySelectorAll(
      "[placeholder], [title], [aria-label], [alt]"
    )
    .forEach((element) => {
      const saved = originalAttributes.get(element);

      for (const attribute of ATTRIBUTES_TO_TRANSLATE) {
        const original = saved?.get(attribute);

        if (original !== undefined) {
          element.setAttribute(attribute, original);
          continue;
        }

        const current = element.getAttribute(attribute);

        if (!current) continue;

        const english = reverse.get(current.trim());

        if (english) {
          element.setAttribute(
            attribute,
            preserveWhitespace(current, english)
          );
        }
      }
    });

  document.documentElement.lang = "en";
  document.body.classList.remove("translation-ready");
}

export function startGlobalTranslation(language) {
  if (typeof document === "undefined" || !document.body) {
    return () => {};
  }

  if (language !== "bn") {
    restoreEnglish();
    return () => {};
  }

  let stopped = false;
  let processing = false;
  let observer;

  const pending = new Map();

  function queueTranslation(english, target) {
    if (!english || !hasEnglishText(english)) {
      return;
    }

    if (!pending.has(english)) {
      pending.set(english, []);
    }

    pending.get(english).push(target);
  }

  function translateTextNode(node) {
    if (stopped || !node?.isConnected) return;

    const element = node.parentElement;

    if (shouldSkipText(element)) return;

    const current = node.nodeValue || "";
    const trimmed = current.trim();

    if (!trimmed || !hasEnglishText(trimmed)) return;

    const record = translatedNodes.get(node);

    // Ignore the text we translated ourselves.
    if (record?.bangla === trimmed) return;

    // React may have reused a node for different text.
    if (record && record.bangla !== trimmed) {
      translatedNodes.delete(node);
      originalNodes.delete(node);
    }

    rememberOriginalNode(node, current);

    const cachedTranslation = getCache()[trimmed];

    if (cachedTranslation && cachedTranslation !== trimmed) {
      translatedNodes.set(node, {
        english: trimmed,
        bangla: cachedTranslation,
      });

      node.nodeValue = preserveWhitespace(
        current,
        cachedTranslation
      );

      return;
    }

    queueTranslation(trimmed, {
      type: "text",
      node,
      english: trimmed,
      original: current,
    });
  }

  function translateAttribute(element, attribute) {
    if (stopped || shouldSkipAttribute(element)) return;

    const current = element.getAttribute(attribute);

    if (!current?.trim() || !hasEnglishText(current)) return;

    const english = current.trim();
    const translatedMap = getTranslatedAttributeMap(element);
    const previous = translatedMap.get(attribute);

    // Ignore the attribute value translated by this utility.
    if (previous?.bangla === english) return;

    if (previous && previous.bangla !== english) {
      translatedMap.delete(attribute);
      getOriginalAttributeMap(element).delete(attribute);
    }

    rememberOriginalAttribute(element, attribute, current);

    const cachedTranslation = getCache()[english];

    if (cachedTranslation && cachedTranslation !== english) {
      translatedMap.set(attribute, {
        english,
        bangla: cachedTranslation,
      });

      element.setAttribute(
        attribute,
        preserveWhitespace(current, cachedTranslation)
      );

      return;
    }

    queueTranslation(english, {
      type: "attribute",
      element,
      attribute,
      english,
      original: current,
    });
  }

  function scanNode(node) {
    if (stopped || !node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node);
      return;
    }

    if (
      node.nodeType !== Node.ELEMENT_NODE &&
      node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
    ) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (shouldSkipText(node) && shouldSkipAttribute(node)) {
        return;
      }

      for (const attribute of ATTRIBUTES_TO_TRANSLATE) {
        if (node.hasAttribute(attribute)) {
          translateAttribute(node, attribute);
        }
      }
    }

    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT
    );

    let textNode;

    while ((textNode = walker.nextNode())) {
      translateTextNode(textNode);
    }

    // Also handle attributes on descendants.
    if (node.nodeType === Node.ELEMENT_NODE) {
      node
        .querySelectorAll(
          "[placeholder], [title], [aria-label], [alt]"
        )
        .forEach((element) => {
          for (const attribute of ATTRIBUTES_TO_TRANSLATE) {
            if (element.hasAttribute(attribute)) {
              translateAttribute(element, attribute);
            }
          }
        });
    }
  }

  async function processQueue() {
    if (processing || stopped) return;

    processing = true;

    try {
      while (pending.size > 0 && !stopped) {
        const [english, targets] = pending.entries().next().value;

        pending.delete(english);

        let bangla;

        try {
          bangla = await translateToBangla(english);
        } catch (error) {
          console.error("Global translation failed:", error);
          continue;
        }

        if (stopped || !bangla || bangla === english) {
          continue;
        }

        for (const target of targets) {
          if (stopped) break;

          if (target.type === "text") {
            const { node } = target;

            if (!node?.isConnected) continue;

            const current = node.nodeValue || "";

            // Do not overwrite a newer React-rendered value.
            if (current.trim() !== target.english) continue;

            rememberOriginalNode(node, target.original);

            translatedNodes.set(node, {
              english: target.english,
              bangla,
            });

            node.nodeValue = preserveWhitespace(current, bangla);
          } else {
            const { element, attribute } = target;

            if (!element?.isConnected) continue;

            const current = element.getAttribute(attribute);

            if (current?.trim() !== target.english) continue;

            rememberOriginalAttribute(
              element,
              attribute,
              target.original
            );

            getTranslatedAttributeMap(element).set(attribute, {
              english: target.english,
              bangla,
            });

            element.setAttribute(
              attribute,
              preserveWhitespace(current, bangla)
            );
          }
        }
      }
    } finally {
      processing = false;

      if (pending.size > 0 && !stopped) {
        void processQueue();
      }
    }
  }

  document.documentElement.lang = "bn";
  document.body.classList.add("translation-ready");

  scanNode(document.body);

  observer = new MutationObserver((mutations) => {
    if (stopped) return;

    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        scanNode(mutation.target);
      }

      if (mutation.type === "attributes") {
        scanNode(mutation.target);
      }

      for (const addedNode of mutation.addedNodes || []) {
        scanNode(addedNode);
      }
    }

    void processQueue();
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRIBUTES_TO_TRANSLATE,
  });

  void processQueue();

  return () => {
    stopped = true;
    observer?.disconnect();
    pending.clear();
    document.body.classList.remove("translation-ready");
  };
}

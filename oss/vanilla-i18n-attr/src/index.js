/**
 * @module vanilla-i18n-attr
 * A lightweight, zero-dependency internationalization helper for vanilla JS apps.
 * Translates DOM nodes marked with `data-i18n` and attributes declared via `data-i18n-attr`.
 */

/**
 * @typedef {Record<string, any>} Dictionary
 * @typedef {Record<string, string | number>} TemplateVars
 * @typedef {Object} I18nOptions
 * @property {string} [locale] - Explicit initial locale to activate.
 * @property {string|string[]} [fallbackLocale] - Locale(s) to fall back to when a key is missing.
 * @property {string} [basePath] - Base directory for locale JSON files.
 * @property {string} [storageKey] - localStorage key used to persist the active locale.
 * @property {string[]} [rtlLocales] - Locales that should switch the page direction to RTL.
 * @property {boolean} [noThrow] - When true (default) missing keys are ignored.
 * @property {(url: string) => Promise<Dictionary>} [fetcher] - Custom locale loader.
 * @property {(locale: string) => void} [onLocaleChange] - Hook invoked after a locale change.
 */

const DEFAULT_OPTIONS = {
  basePath: './locales',
  storageKey: 'i18n:locale',
  fallbackLocale: ['en'],
  rtlLocales: ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'ks', 'ku', 'ps', 'ur', 'yi'],
  noThrow: true,
};

const state = {
  /** @type {I18nOptions} */
  options: { ...DEFAULT_OPTIONS },
  /** @type {Map<string, Dictionary>} */
  dictionaries: new Map(),
  /** @type {string|null} */
  locale: null,
  /** @type {boolean} */
  initialized: false,
  /** @type {number} */
  requestId: 0,
};

/** @type {Set<Element>} */
const textNodes = new Set();
/** @type {Set<Element>} */
const attrNodes = new Set();
/** @type {WeakMap<Element, { raw: string, pairs: Array<{attr: string, key: string}> }>} */
const attrCache = new WeakMap();
/** @type {WeakMap<Element, string>} */
const originalTexts = new WeakMap();
/** @type {WeakMap<Element, Map<string, string|null>>} */
const originalAttrs = new WeakMap();

let pendingDir = null;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getFallbackArray() {
  const { fallbackLocale } = state.options;
  if (Array.isArray(fallbackLocale)) {
    return fallbackLocale.filter(Boolean);
  }
  if (typeof fallbackLocale === 'string' && fallbackLocale.trim()) {
    return [fallbackLocale];
  }
  return ['en'];
}

function normaliseBasePath(path) {
  if (!path) return './locales';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function computeLocaleChain(locale) {
  const chain = [];
  const addUnique = (loc) => {
    if (loc && !chain.includes(loc)) {
      chain.push(loc);
    }
  };
  addUnique(locale);
  if (locale && locale.includes('-')) {
    const simple = locale.split('-')[0];
    addUnique(simple);
  }
  for (const fallback of getFallbackArray()) {
    addUnique(fallback);
    if (fallback.includes('-')) {
      addUnique(fallback.split('-')[0]);
    }
  }
  addUnique('en');
  return chain;
}

function deepGet(dict, keyPath) {
  if (!dict) return undefined;
  const segments = keyPath.split('.');
  let current = dict;
  for (const segment of segments) {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

function formatValue(value, vars) {
  if (value == null) return value;
  if (!vars || typeof value !== 'string') {
    return value;
  }
  return value.replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(vars, name) ? `${vars[name]}` : match;
  });
}

async function defaultFetch(url) {
  if (!isBrowser()) {
    throw new Error('Locale loading is only supported in browser environments without a custom fetcher.');
  }
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    const error = new Error(`Failed to load locale from ${url} (status ${response.status})`);
    // @ts-ignore augment error
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function persistLocale(locale) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(state.options.storageKey || DEFAULT_OPTIONS.storageKey, locale);
  } catch (error) {
    if (!state.options.noThrow) {
      throw error;
    }
  }
}

function readPersistedLocale() {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(state.options.storageKey || DEFAULT_OPTIONS.storageKey);
  } catch (error) {
    return null;
  }
}

function applyDirection(locale) {
  if (!isBrowser()) return;
  const { rtlLocales = DEFAULT_OPTIONS.rtlLocales } = state.options;
  const isRtl = !!rtlLocales && rtlLocales.includes(locale);
  const apply = () => {
    const doc = document.documentElement;
    if (doc) {
      doc.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    }
    if (document.body) {
      document.body.dataset.dir = isRtl ? 'rtl' : 'ltr';
    }
  };

  if (document.readyState === 'loading') {
    pendingDir = apply;
  } else {
    apply();
  }
}

if (isBrowser()) {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof pendingDir === 'function') {
      pendingDir();
      pendingDir = null;
    }
  });
}

function rememberOriginals(element) {
  if (element.dataset.i18n && !originalTexts.has(element)) {
    originalTexts.set(element, element.textContent || '');
  }
  if (element.dataset.i18nAttr) {
    const pairs = parseAttrPairs(element);
    if (!originalAttrs.has(element)) {
      const map = new Map();
      for (const { attr } of pairs) {
        map.set(attr, element.getAttribute(attr));
      }
      originalAttrs.set(element, map);
    } else {
      const map = originalAttrs.get(element);
      for (const { attr } of pairs) {
        if (!map.has(attr)) {
          map.set(attr, element.getAttribute(attr));
        }
      }
    }
  }
}

function registerElement(element) {
  if (!(element instanceof Element)) return;
  let added = false;
  if (element.hasAttribute('data-i18n') && !textNodes.has(element)) {
    textNodes.add(element);
    added = true;
  }
  if (element.hasAttribute('data-i18n-attr') && !attrNodes.has(element)) {
    attrNodes.add(element);
    added = true;
  }
  if (added) {
    rememberOriginals(element);
  }
}

function registerTree(root) {
  if (!isBrowser() || !root) {
    return { newText: [], newAttr: [] };
  }
  const newText = [];
  const newAttr = [];
  const process = (element) => {
    if (!(element instanceof Element)) return;
    const hadText = textNodes.has(element);
    const hadAttr = attrNodes.has(element);
    registerElement(element);
    if (element.hasAttribute('data-i18n') && !hadText) {
      newText.push(element);
    }
    if (element.hasAttribute('data-i18n-attr') && !hadAttr) {
      newAttr.push(element);
    }
  };

  if (root instanceof Document) {
    process(root.documentElement);
    root.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(process);
  } else if (root instanceof Element || root instanceof DocumentFragment) {
    process(root);
    root.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(process);
  }

  return { newText, newAttr };
}

function parseAttrPairs(element) {
  if (!(element instanceof Element)) return [];
  const raw = element.getAttribute('data-i18n-attr') || '';
  const cached = attrCache.get(element);
  if (cached && cached.raw === raw) {
    return cached.pairs;
  }
  const pairs = raw
    .split(',')
    .map((chunk) => {
      const [attr, key] = chunk.split(':');
      if (!attr || !key) return null;
      const trimmedAttr = attr.trim();
      const trimmedKey = key.trim();
      if (!trimmedAttr || !trimmedKey) return null;
      return { attr: trimmedAttr, key: trimmedKey };
    })
    .filter(Boolean);
  attrCache.set(element, { raw, pairs });
  return pairs;
}

function resolveTranslation(key, vars, localeChain) {
  const chain = localeChain || computeLocaleChain(state.locale);
  for (const locale of chain) {
    const dict = state.dictionaries.get(locale);
    if (!dict) continue;
    const raw = deepGet(dict, key);
    if (raw !== undefined && raw !== null) {
      return formatValue(raw, vars);
    }
  }
  if (state.options.noThrow === false) {
    throw new Error(`Missing i18n key "${key}" for locale chain: ${chain.join(' -> ')}`);
  }
  return undefined;
}

function translateText(elements) {
  const targets = elements || Array.from(textNodes);
  for (const element of targets) {
    const key = element.getAttribute('data-i18n');
    if (!key) continue;
    try {
      const value = resolveTranslation(key);
      if (value !== undefined) {
        element.textContent = typeof value === 'string' || typeof value === 'number' ? `${value}` : String(value);
      } else if (originalTexts.has(element)) {
        element.textContent = originalTexts.get(element) || '';
      }
    } catch (error) {
      if (state.options.noThrow === false) {
        throw error;
      }
    }
  }
}

function translateAttributes(elements) {
  const targets = elements || Array.from(attrNodes);
  for (const element of targets) {
    const pairs = parseAttrPairs(element);
    if (!pairs.length) continue;
    const originals = originalAttrs.get(element) || new Map();
    for (const { attr, key } of pairs) {
      if (!key) continue;
      try {
        const value = resolveTranslation(key);
        if (value !== undefined) {
          element.setAttribute(attr, `${value}`);
        } else if (originals.has(attr)) {
          const original = originals.get(attr);
          if (original === null || original === undefined) {
            element.removeAttribute(attr);
          } else {
            element.setAttribute(attr, original);
          }
        }
      } catch (error) {
        if (state.options.noThrow === false) {
          throw error;
        }
      }
    }
  }
}

function translateAll(elements) {
  translateText(elements && elements.newText ? elements.newText : undefined);
  translateAttributes(elements && elements.newAttr ? elements.newAttr : undefined);
}

async function ensureLocaleData(locale) {
  if (!locale || state.dictionaries.has(locale)) {
    return state.dictionaries.get(locale);
  }
  return loadLocale(locale);
}

/**
 * Loads a locale dictionary into the cache. When `dictionary` is omitted, the loader will
 * fetch from `[basePath]/<locale>.json`.
 *
 * @param {string} locale - Locale identifier (e.g. "en" or "zh-CN").
 * @param {Dictionary} [dictionary] - Optional dictionary to register.
 * @returns {Promise<Dictionary>} Loaded dictionary.
 */
export async function loadLocale(locale, dictionary) {
  if (!locale) {
    throw new Error('Locale name is required to load translations.');
  }
  if (dictionary) {
    state.dictionaries.set(locale, dictionary);
    return dictionary;
  }
  const basePath = normaliseBasePath(state.options.basePath || DEFAULT_OPTIONS.basePath);
  const url = `${basePath}/${locale}.json`;
  const fetcher = state.options.fetcher || defaultFetch;
  try {
    const data = await fetcher(url);
    if (data && typeof data === 'object') {
      state.dictionaries.set(locale, data);
      return data;
    }
    state.dictionaries.set(locale, {});
    return {};
  } catch (error) {
    // @ts-ignore
    const status = error && error.status;
    if (status === 404 || state.options.noThrow !== false) {
      state.dictionaries.set(locale, {});
      if (state.options.noThrow !== false && typeof console !== 'undefined') {
        console.warn?.(`vanilla-i18n-attr: missing locale file for "${locale}" at ${url}.`);
      }
      return {};
    }
    throw error;
  }
}

/**
 * Applies translations to the registered DOM. Call this after adding new nodes with `data-i18n`
 * or `data-i18n-attr` to translate them immediately.
 *
 * @param {Document|Element|DocumentFragment} [root=document]
 */
export function translateDOM(root = isBrowser() ? document : undefined) {
  if (!isBrowser() || !root) return;
  const registered = registerTree(root);
  translateAll({
    newAttr: registered.newAttr,
    newText: registered.newText,
  });
}

/**
 * Returns the active locale.
 *
 * @returns {string|null}
 */
export function getLocale() {
  return state.locale;
}

/**
 * Looks up a translation for a given key using the active locale fallbacks.
 *
 * @param {string} key - Identifier for the translation key (dot-notation supported).
 * @param {TemplateVars} [vars] - Optional template variables for string interpolation.
 * @returns {string}
 */
export function t(key, vars) {
  if (!key) {
    throw new Error('Translation key is required.');
  }
  const value = resolveTranslation(key, vars);
  if (value === undefined) {
    return key;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }
  return String(value);
}

/**
 * Sets and activates a new locale. Dictionaries are loaded on-demand from the configured base path.
 *
 * @param {string} locale
 * @returns {Promise<string>} Resolves with the active locale once translations have been applied.
 */
export async function setLocale(locale) {
  if (!locale) {
    throw new Error('Locale name is required to change locale.');
  }
  const requestId = ++state.requestId;
  if (isBrowser() && !state.initialized) {
    registerTree(document);
    state.initialized = true;
  }
  const chain = computeLocaleChain(locale);
  for (const loc of chain) {
    await ensureLocaleData(loc);
  }
  if (requestId !== state.requestId) {
    return state.locale || locale;
  }

  state.locale = locale;
  applyDirection(locale);
  if (isBrowser()) {
    translateAll();
    persistLocale(locale);
  }
  if (typeof state.options.onLocaleChange === 'function') {
    state.options.onLocaleChange(locale);
  }
  return locale;
}

function determineInitialLocale(userLocale) {
  if (userLocale) return userLocale;
  const persisted = readPersistedLocale();
  if (persisted) return persisted;
  if (isBrowser() && window.navigator?.language) {
    return window.navigator.language;
  }
  const fallbacks = getFallbackArray();
  if (fallbacks.length) return fallbacks[0];
  return 'en';
}

/**
 * Initializes the i18n system with the provided options. Automatically detects the starting locale,
 * loads dictionaries, and translates the DOM on first run.
 *
 * @param {I18nOptions} [options]
 * @returns {Promise<string>} Resolves with the active locale.
 */
export async function initI18n(options = {}) {
  state.options = { ...DEFAULT_OPTIONS, ...options };
  state.options.basePath = normaliseBasePath(state.options.basePath || DEFAULT_OPTIONS.basePath);
  if (state.options.fallbackLocale == null) {
    state.options.fallbackLocale = DEFAULT_OPTIONS.fallbackLocale;
  }
  const initialLocale = determineInitialLocale(state.options.locale);
  return setLocale(initialLocale);
}

// Auto register nodes if script executes after DOM is ready without explicit init.
if (isBrowser()) {
  registerTree(document);
}

export default {
  initI18n,
  setLocale,
  getLocale,
  t,
  loadLocale,
  translateDOM,
};

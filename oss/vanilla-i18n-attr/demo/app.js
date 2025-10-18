import {
  initI18n,
  setLocale,
  getLocale,
  translateDOM,
  t,
  loadLocale,
} from '../src/index.js';

const RTL_LOCALES = ['ar', 'fa', 'he', 'ur'];
const RTL_SAMPLE = 'ar';

async function main() {
  const localeButtons = Array.from(document.querySelectorAll('[data-locale]'));
  const nameInput = /** @type {HTMLInputElement|null} */ (document.getElementById('name-input'));
  const greetingOutput = document.querySelector('[data-demo="greeting"]');
  const spawnButton = document.querySelector('[data-demo="spawn"]');
  const spawnZone = document.querySelector('[data-demo="zone"]');
  const copyButton = document.querySelector('[data-action="copy-email"]');
  const copyStatus = document.querySelector('[data-demo="copy-status"]');

  let rtlDictionaryLoaded = false;
  let copyTimer = null;

  await initI18n({
    fallbackLocale: ['en'],
    basePath: '../locales',
    rtlLocales: RTL_LOCALES,
    storageKey: 'vanilla-i18n-attr:demo-locale',
    onLocaleChange(locale) {
      document.documentElement.lang = locale;
      updateActiveButtons(localeButtons, locale);
      refreshGreeting();
      if (copyStatus) {
        copyStatus.textContent = '';
      }
    },
  });

  document.documentElement.lang = getLocale() || 'en';
  updateActiveButtons(localeButtons, getLocale());
  refreshGreeting();

  localeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetLocale = button.dataset.locale;
      if (!targetLocale || targetLocale === getLocale()) {
        return;
      }
      if (targetLocale === RTL_SAMPLE && !rtlDictionaryLoaded) {
        await loadLocale(RTL_SAMPLE, {
          app: {
            name: 'vanilla-i18n-attr',
            description: 'ترجمة بدون تبعيات لواجهات HTML',
          },
          demo: {
            hero: {
              heading: 'التبديل بين اللغات فوراً',
              subheading: 'تذكر تفضيلات اللغة وحافظ على العناصر الدلالية.'
            },
            actions: {
              switch_en: 'English',
              switch_zh: '中文',
              switch_ar: 'RTL preview'
            }
          },
          messages: {
            greet: 'مرحباً، {name}!',
            copy_success: 'تم نسخ البريد الإلكتروني!',
            copy_error: 'فشل النسخ',
            clipboard_unavailable: 'الحافظة غير متاحة'
          }
        });
        rtlDictionaryLoaded = true;
      }
      await setLocale(targetLocale);
    });
  });

  nameInput?.addEventListener('input', refreshGreeting);

  spawnButton?.addEventListener('click', () => {
    const card = document.createElement('div');
    card.className = 'spawn-card';
    card.innerHTML = `
      <h4 data-i18n="demo.attributes.title"></h4>
      <p data-i18n="demo.attributes.description"></p>
      <input type="text" data-i18n-attr="placeholder:forms.placeholder" autocomplete="off" />
    `;
    spawnZone?.append(card);
    translateDOM(card);
  });

  copyButton?.addEventListener('click', async () => {
    if (!copyStatus) return;
    const email = 'hello@vanilla-i18n-attr.dev';
    if (!navigator.clipboard) {
      copyStatus.textContent = t('messages.clipboard_unavailable');
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = t('messages.copy_success');
      if (copyTimer) {
        clearTimeout(copyTimer);
      }
      copyTimer = window.setTimeout(() => {
        copyStatus.textContent = '';
      }, 3200);
    } catch (error) {
      copyStatus.textContent = t('messages.copy_error');
    }
  });

  function refreshGreeting() {
    if (!greetingOutput) return;
    const fallback = getLocale() === 'zh' ? '朋友' : 'friend';
    const value = nameInput?.value?.trim() || fallback;
    greetingOutput.textContent = t('messages.greet', { name: value });
  }
}

function updateActiveButtons(buttons, currentLocale) {
  buttons.forEach((button) => {
    button.dataset.active = button.dataset.locale === currentLocale ? 'true' : 'false';
  });
}

main().catch((error) => {
  console.error('Failed to bootstrap vanilla-i18n-attr demo', error);
});

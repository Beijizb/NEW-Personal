(function () {
  const doc = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle = document.getElementById('langToggle');
  const year = document.getElementById('year');
  const typewriter = document.getElementById('typewriter');
  const copyEmail = document.getElementById('copyEmail');

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') doc.dataset.theme = saved;
  } catch (_) {}

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
      doc.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (_) {}
    });
  }

  // i18n
  const translations = {
    en: {
      'a11y.skip': 'Skip to content',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.posts': 'Posts',
      'nav.links': 'Links',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm <span class=\"accent\">Geek</span>",
      'hero.subtitle': 'Write code, love open-source, explore performance and security.',
      'cta.viewProjects': 'View Projects',
      'cta.contactMe': 'Contact Me',
      'about.title': 'About',
      'about.desc': 'Full‑stack developer who loves low‑level implementation and engineering efficiency. Focused on web performance, observability, and DX.',
      'projects.title': 'Projects',
      'projects.fastview': 'Ultra‑light image preview component with lazy‑load and gestures.',
      'projects.edgeauth': 'Stateless auth middleware powered by edge runtime.',
      'projects.perfkit': 'RUM‑oriented performance collection and visualization toolkit.',
      'projects.repo': 'Repo',
      'posts.title': 'Posts',
      'links.title': 'Useful Links',
      'links.search': 'Search engine',
      'links.github': 'Code hosting',
      'links.so': 'Programming Q&A',
      'links.mdn': 'Web docs',
      'links.chatgpt': 'AI assistant',
      'contact.title': 'Contact',
      'contact.copy': 'Copy email',
      'footer.top': 'Back to top ↑',
    },
    zh: {
      'a11y.skip': '跳到正文',
      'nav.about': '关于',
      'nav.projects': '项目',
      'nav.posts': '文章',
      'nav.links': '常用网站',
      'nav.contact': '联系',
      'hero.title': '你好，我是 <span class="accent">Geek</span>',
      'hero.subtitle': '编写代码，热爱开源，探索性能与安全。',
      'cta.viewProjects': '查看项目',
      'cta.contactMe': '联系我',
      'about.title': '关于',
      'about.desc': '全栈开发者，偏爱底层实现与工程效率。关注 Web 性能、可观测性与开发者体验。',
      'projects.title': '项目',
      'projects.fastview': '极致轻量的图片预览组件，支持懒加载与手势。',
      'projects.edgeauth': '基于边缘计算的零状态鉴权中间件。',
      'projects.perfkit': '面向 RUM 的性能采集与可视化工具。',
      'projects.repo': '仓库',
      'posts.title': '文章',
      'links.title': '常用网站',
      'links.search': '搜索引擎',
      'links.github': '代码托管',
      'links.so': '编程问答',
      'links.mdn': 'Web 文档',
      'links.chatgpt': 'AI 助手',
      'contact.title': '联系',
      'contact.copy': '复制邮箱',
      'footer.top': '回到顶部 ↑',
    }
  };

  function applyI18n(locale) {
    const dict = translations[locale] || translations.en;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const html = dict[key];
      if (html != null) el.innerHTML = html;
    });
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = locale === 'zh' ? '🌐 中文' : '🌐 EN';
  }

  // default to English
  let savedLang = 'en';
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'zh') savedLang = stored;
  } catch (_) {}
  applyI18n(savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const next = (document.documentElement.lang || 'en').startsWith('zh') ? 'en' : 'zh';
      applyI18n(next);
      try { localStorage.setItem('lang', next); } catch (_) {}
    });
  }
  if (year) year.textContent = String(new Date().getFullYear());

  if (typewriter && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const text = typewriter.textContent || '';
    typewriter.textContent = '';
    let i = 0;
    const tick = () => {
      typewriter.textContent = text.slice(0, i++);
      if (i <= text.length) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (copyEmail) {
    copyEmail.addEventListener('click', async (e) => {
      const email = e.currentTarget.getAttribute('data-email') || '';
      try {
        await navigator.clipboard.writeText(email);
        const isZh = (document.documentElement.lang || 'en').startsWith('zh');
        e.currentTarget.textContent = isZh ? '已复制' : 'Copied';
        setTimeout(() => (e.currentTarget.textContent = isZh ? '复制邮箱' : 'Copy email'), 1500);
      } catch (_) {}
    });
  }
})();



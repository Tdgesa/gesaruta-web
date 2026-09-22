(() => {
  const languageSelector = document.querySelector('.language-selector');
  const languageToggle = languageSelector?.querySelector('.language-toggle');
  const languageMenu = languageSelector?.querySelector('.language-menu');
  const languageOptions = languageMenu ? [...languageMenu.querySelectorAll('button')] : [];
  const originalTexts = new Map();
  const originalTitle = document.title;
  let currentLanguage = 'es';
  let translationRequest = 0;
  const setLanguageOpen = (open) => {
    languageToggle.setAttribute('aria-expanded', String(open));
    languageMenu.hidden = !open;
  };
  const renderLanguage = (option) => {
    const language = option.dataset.language;
    languageOptions.forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
    languageToggle.querySelector('img').src = option.querySelector('img').getAttribute('src');
    languageToggle.querySelector('.language-code').textContent = language.toUpperCase();
    languageToggle.setAttribute('aria-label', `Seleccionar idioma: ${option.textContent.trim()}`);
  };
  const translateText = async (text, language) => {
    const request = new URLSearchParams({ client: 'gtx', sl: 'es', tl: language, dt: 't', q: text });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${request}`);
    if (!response.ok) throw new Error('No se pudo traducir el texto.');
    const result = await response.json();
    return result[0].map((part) => part[0]).join('');
  };
  const getTextNodes = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!node.nodeValue.trim() || !parent || parent.closest('.language-selector, script, style, noscript, [data-no-translate]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };
  const translatePage = async (language) => {
    currentLanguage = language;
    const requestId = ++translationRequest;
    document.documentElement.lang = language;
    const nodes = getTextNodes();
    if (language === 'es') {
      nodes.forEach((node) => {
        if (originalTexts.has(node)) node.nodeValue = originalTexts.get(node);
      });
      document.title = originalTitle;
      return;
    }
    const translations = nodes.map(async (node) => {
      const source = originalTexts.get(node) ?? node.nodeValue;
      originalTexts.set(node, source);
      try {
        const translated = await translateText(source, language);
        if (requestId === translationRequest) node.nodeValue = translated;
      } catch { /* Keep the original text if the free translation service is unavailable. */ }
    });
    try {
      const translatedTitle = await translateText(originalTitle, language);
      if (requestId === translationRequest) document.title = translatedTitle;
    } catch { /* Keep the original title if translation is unavailable. */ }
    for (let index = 0; index < translations.length; index += 10) {
      await Promise.all(translations.slice(index, index + 10));
    }
  };
  const selectLanguage = (option) => {
    const language = option.dataset.language;
    renderLanguage(option);
    try { localStorage.setItem('gesaruta-language', language); } catch { /* Storage may be unavailable. */ }
    translatePage(language);
  };
  if (languageSelector && languageToggle && languageMenu) {
    try {
      const savedOption = languageOptions.find((option) => option.dataset.language === localStorage.getItem('gesaruta-language'));
      if (savedOption) {
        renderLanguage(savedOption);
        if (savedOption.dataset.language !== 'es') translatePage(savedOption.dataset.language);
      }
    } catch { /* Keep the default language when storage is unavailable. */ }
    languageToggle.addEventListener('click', () => setLanguageOpen(languageMenu.hidden));
    languageOptions.forEach((option) => option.addEventListener('click', () => {
      selectLanguage(option);
      setLanguageOpen(false);
      languageToggle.focus();
    }));
    languageSelector.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setLanguageOpen(false);
        languageToggle.focus();
        event.preventDefault();
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        setLanguageOpen(true);
        const current = languageOptions.indexOf(document.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? languageOptions.length - 1
          : current < 0 ? (event.key === 'ArrowUp' ? languageOptions.length - 1 : 0)
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + languageOptions.length) % languageOptions.length;
        languageOptions[next].focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!languageSelector.contains(event.target)) setLanguageOpen(false);
    });
    languageSelector.addEventListener('focusout', (event) => {
      if (!languageSelector.contains(event.relatedTarget)) setLanguageOpen(false);
    });
  }

  const solutions = {
    gesatd: {
      tone: 'orange', index: '01', label: 'Núcleo de datos', name: 'GESATD',
      description: 'El tacógrafo deja de ser un archivo que descargar y se convierte en información útil para decidir.',
      bullets: ['Descarga remota y custodia segura', 'Alertas antes de que llegue una sanción', 'Informes listos para tu equipo'],
    },
    gesalab: {
      tone: 'terracotta', index: '02', label: 'Control laboral', name: 'GESALAB',
      description: 'Convierte los datos de conducción en jornadas claras, excesos detectados y decisiones laborales trazables.',
      bullets: ['Jornada diaria y excesos', 'Criterios según convenio', 'Informes para administración'],
    },
    deca: {
      tone: 'ink', index: '03', label: 'Documentación digital', name: 'DeCA / eCMR',
      description: 'Cada porte documentado, trazable y accesible ante una inspección. DeCA hoy; eCMR mañana.',
      bullets: ['Documento digital con QR', 'Entrega y custodia registradas', 'Histórico siempre disponible'],
    },
  };

  const contact = (name) => `mailto:hola@gesaruta.com?subject=${encodeURIComponent(`Quiero una propuesta de ${name}`)}`;
  const panel = document.querySelector('#solution-panel');
  document.querySelectorAll('.solution-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const solution = solutions[tab.dataset.solution];
      document.querySelectorAll('.solution-tab').forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
      });
      panel.className = `solution-feature feature-${solution.tone}`;
      panel.innerHTML = `<div class="feature-top"><span>CAPA / ${solution.index}</span><span class="feature-orbit" aria-hidden="true">◌</span></div><p class="overline">${solution.label}</p><h3>${solution.name}</h3><p class="feature-description">${solution.description}</p><ul>${solution.bullets.map((bullet) => `<li><span>+</span>${bullet}</li>`).join('')}</ul><a class="feature-link" href="${contact(solution.name)}">Solicitar propuesta <span aria-hidden="true">↗</span></a>`;
      if (currentLanguage !== 'es') translatePage(currentLanguage);
    });
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const destination = new URL(link.href, window.location.href);
    const isExternalPage = destination.origin !== window.location.origin;
    if (['http:', 'https:'].includes(destination.protocol) && isExternalPage) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  if (menuToggle && navigation) menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.classList.toggle('is-open', !open);
    navigation.classList.toggle('is-open', !open);
  });
  if (menuToggle && navigation) navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-open');
    navigation.classList.remove('is-open');
  }));

  const countdownDays = document.querySelector('#countdown-days');
  if (countdownDays) {
    const countdownTarget = new Date('2026-10-05T00:00:00+02:00').getTime();
    const spainTime = document.querySelector('#spain-time');
    const spainClock = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const number = (value) => String(value).padStart(2, '0');
    const updateCountdown = () => {
      let remaining = Math.max(0, countdownTarget - Date.now());
      const days = Math.floor(remaining / 86400000);
      remaining %= 86400000;
      const hours = Math.floor(remaining / 3600000);
      remaining %= 3600000;
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      countdownDays.textContent = String(days);
      document.querySelector('#countdown-hours').textContent = number(hours);
      document.querySelector('#countdown-minutes').textContent = number(minutes);
      document.querySelector('#countdown-seconds').textContent = number(seconds);
      spainTime.textContent = `Hora en España · ${spainClock.format(new Date())}`;
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const cookieKey = 'gesaruta-cookie-consent';
  if (!window.localStorage.getItem(cookieKey)) {
    const cookieNotice = document.createElement('aside');
    cookieNotice.className = 'cookie-notice';
    cookieNotice.setAttribute('role', 'dialog');
    cookieNotice.setAttribute('aria-labelledby', 'cookie-title');
    cookieNotice.innerHTML = `<div><p class="overline">Privacidad y cookies</p><h2 id="cookie-title">Tu privacidad importa.</h2><p>Usamos cookies necesarias para que la web funcione correctamente. Puedes aceptar todas o continuar solo con las necesarias.</p><a href="/legal/#cookies">Consultar la política de cookies</a></div><div class="cookie-actions"><button class="button button-outline" type="button" data-cookie-choice="necessary">Solo necesarias</button><button class="button button-primary" type="button" data-cookie-choice="all">Aceptar todas</button></div>`;
    document.body.append(cookieNotice);
    cookieNotice.querySelectorAll('[data-cookie-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        window.localStorage.setItem(cookieKey, button.dataset.cookieChoice);
        cookieNotice.remove();
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) reveals.forEach((element) => element.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((element) => observer.observe(element));
  }
})();

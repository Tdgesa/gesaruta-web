(() => {
  const solutions = {
    gesatd: {
      tone: 'blue', index: '01', label: 'Núcleo de datos', name: 'GESATD',
      description: 'El tacógrafo deja de ser un archivo que descargar y se convierte en información útil para decidir.',
      bullets: ['Descarga remota y custodia segura', 'Alertas antes de que llegue una sanción', 'Informes listos para tu equipo'],
    },
    gesalab: {
      tone: 'orange', index: '02', label: 'Control laboral', name: 'GESALAB',
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
      document.querySelectorAll('.solution-tab').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
      panel.className = `solution-feature feature-${solution.tone}`;
      panel.innerHTML = `<div class="feature-top"><span>CAPA / ${solution.index}</span><span class="feature-orbit" aria-hidden="true">◌</span></div><p class="overline">${solution.label}</p><h3>${solution.name}</h3><p class="feature-description">${solution.description}</p><ul>${solution.bullets.map((bullet) => `<li><span>+</span>${bullet}</li>`).join('')}</ul><a class="feature-link" href="${contact(solution.name)}">Solicitar propuesta <span aria-hidden="true">↗</span></a>`;
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.classList.toggle('is-open', !open);
    navigation.classList.toggle('is-open', !open);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-open');
    navigation.classList.remove('is-open');
  }));

  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) reveals.forEach((element) => element.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((element) => observer.observe(element));
  }
})();

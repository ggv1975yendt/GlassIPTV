/* Static, local illustration. No streams, accounts or analytics are loaded. */
(() => {
  let language = 'ru';
  let mode = 'pip';
  let mixed = false;
  let swapped = false;
  let libraryIndex = 0;
  const byId = id => document.getElementById(id);
  const text = key => translations[key][language];
  const modeButtons = [...document.querySelectorAll('[data-mode]')];
  const libraryTabs = [...document.querySelectorAll('[data-library]')];
  function renderMode() {
    const isPip = mode === 'pip';
    const sportMain = isPip && swapped;
    byId('main-scene').src = sportMain ? 'stadium.svg' : 'nature.svg';
    byId('pip-scene').src = sportMain ? 'nature.svg' : 'stadium.svg';
    byId('pip-window').hidden = !isPip;
    byId('pip-actions').hidden = !isPip;
    byId('pip-score').hidden = sportMain;
    byId('pip-tag').textContent = sportMain
      ? text('natureTag') + ' · ' + text(mixed ? 'recordLabel' : 'liveLabel')
      : text('sportTag') + ' · ' + text('liveLabel');
    byId('scene-kicker').textContent = text(sportMain ? 'sportKicker' : 'natureKicker');
    byId('pip-score').textContent = text('score');
    byId('scene-title').innerHTML = text(sportMain ? 'sceneSport' : 'sceneNature');
    byId('mode-label').textContent = text({ live: 'liveLabel', archive: 'archiveLabel', pip: 'pipLabel', recording: 'recordLabel' }[mode]);
    byId('program-title').textContent = text(sportMain ? 'sport' : mode === 'archive' ? 'trails' : mode === 'recording' || (isPip && mixed) ? 'recordName' : 'nature');
    const fileMain = mode === 'recording' || (isPip && mixed && !swapped);
    const seekable = fileMain || mode === 'archive';
    byId('time-start').textContent = seekable ? '00:18:24' : '20:00';
    byId('time-end').textContent = seekable ? '00:52:00' : '21:00';
    byId('progress-fill').style.width = seekable ? '35%' : '70%';
    byId('mode-symbol').textContent = fileMain ? '▷' : isPip ? '▣' : '↶';
    byId('demo-caption').textContent = text(isPip && mixed ? 'pipMixCaption' : mode === 'recording' ? 'recordCaption' : mode + 'Caption');
    byId('pip-kind').textContent = text(mixed ? 'twoLiveButton' : 'mixButton');
    byId('pip-kind').setAttribute('aria-pressed', String(mixed));
    modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  }
  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'ru';
    document.documentElement.lang = language;
    document.title = text('title');
    document.querySelector('meta[name="description"]').content = text('description');
    for (const prefix of ['og', 'twitter']) {
      const attribute = prefix === 'og' ? 'property' : 'name';
      for (const key of ['title', 'description']) document.querySelector(`meta[${attribute}="${prefix}:${key}"]`).content = text(key);
    }
    document.querySelector('meta[property="og:locale"]').content = language === 'ru' ? 'ru_RU' : 'en_US';
    document.querySelector('meta[property="og:locale:alternate"]').content = language === 'ru' ? 'en_US' : 'ru_RU';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.innerHTML = text(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', text(element.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => element.alt = text(element.dataset.i18nAlt));
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    try { localStorage.setItem('lumora-promo-language', language); } catch (_) { /* Private browsing still works. */ }
    renderMode();
  }
  function selectLibrary(index, moveFocus = false, panelFocus = false) {
    libraryIndex = (index + libraryTabs.length) % libraryTabs.length;
    libraryTabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === libraryIndex));
      tab.tabIndex = i === libraryIndex ? 0 : -1;
      byId('library-panel-' + i).hidden = i !== libraryIndex;
    });
    if (moveFocus) (panelFocus ? byId('library-panel-' + libraryIndex) : libraryTabs[libraryIndex]).focus();
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  modeButtons.forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; renderMode(); }));
  byId('pip-kind').addEventListener('click', () => { mixed = !mixed; renderMode(); });
  byId('pip-swap').addEventListener('click', () => { swapped = !swapped; renderMode(); });
  byId('try-pip').addEventListener('click', () => { mode = 'pip'; renderMode(); });
  libraryTabs.forEach((tab, i) => tab.addEventListener('click', () => selectLibrary(i)));
  byId('library-demo').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? libraryTabs.length - 1 : libraryIndex + (event.key === 'ArrowRight' ? 1 : -1);
    selectLibrary(next, true, Boolean(event.target.closest('[role="tabpanel"]')));
  });
  let saved;
  function updateColour(key, value, custom = true) {
    byId('theme-preview').style.setProperty('--demo-' + key, value);
    document.querySelectorAll('[data-colour="' + key + '"]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.value === value)));
    document.querySelector('[data-custom="' + key + '"]').value = value;
    if (custom) byId('theme-preset').value = '5';
  }
  document.querySelectorAll('[data-colour]').forEach(button => button.addEventListener('click', () => updateColour(button.dataset.colour, button.dataset.value)));
  document.querySelectorAll('[data-custom]').forEach(input => input.addEventListener('input', () => updateColour(input.dataset.custom, input.value)));
  const themes = [
    ['#0b141a','#f2f5f5','#b7c2c7','#254f70','#8be4ff'],
    ['#191b20','#f5f5f5','#bfc2ca','#454b58','#d5dceb'],
    ['#071e30','#eaf8ff','#abcdd9','#145775','#71e0ee'],
    ['#291c17','#fff4e6','#d8bfa8','#70432c','#ffc58a'],
    ['#000000','#ffffff','#e6e6e6','#193e61','#ffe66d']
  ];
  byId('theme-preset').addEventListener('change', event => {
    const theme = themes[Number(event.target.value)];
    if (theme) {
      ['panel','text','secondary','focus','border'].forEach((key, i) => updateColour(key, theme[i], false));
      const width = event.target.value === '4' ? 4 : 3;
      byId('theme-width').value = width;
      byId('theme-width-value').textContent = width + 'px';
      byId('theme-preview').style.setProperty('--demo-width', width + 'px');
    }
  });
  for (const key of ['width','opacity','scale']) {
    byId('theme-' + key).addEventListener('input', event => {
      const value = Number(event.target.value);
      byId('theme-' + key + '-value').textContent = value + event.target.dataset.unit;
      byId('theme-preview').style.setProperty('--demo-' + key, key === 'width' ? value + 'px' : key === 'opacity' ? 1 - value / 100 : value / 100);
      if (key === 'width') byId('theme-preset').value = '5';
    });
  }
  // Retain a visitor's language from the previous brand once, without changing Android paths.
  try { saved = localStorage.getItem('lumora-promo-language') || localStorage.getItem('glass-promo-language'); } catch (_) {}
  setLanguage(saved === 'ru' || saved === 'en' ? saved : document.documentElement.dataset.pageLanguage || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en'));
})();

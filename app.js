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
      ? 'NATURE · ' + text(mixed ? 'recordLabel' : 'liveLabel')
      : 'SPORT · ' + text('liveLabel');
    byId('scene-kicker').textContent = sportMain ? 'SPORT / LIVE' : 'NATURE / DOCUMENTARY';
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
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.innerHTML = text(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', text(element.dataset.i18nAria));
    });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    try { localStorage.setItem('glass-promo-language', language); } catch (_) { /* Private browsing still works. */ }
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
  try { saved = localStorage.getItem('glass-promo-language'); } catch (_) {}
  setLanguage(saved === 'ru' || saved === 'en' ? saved : navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
})();

const translations = window.DVG_I18N;
const storedLanguage = localStorage.getItem('dvg-language');
const browserLanguage = (navigator.language || 'en').toLowerCase();
let currentLanguage = ['ca', 'en'].includes(storedLanguage)
  ? storedLanguage
  : (browserLanguage.startsWith('ca') ? 'ca' : 'en');

const tr = (key, values = {}) => {
  let text = translations[currentLanguage]?.[key] || translations.en[key] || key;
  for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, value);
  return text;
};

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  localStorage.setItem('dvg-language', language);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = tr(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = tr(element.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = tr(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (readerStatus && bookText) renderReader(searchInput.value);
  else if (readerStatus) readerStatus.textContent = tr('loadingBook');
}

document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const configuredBaseUrl = window.DVG_CONFIG?.bookBaseUrl || 'Data Visualisation Guide/';
const bookBaseUrl = configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`;
const bookUrl = (filename) => `${bookBaseUrl}${filename}`;

document.querySelectorAll('[data-book-file]').forEach((element) => {
  const url = bookUrl(element.dataset.bookFile);
  if (element.tagName === 'IMG') element.src = url;
  else element.href = url;
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const reader = document.querySelector('#reader-content');
const readerStatus = document.querySelector('#reader-status');
const searchInput = document.querySelector('#reader-search');
let bookText = '';
let readerSize = 18;

const escapeHtml = (value) => value.replace(/[&<>"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
})[character]);

function renderReader(query = '') {
  if (!reader || !bookText) return;
  const safeText = escapeHtml(bookText);
  if (!query.trim()) {
    reader.innerHTML = safeText;
    readerStatus.textContent = tr('fullText');
    return;
  }
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = new RegExp(safeQuery, 'gi');
  let matches = 0;
  reader.innerHTML = safeText.replace(matcher, (match) => {
    matches += 1;
    return `<mark>${match}</mark>`;
  });
  readerStatus.textContent = tr('searchMatches', { count: matches, query });
  reader.querySelector('mark')?.scrollIntoView({ block: 'center' });
}

if (reader) {
  fetch(bookUrl('DVG.txt'))
    .then((response) => {
      if (!response.ok) throw new Error('No s’ha pogut carregar el text.');
      return response.text();
    })
    .then((text) => { bookText = text; renderReader(); })
    .catch(() => {
      readerStatus.textContent = tr('readerLocalError');
      reader.textContent = tr('txtDownload');
    });

  reader.addEventListener('scroll', () => {
    const maximum = reader.scrollHeight - reader.clientHeight;
    const progress = maximum > 0 ? (reader.scrollTop / maximum) * 100 : 0;
    document.querySelector('#reader-progress-bar').style.width = `${progress}%`;
  });
}

let searchTimer;
searchInput?.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderReader(searchInput.value), 220);
});

document.querySelector('#font-smaller')?.addEventListener('click', () => {
  readerSize = Math.max(14, readerSize - 1);
  reader.style.setProperty('--reader-size', `${readerSize}px`);
});
document.querySelector('#font-larger')?.addEventListener('click', () => {
  readerSize = Math.min(28, readerSize + 1);
  reader.style.setProperty('--reader-size', `${readerSize}px`);
});
document.querySelector('#reader-width')?.addEventListener('click', (event) => {
  const isNarrow = reader.classList.toggle('is-narrow');
  event.currentTarget.setAttribute('aria-pressed', String(isNarrow));
});

const audioReaderPanel = document.querySelector('#audio-reader-panel');
const audioElement = document.querySelector('#chapter-audio');
const chapterSelect = document.querySelector('#audio-chapter');
const audioTranscript = document.querySelector('#audio-transcript');
const audioStatus = document.querySelector('#audio-status');
let audioManifest;
let activeChapterIndex = 0;
let activeCueIndex = -1;

document.querySelectorAll('[data-open-audio-reader]').forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(() => audioReaderPanel.focus?.(), 350);
  });
});

function formatTime(value) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  return `${hours ? `${hours}:` : ''}${String(minutes).padStart(hours ? 2 : 1, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderAudioChapter(index, autoplay = false) {
  if (!audioManifest) return;
  const chapter = audioManifest.chapters[index];
  activeChapterIndex = index;
  activeCueIndex = -1;
  chapterSelect.value = String(index);
  audioElement.src = bookUrl(`DVG-audio/${chapter.audio}`);
  audioElement.playbackRate = Number(document.querySelector('#audio-speed').value);
  audioTranscript.replaceChildren();

  const headingIds = new Set(chapter.cues.slice(0, 4).filter((cue) => cue.text.length < 90).map((cue) => cue.start));
  const fragment = document.createDocumentFragment();
  chapter.cues.forEach((cue, cueIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'audio-cue';
    button.dataset.cueIndex = String(cueIndex);
    button.dataset.heading = String(headingIds.has(cue.start));
    button.textContent = `${cue.text} `;
    button.addEventListener('click', () => {
      audioElement.currentTime = cue.start;
      audioElement.play();
    });
    fragment.append(button);
  });
  audioTranscript.append(fragment);
  audioStatus.textContent = `${chapter.title} · ${formatTime(chapter.duration)}`;
  document.querySelector('#previous-chapter').disabled = index === 0;
  document.querySelector('#next-chapter').disabled = index === audioManifest.chapters.length - 1;
  if (autoplay) audioElement.play();
}

function cueAtTime(cues, time) {
  let low = 0;
  let high = cues.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (time < cues[middle].start) high = middle - 1;
    else if (time >= cues[middle].end) low = middle + 1;
    else return middle;
  }
  return Math.max(0, Math.min(cues.length - 1, high));
}

if (audioElement) {
  fetch(bookUrl('DVG-audio/manifest.json'))
    .then((response) => {
      if (!response.ok) throw new Error('No s’ha trobat el manifest d’àudio.');
      return response.json();
    })
    .then((manifest) => {
      audioManifest = manifest;
      chapterSelect.innerHTML = manifest.chapters.map((chapter, index) =>
        `<option value="${index}">${index + 1}. ${escapeHtml(chapter.title)}</option>`
      ).join('');
      renderAudioChapter(0);
    })
    .catch(() => {
      audioStatus.textContent = tr('audioError');
    });

  audioElement.addEventListener('timeupdate', () => {
    const chapter = audioManifest?.chapters[activeChapterIndex];
    if (!chapter) return;
    const nextCueIndex = cueAtTime(chapter.cues, audioElement.currentTime);
    const progress = chapter.duration ? (audioElement.currentTime / chapter.duration) * 100 : 0;
    document.querySelector('#audio-progress-bar').style.width = `${progress}%`;
    if (nextCueIndex === activeCueIndex) return;
    audioTranscript.querySelector('.is-active')?.classList.remove('is-active');
    activeCueIndex = nextCueIndex;
    const activeCue = audioTranscript.querySelector(`[data-cue-index="${nextCueIndex}"]`);
    activeCue?.classList.add('is-active');
    if (!audioElement.paused) activeCue?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  audioElement.addEventListener('ended', () => {
    if (activeChapterIndex < audioManifest.chapters.length - 1) renderAudioChapter(activeChapterIndex + 1, true);
  });
}

chapterSelect?.addEventListener('change', () => renderAudioChapter(Number(chapterSelect.value)));
document.querySelector('#audio-speed')?.addEventListener('change', (event) => {
  audioElement.playbackRate = Number(event.currentTarget.value);
});
document.querySelector('#previous-chapter')?.addEventListener('click', () => renderAudioChapter(activeChapterIndex - 1));
document.querySelector('#next-chapter')?.addEventListener('click', () => renderAudioChapter(activeChapterIndex + 1));

applyLanguage(currentLanguage);

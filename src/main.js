const paths = {
  waves: '<path d="M2 12c2.5-7 5.5 7 8 0s5.5 7 8 0 4 0 4 0"/>', user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>', lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', play: '<polygon points="6 3 20 12 6 21 6 3"/>', pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>', upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', plus: '<path d="M5 12h14M12 5v14"/>', 'volume-2': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1-2.6 2.6-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21h-3.6v-.2A2 2 0 0 0 9 19a2 2 0 0 0-2.2.4l-.1.1-2.6-2.6.1-.1A2 2 0 0 0 4.6 15a2 2 0 0 0-1.8-1.2H2v-3.6h.8A2 2 0 0 0 4.6 9a2 2 0 0 0-.4-2.2l-.1-.1 2.6-2.6.1.1A2 2 0 0 0 9 4.6a2 2 0 0 0 1.2-1.8V2h3.6v.8A2 2 0 0 0 15 4.6a2 2 0 0 0 2.2-.4l.1-.1 2.6 2.6-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2h.8v3.6h-.8A2 2 0 0 0 19.4 15z"/>', 'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>', 'music-2': '<circle cx="8" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M11 18V5l10-2v13M11 9l10-2"/>', 'trash-2': '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>', check: '<path d="m20 6-11 11-5-5"/>'
};
function createIcons() { document.querySelectorAll('i[data-lucide]').forEach(i => { const s = document.createElementNS('http://www.w3.org/2000/svg','svg'); [...i.attributes].forEach(a => a.name !== 'data-lucide' && s.setAttribute(a.name,a.value)); s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('fill','none'); s.setAttribute('stroke','currentColor'); s.setAttribute('stroke-width','2'); s.setAttribute('stroke-linecap','round'); s.setAttribute('stroke-linejoin','round'); s.innerHTML = paths[i.dataset.lucide] || ''; i.replaceWith(s); }); }

const starterPads = [
  { id: 'intro', title: 'Show Intro', category: 'Intros', key: '1', theme: 'aurora', duration: '0:08' },
  { id: 'applause', title: 'Applaus', category: 'Publikum', key: '2', theme: 'crowd', duration: '0:12' },
  { id: 'airhorn', title: 'Air Horn', category: 'Effekte', key: '3', theme: 'sunset', duration: '0:04' },
  { id: 'drumroll', title: 'Drumroll', category: 'Effekte', key: '4', theme: 'drum', duration: '0:09' },
  { id: 'correct', title: 'Richtig!', category: 'Reaktionen', key: '5', theme: 'green', duration: '0:03' },
  { id: 'wrong', title: 'Falsch', category: 'Reaktionen', key: '6', theme: 'red', duration: '0:03' },
  { id: 'transition', title: 'Transition', category: 'Jingles', key: '7', theme: 'violet', duration: '0:06' },
  { id: 'outro', title: 'Show Outro', category: 'Outros', key: '8', theme: 'ocean', duration: '0:11' }
];

const state = {
  user: JSON.parse(localStorage.getItem('waveboard-user') || 'null'),
  pads: JSON.parse(localStorage.getItem('waveboard-pads') || 'null') || starterPads,
  activeId: null,
  audio: null,
  volume: 74,
  filter: 'Alle Sounds'
};

const app = document.querySelector('#app');

function savePads() {
  localStorage.setItem('waveboard-pads', JSON.stringify(state.pads));
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;
}

function loginView() {
  app.innerHTML = `
    <main class="login-page">
      <div class="login-glow glow-one"></div><div class="login-glow glow-two"></div>
      <section class="login-card">
        <div class="brand large"><span class="brand-mark">${icon('waves', 27)}</span><span>Wave<span>board</span></span></div>
        <p class="eyebrow">DEIN SOUND. DEIN MOMENT.</p>
        <h1>Willkommen zurück</h1>
        <p class="muted">Melde dich an und bring dein Soundboard zum Leben.</p>
        <form id="login-form">
          <label>E-Mail-Adresse<div class="input-wrap">${icon('user', 17)}<input type="email" name="email" placeholder="du@beispiel.de" required /></div></label>
          <label>Passwort<div class="input-wrap">${icon('lock', 17)}<input type="password" name="password" placeholder="Mindestens 6 Zeichen" minlength="6" required /></div></label>
          <div class="form-row"><label class="remember"><input type="checkbox" checked /> Angemeldet bleiben</label><button type="button" class="text-button">Passwort vergessen?</button></div>
          <button class="primary login-button" type="submit">Anmelden ${icon('play', 17)}</button>
        </form>
        <p class="signup">Noch kein Konto? <button id="signup" class="text-button">Kostenlos registrieren</button></p>
      </section>
      <p class="login-footer">Mit Liebe für Creator gebaut&nbsp; <span>●</span>&nbsp; Deine Sounds bleiben in deinem Browser.</p>
    </main>`;
  createIcons();
  document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get('email');
    state.user = { name: email.split('@')[0].replace(/[._-]/g, ' '), email };
    localStorage.setItem('waveboard-user', JSON.stringify(state.user));
    dashboardView();
  });
  document.querySelector('#signup').addEventListener('click', () => document.querySelector('input[name="email"]').focus());
}

function padMarkup(pad) {
  const custom = pad.image ? `style="--pad-image:url('${pad.image}')"` : '';
  return `<article class="pad ${pad.theme || 'custom'} ${state.activeId === pad.id ? 'playing' : ''}" data-id="${pad.id}" tabindex="0" role="button" aria-label="${pad.title} abspielen" ${custom}>
    <div class="pad-art"><span class="pad-key">${pad.key || '•'}</span><div class="play-orbit">${icon(state.activeId === pad.id ? 'pause' : 'play', 27)}</div></div>
    <div class="pad-info"><div><h3>${pad.title}</h3><p>${pad.category}</p></div><span class="duration">${pad.duration || 'NEU'}</span></div>
    <button class="delete-pad" title="Sound löschen" aria-label="Sound löschen">${icon('trash-2', 15)}</button>
  </article>`;
}

function dashboardView() {
  const firstName = state.user?.name?.split(' ')[0] || 'Creator';
  const categories = ['Alle Sounds', ...new Set(state.pads.map(p => p.category))];
  const shown = state.filter === 'Alle Sounds' ? state.pads : state.pads.filter(p => p.category === state.filter);
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">${icon('waves', 24)}</span><span>Wave<span>board</span></span></div>
        <nav><p class="nav-label">MEIN BEREICH</p><button class="nav-item active">${icon('music-2')} Soundboard <span>${state.pads.length}</span></button><button class="nav-item" id="nav-upload">${icon('upload')} Uploads</button><p class="nav-label space">SAMMLUNGEN</p>
        ${categories.slice(1, 5).map((c, i) => `<button class="nav-item filter-link" data-filter="${c}"><span class="dot dot-${i}"></span>${c}</button>`).join('')}</nav>
        <div class="sidebar-tip"><div>${icon('volume-2', 19)}</div><strong>Pro-Tipp</strong><p>Nutze die Tasten 1–8, um Sounds blitzschnell abzuspielen.</p></div>
        <div class="profile"><div class="avatar">${firstName.slice(0, 2).toUpperCase()}</div><div><strong>${firstName}</strong><span>Creator Account</span></div><button id="logout" title="Abmelden">${icon('log-out', 17)}</button></div>
      </aside>
      <main class="workspace">
        <header><div class="mobile-brand brand"><span class="brand-mark">${icon('waves', 22)}</span>Wave<span>board</span></div><div class="header-actions"><div class="master-volume">${icon('volume-2', 18)}<input id="volume" type="range" min="0" max="100" value="${state.volume}" /><span>${state.volume}%</span></div><button class="icon-button">${icon('settings', 19)}</button><button class="primary" id="add-sound">${icon('plus', 18)} Sound hinzufügen</button></div></header>
        <section class="hero"><div><p class="eyebrow">DONNERSTAG · BEREIT FÜR DIE SHOW</p><h1>Hey ${firstName},<br><span>mach etwas Lärm.</span></h1><p>Deine Sounds, genau im richtigen Moment. Klick auf ein Pad oder nutze die Tastatur.</p></div><div class="now-playing"><div class="equalizer"><i></i><i></i><i></i><i></i><i></i></div><div><span>JETZT BEREIT</span><strong>${state.pads.length} Sounds geladen</strong></div></div></section>
        <section class="board-section">
          <div class="board-heading"><div><h2>Mein Soundboard</h2><p>${shown.length} Sounds in dieser Ansicht</p></div><div class="filters">${categories.slice(0,4).map(c => `<button data-filter="${c}" class="${state.filter === c ? 'active' : ''}">${c}</button>`).join('')}</div></div>
          <div class="pad-grid">${shown.map(padMarkup).join('')}<button class="add-tile" id="add-tile"><span>${icon('plus', 28)}</span><strong>Neuer Sound</strong><small>MP3, WAV oder OGG</small></button></div>
        </section>
        <footer><span><i></i> System bereit</span><span>Waveboard v1.0</span></footer>
      </main>
    </div>
    <div id="modal-root"></div>`;
  createIcons();
  bindDashboard();
}

function bindDashboard() {
  document.querySelectorAll('.pad').forEach(el => {
    el.addEventListener('click', e => e.target.closest('.delete-pad') ? deletePad(el.dataset.id) : playPad(el.dataset.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') playPad(el.dataset.id); });
  });
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { state.filter = b.dataset.filter; dashboardView(); }));
  ['#add-sound', '#add-tile', '#nav-upload'].forEach(s => document.querySelector(s)?.addEventListener('click', openUploadModal));
  document.querySelector('#logout').addEventListener('click', () => { localStorage.removeItem('waveboard-user'); state.user = null; loginView(); });
  document.querySelector('#volume').addEventListener('input', e => { state.volume = e.target.value; e.target.nextElementSibling.textContent = `${state.volume}%`; if (state.audio) state.audio.volume = state.volume / 100; });
}

function playPad(id) {
  const pad = state.pads.find(p => p.id === id);
  if (state.activeId === id) { state.audio?.pause(); state.activeId = null; dashboardView(); return; }
  state.audio?.pause();
  state.activeId = id;
  if (pad.audio) {
    state.audio = new Audio(pad.audio); state.audio.volume = state.volume / 100;
    state.audio.play().catch(() => {}); state.audio.onended = () => { state.activeId = null; dashboardView(); };
  } else {
    state.audio = null; setTimeout(() => { if (state.activeId === id) { state.activeId = null; dashboardView(); } }, 1600);
  }
  dashboardView();
}

function deletePad(id) {
  state.pads = state.pads.filter(p => p.id !== id); savePads(); dashboardView();
}

function openUploadModal() {
  document.querySelector('#modal-root').innerHTML = `<div class="modal-backdrop"><section class="modal"><button class="modal-close">${icon('x')}</button><span class="modal-icon">${icon('upload', 26)}</span><p class="eyebrow">NEUES PAD</p><h2>Sound hinzufügen</h2><p class="muted">Gib deinem Sound einen Namen und wähle die passenden Dateien.</p><form id="upload-form">
    <label>Name des Sounds<input name="title" placeholder="z. B. Epic Intro" required maxlength="28" /></label><label>Kategorie<input name="category" placeholder="z. B. Jingles" required maxlength="18" /></label>
    <div class="file-row"><label class="file-drop">${icon('music-2', 22)}<strong>Sounddatei</strong><span id="audio-name">MP3, WAV, OGG</span><input name="audio" type="file" accept="audio/*" required /></label><label class="file-drop">${icon('image', 22)}<strong>Hintergrundbild</strong><span id="image-name">JPG, PNG, WEBP</span><input name="image" type="file" accept="image/*" /></label></div>
    <button class="primary submit-sound" type="submit">${icon('check', 18)} Soundboard-Pad erstellen</button></form></section></div>`;
  createIcons();
  const close = () => document.querySelector('#modal-root').innerHTML = '';
  document.querySelector('.modal-close').addEventListener('click', close);
  document.querySelector('.modal-backdrop').addEventListener('click', e => { if (e.target.classList.contains('modal-backdrop')) close(); });
  document.querySelectorAll('input[type=file]').forEach(input => input.addEventListener('change', () => { if (input.files[0]) input.previousElementSibling.textContent = input.files[0].name; }));
  document.querySelector('#upload-form').addEventListener('submit', async e => {
    e.preventDefault(); const data = new FormData(e.target); const audio = data.get('audio'), image = data.get('image');
    const toDataUrl = file => new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(file); });
    state.pads.push({ id: crypto.randomUUID(), title: data.get('title'), category: data.get('category'), duration: 'NEU', theme: 'custom', audio: await toDataUrl(audio), image: image?.size ? await toDataUrl(image) : null, key: state.pads.length < 9 ? String(state.pads.length + 1) : '•' });
    savePads(); close(); state.filter = 'Alle Sounds'; dashboardView();
  });
}

window.addEventListener('keydown', e => { if (!document.querySelector('.modal') && /^[1-8]$/.test(e.key) && state.user) { const pad = state.pads[Number(e.key)-1]; if (pad) playPad(pad.id); } });

state.user ? dashboardView() : loginView();

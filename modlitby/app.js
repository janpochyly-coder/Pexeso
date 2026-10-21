(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = arr => arr.map(t => `<p>${esc(t)}</p>`).join('');

  function acc(title, sub, bodyHtml) {
    const d = el('details', 'card acc');
    d.innerHTML = `<summary>${title}${sub ? `<span class="sub">${sub}</span>` : ''}</summary><div class="body">${bodyHtml}</div>`;
    return d;
  }

  function renderV() {
    const v = $('#V');
    const lead = el('div', 'card lead', `<h2>${esc(VYZNAVANIE.uvod.nadpis)}</h2>${paras(VYZNAVANIE.uvod.text)}`);
    v.append(lead, el('div', 'section-label', 'Kategórie'));
    VYZNAVANIE.kategorie.forEach(k => v.append(acc(esc(k.nazov), '', paras(k.text))));
  }

  function renderR() {
    const r = $('#R');
    if (!REMY.length) { r.append(el('div', 'empty', 'Zatiaľ žiadne verše.')); return; }
    REMY.forEach(x => {
      const keys = Object.keys(x.preklady);
      const body = keys.map(k => `<div class="tr"><b>${esc(k)}</b>${esc(x.preklady[k])}</div>`).join('');
      r.append(acc(`<span class="ref">${esc(x.ref)}</span>`, keys.length + ' prekl.', body));
    });
  }

  function renderM() {
    const m = $('#M');
    MODLITBY.forEach(k => {
      const body = `<div class="chips">${k.slova.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>`;
      m.append(acc(esc(k.nazov), k.slova.length, body));
    });
  }

  renderV(); renderR(); renderM();

  // záložky
  const names = { V: 'Vyznávanie', R: 'Rémy', M: 'Modlitby' };
  function show(t) {
    document.querySelectorAll('.view').forEach(s => s.hidden = s.id !== t);
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
    $('#title').textContent = names[t];
    try { localStorage.setItem('modlitby-tab', t); } catch (e) {}
    scrollTo(0, 0);
  }
  document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => show(b.dataset.tab));
  let start = 'V';
  try { start = localStorage.getItem('modlitby-tab') || 'V'; } catch (e) {}
  show(names[start] ? start : 'V');

  // deň / noc
  $('#themeBtn').onclick = () => {
    const root = document.documentElement;
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    $('meta[name=theme-color]').content = t === 'dark' ? '#101216' : '#f6f5f1';
    try { localStorage.setItem('modlitby-tema', t); } catch (e) {}
  };
})();

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = arr => arr.map(t => `<p>${esc(t)}</p>`).join('');
  const KEY = 'modlitby-data';

  // ===== dáta: predvolené (data.js) alebo upravené v Správe (localStorage) =====
  const defaults = () => JSON.parse(JSON.stringify({ vyznavanie: VYZNAVANIE, remy: REMY, modlitby: MODLITBY }));
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!db || !db.vyznavanie || !db.remy || !db.modlitby) db = defaults();
  let saveMsg = '';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { alert('Uloženie zlyhalo (úložisko je plné alebo blokované).'); } renderPublic(); };

  function acc(title, sub, bodyHtml, open) {
    const d = el('details', 'card acc');
    if (open) d.open = true;
    d.innerHTML = `<summary>${title}${sub ? `<span class="sub">${sub}</span>` : ''}</summary><div class="body">${bodyHtml}</div>`;
    return d;
  }

  // ===== verejné záložky =====
  function renderPublic() {
    const openState = {};
    ['V', 'R', 'M'].forEach(id => openState[id] = [...document.querySelectorAll(`#${id} details`)].map(d => d.open));
    const v = $('#V'), r = $('#R'), m = $('#M');
    v.replaceChildren(); r.replaceChildren(); m.replaceChildren();

    const V = db.vyznavanie;
    v.append(el('div', 'card lead', `<h2>${esc(V.uvod.nadpis)}</h2>${paras(V.uvod.text)}`), el('div', 'section-label', 'Kategórie'));
    V.kategorie.forEach(k => v.append(acc(esc(k.nazov), '', paras(k.text))));

    if (!db.remy.length) r.append(el('div', 'empty', 'Zatiaľ žiadne verše. Pridaj ich v záložke Správa.'));
    db.remy.forEach(x => {
      const keys = Object.keys(x.preklady).filter(k => x.preklady[k].trim());
      let body = keys.map(k => `<div class="tr"><b>${esc(k)}</b>${esc(x.preklady[k])}</div>`).join('');
      const st = (x.strong || []).filter(s => s.cislo || s.slovo);
      if (st.length) body += `<div class="section-label">Strong</div>` + st.map(s => `<div class="tr"><b>${esc(s.cislo)}</b><span class="orig">${esc(s.slovo)}</span> ${s.prepis ? `<i>${esc(s.prepis)}</i>` : ''}${s.en ? `<br>EN: ${esc(s.en)}` : ''}${s.sk ? `<br>SK: ${esc(s.sk)}` : ''}</div>`).join('');
      if (!body) body = '<p class="empty">Zatiaľ bez textu.</p>';
      r.append(acc(`<span class="ref">${esc(x.ref)}</span>`, keys.length + ' prekl.', body));
    });

    db.modlitby.forEach(k => {
      const body = `<div class="chips">${k.slova.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>`;
      m.append(acc(esc(k.nazov), k.slova.length, body));
    });

    ['V', 'R', 'M'].forEach(id => document.querySelectorAll(`#${id} details`).forEach((d, i) => { if (openState[id][i]) d.open = true; }));
  }

  // ===== Správa (backend) =====
  const lines = s => s.split('\n').map(x => x.trim()).filter(Boolean);
  const blocks = s => s.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  const fld = (label, tag, val, rows) => `<label class="fld"><span>${label}</span><${tag}${rows ? ` rows="${rows}"` : ''}${tag === 'input' ? ` value="${esc(val)}"` : ''}>${tag === 'textarea' ? esc(val) : ''}${tag === 'textarea' ? '</textarea>' : '</label>'}${tag === 'textarea' ? '</label>' : ''}`;
  // bind: nájde input v kontajneri podľa poradia a nastaví handler
  function bind(root, sel, fn) { root.querySelectorAll(sel).forEach((n, i) => n.addEventListener('input', () => { fn(n.value, i); save(); })); }
  function btn(root, sel, fn) { root.querySelectorAll(sel).forEach((n, i) => n.addEventListener('click', () => fn(i))); }

  function renderAdmin(openIds) {
    const a = $('#A');
    const open = openIds || [...a.querySelectorAll('details')].map(d => d.open);
    a.replaceChildren();

    const bar = el('div', 'adm-bar', `
      <button class="btn primary" id="exp">Exportovať JSON</button>
      <button class="btn" id="imp">Importovať JSON</button>
      <button class="btn danger" id="rst">Obnoviť predvolené</button>
      <input type="file" id="file" accept="application/json" hidden>`);
    a.append(bar, el('p', 'note', 'Zmeny sa ukladajú automaticky v tomto zariadení. Export ti dá zálohu, ktorú môžeš preniesť do iného zariadenia cez Import.'));

    let n = 0;
    const sec = (title, sub, html) => acc(title, sub, html, open[n++]);

    // --- V ---
    const V = db.vyznavanie;
    const vIntro = sec('Vyznávanie – úvodný text', '', fld('Nadpis', 'input', V.uvod.nadpis) + fld('Text (odseky oddeľ prázdnym riadkom)', 'textarea', V.uvod.text.join('\n\n'), 9));
    bind(vIntro, 'input', x => V.uvod.nadpis = x);
    bind(vIntro, 'textarea', x => V.uvod.text = blocks(x));
    a.append(vIntro);

    const vCats = sec('Vyznávanie – kategórie', V.kategorie.length, V.kategorie.map(k => `<div class="tr-edit">${fld('Názov', 'input', k.nazov)}${fld('Text', 'textarea', k.text.join('\n\n'), 5)}<div class="row-actions"><button class="btn small danger" data-del>Zmazať</button></div></div>`).join('') + `<button class="btn" id="addV">+ Pridať kategóriu</button>`);
    bind(vCats, 'input', (x, i) => V.kategorie[i].nazov = x);
    bind(vCats, 'textarea', (x, i) => V.kategorie[i].text = blocks(x));
    btn(vCats, '[data-del]', i => { if (confirm('Zmazať kategóriu?')) { V.kategorie.splice(i, 1); save(); renderAdmin(); } });
    btn(vCats, '#addV', () => { V.kategorie.push({ nazov: 'Nová kategória', text: [''] }); save(); renderAdmin(); });
    a.append(vCats);

    // --- R ---
    a.append(el('div', 'section-label', 'Rémy – verše'));
    db.remy.forEach((x, vi) => {
      const keys = Object.keys(x.preklady);
      const d = sec(`<span class="ref">${esc(x.ref)}</span>`, keys.length + ' prekl.',
        fld('Odkaz (napr. Ján 3,16)', 'input', x.ref) +
        keys.map(k => `<div class="tr-edit">${fld('Preklad (skratka)', 'input', k)}${fld('Text', 'textarea', x.preklady[k], 3)}<div class="row-actions"><button class="btn small danger" data-deltr>Zmazať preklad</button></div></div>`).join('') +
        `<label class="fld"><span>Pridať preklad</span><select data-pick>${PREKLADY.filter(p => !(p.id in x.preklady)).map(p => `<option value="${esc(p.id)}">${esc(p.nazov)}</option>`).join('')}<option value="">Vlastný…</option></select></label>` +
        `<div class="row-actions"><button class="btn small" data-addtr>+ Preklad</button></div>` +
        `<div class="section-label">Strong (hebrejčina / gréčtina)</div>` +
        (x.strong || []).map(s => `<div class="tr-edit st-edit">${fld('Číslo (napr. G26, H430)', 'input', s.cislo)}${fld('Pôvodné slovo', 'input', s.slovo)}${fld('Prepis', 'input', s.prepis)}${fld('Význam EN', 'input', s.en)}${fld('Význam SK', 'input', s.sk)}<div class="row-actions"><button class="btn small danger" data-delst>Zmazať</button></div></div>`).join('') +
        `<div class="row-actions"><button class="btn small" data-addst>+ Strong</button><button class="btn small danger" data-delv>Zmazať verš</button></div>`);
      const refInp = d.querySelector('.fld input');
      refInp.addEventListener('input', () => { x.ref = refInp.value; save(); });
      const names = [...d.querySelectorAll('.tr-edit:not(.st-edit) .fld:first-child input')], texts = [...d.querySelectorAll('.tr-edit textarea')];
      if (!x.strong) x.strong = [];
      d.querySelectorAll('.st-edit').forEach((box, si) => ['cislo', 'slovo', 'prepis', 'en', 'sk'].forEach((f, fi) =>
        box.querySelectorAll('input')[fi].addEventListener('input', e => { x.strong[si][f] = e.target.value; save(); })));
      btn(d, '[data-delst]', i => { x.strong.splice(i, 1); save(); renderAdmin(); });
      btn(d, '[data-addst]', () => { x.strong.push({ cislo: '', slovo: '', prepis: '', en: '', sk: '' }); save(); renderAdmin(); });
      // názvy prekladov: premenovanie až po opustení poľa (zachová poradie)
      names.forEach((inp, i) => inp.addEventListener('change', () => {
        const old = keys[i], neu = inp.value.trim() || old;
        x.preklady = Object.fromEntries(Object.entries(x.preklady).map(([k, t]) => [k === old ? neu : k, t]));
        save(); renderAdmin();
      }));
      texts.forEach((t, i) => t.addEventListener('input', () => { x.preklady[keys[i]] = t.value; save(); }));
      btn(d, '[data-deltr]', i => { delete x.preklady[keys[i]]; save(); renderAdmin(); });
      btn(d, '[data-addtr]', () => { let k = d.querySelector('[data-pick]').value || 'Nový', c = 1; while (k in x.preklady) k = 'Nový ' + (++c); x.preklady[k] = ''; save(); renderAdmin(); });
      btn(d, '[data-delv]', () => { if (confirm('Zmazať verš ' + x.ref + '?')) { db.remy.splice(vi, 1); save(); renderAdmin(); } });
      a.append(d);
    });
    const addR = el('button', 'btn', '+ Pridať verš'); addR.style.marginBottom = '14px';
    addR.onclick = () => { db.remy.push({ ref: 'Nový verš', strong: [], preklady: Object.fromEntries(PREKLADY.filter(p => p.zaklad).map(p => [p.id, ''])) }); save(); renderAdmin(); };
    a.append(addR);

    // --- M ---
    a.append(el('div', 'section-label', 'Modlitby – kategórie'));
    db.modlitby.forEach((k, i) => {
      const d = sec(esc(k.nazov), k.slova.length, fld('Názov kategórie', 'input', k.nazov) + fld('Slová / spojenia (každé na nový riadok)', 'textarea', k.slova.join('\n'), 7) + `<div class="row-actions"><button class="btn small danger" data-del>Zmazať kategóriu</button></div>`);
      bind(d, 'input', x => k.nazov = x);
      bind(d, 'textarea', x => k.slova = lines(x));
      btn(d, '[data-del]', () => { if (confirm('Zmazať kategóriu ' + k.nazov + '?')) { db.modlitby.splice(i, 1); save(); renderAdmin(); } });
      a.append(d);
    });
    const addM = el('button', 'btn', '+ Pridať kategóriu');
    addM.onclick = () => { db.modlitby.push({ nazov: 'Nová kategória', slova: [] }); save(); renderAdmin(); };
    a.append(addM);

    // export / import / reset
    $('#exp', a).onclick = () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }));
      const l = el('a'); l.href = url; l.download = 'modlitby-data.json'; l.click(); URL.revokeObjectURL(url);
    };
    $('#imp', a).onclick = () => $('#file', a).click();
    $('#file', a).onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => {
        const d = JSON.parse(t);
        if (!d.vyznavanie || !Array.isArray(d.remy) || !Array.isArray(d.modlitby)) throw 0;
        db = d; save(); renderAdmin();
      }).catch(() => alert('Neplatný súbor.'));
    };
    $('#rst', a).onclick = () => { if (confirm('Zahodiť všetky úpravy a vrátiť predvolený obsah?')) { db = defaults(); try { localStorage.removeItem(KEY); } catch (e) {} renderPublic(); renderAdmin(); } };
  }

  renderPublic(); renderAdmin([]);

  // ===== záložky =====
  const names = { V: 'Vyznávanie', R: 'Rémy', M: 'Modlitby', A: 'Správa' };
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

  // ===== deň / noc =====
  $('#themeBtn').onclick = () => {
    const root = document.documentElement;
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    $('meta[name=theme-color]').content = t === 'dark' ? '#101216' : '#f6f5f1';
    try { localStorage.setItem('modlitby-tema', t); } catch (e) {}
  };
})();

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = arr => arr.map(t => `<p>${esc(t)}</p>`).join('');
  const KEY = 'modlitby-data';
  const MHINT = 'Klikni na položku, aby si ju označil ako dnes pomodlenú. Podržaním kategórie upravíš aj poradie jej položiek.';

  // ===== dáta: predvolené (data.js) alebo upravené v Správe (localStorage) =====
  const defaults = () => JSON.parse(JSON.stringify({ vyznavanie: VYZNAVANIE, remy: REMY, modlitby: MODLITBY, reminders: [] }));
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!db || !db.vyznavanie || !db.remy || !db.modlitby) db = defaults();
  if (!Array.isArray(db.reminders)) db.reminders = [];
  let saveMsg = '';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { alert('Uloženie zlyhalo (úložisko je plné alebo blokované).'); } renderPublic(); };

  function acc(title, sub, bodyHtml, open, preview) {
    const d = el('details', 'card acc');
    if (open) d.open = true;
    d.innerHTML = `<summary><span class="s-main"><span class="s-title">${title}</span>${preview ? `<span class="s-prev">${esc(preview)}</span>` : ''}</span>${sub ? `<span class="sub">${sub}</span>` : ''}</summary><div class="body">${bodyHtml}</div>`;
    return d;
  }

  // plynulé rozbaľovanie / zbaľovanie
  document.addEventListener('click', e => {
    const s = e.target.closest('details.acc > summary');
    if (!s) return;
    e.preventDefault();
    const d = s.parentNode, body = d.querySelector('.body');
    if (d.classList.contains('lead')) try { localStorage.setItem('modlitby-lead', d.open ? 'closed' : 'open'); } catch (e) {}
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { d.open = !d.open; return; }
    const opts = { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' };
    if (d.open) {
      const h = body.offsetHeight;
      body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], opts).onfinish = () => { d.open = false; };
    } else {
      d.open = true;
      body.animate([{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }], opts);
    }
  });

  // označenie slov v Modlitbách (platí na dnešný deň)
  const today = new Date().toISOString().slice(0, 10);
  let done = {};
  try { const o = JSON.parse(localStorage.getItem('modlitby-done')); if (o && o.d === today) done = o.s; } catch (e) {}
  const saveDone = () => { try { localStorage.setItem('modlitby-done', JSON.stringify({ d: today, s: done })); } catch (e) {} };

  // ===== odkaz na verš -> adresy zdrojov =====
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  function parseRef(ref) {
    const m = ref.match(/^\s*([1-3])?\s*\.?\s*([^\d]+?)\s*(\d+)\s*[,:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*$/);
    if (!m) return null;
    const num = +(m[1] || 0), name = norm(m[2]);
    if (name.length < 2) return null;
    if (num >= 1 && num <= 5 && name.startsWith('mojzis')) return { idx: num - 1, slug: KNIHY[num - 1][1], en: KNIHY[num - 1][2], ch: m[3], v: m[4], v2: m[5] };
    const hit = KNIHY.find(k => (k[0] === num || (!num && !k[0])) && k[3].some(x => name === x || (name.length >= 3 && x.startsWith(name)))) ||
      KNIHY.find(k => k[0] === num && k[3].some(x => name === x));
    if (!hit) return null;
    return { idx: KNIHY.indexOf(hit), slug: hit[1], en: hit[2], ch: m[3], v: m[4], v2: m[5] };
  }
  function findUrl(id, ref) {
    const p = parseRef(ref), name = (PREKLADY.find(t => t.id === id) || {}).nazov || id;
    if (p && ZDROJE[id]) return ZDROJE[id].replace('{q}', encodeURIComponent(`${p.en} ${p.ch}:${p.v}${p.v2 ? '-' + p.v2 : ''}`));
    return 'https://www.google.com/search?q=' + encodeURIComponent(`${ref} ${name} biblia`);
  }
  function strongUrl(ref) {
    const p = parseRef(ref);
    return p ? ZDROJ_STRONG.replace('{slug}', p.slug).replace('{ch}', p.ch).replace('{v}', p.v) : 'https://www.google.com/search?q=' + encodeURIComponent(ref + ' strong interlinear');
  }

  // ===== texty prekladov v appke (vstavané + importované) =====
  const cache = {}, imported = new Set();
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open('modlitby-biblie', 1); r.onupgradeneeded = () => r.result.createObjectStore('b'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbOp = (mode, fn) => idb().then(db => new Promise((res, rej) => { const t = db.transaction('b', mode), rq = fn(t.objectStore('b')); t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); }));
  idbOp('readonly', s => s.getAllKeys()).then(k => (k || []).forEach(x => imported.add(x))).catch(() => {});
  const hasLocal = id => imported.has(id) || !!(PREKLADY.find(p => p.id === id) || {}).lokalny;
  function loadBible(id) {
    if (!cache[id]) cache[id] = (imported.has(id)
      ? idbOp('readonly', s => s.get(id))
      : fetch('biblie/' + id.toLowerCase() + '.json').then(r => { if (!r.ok) throw 0; return r.json(); })).catch(() => { delete cache[id]; return null; });
    return cache[id];
  }
  async function lookup(id, ref) {
    const p = parseRef(ref); if (!p || !hasLocal(id)) return null;
    const b = await loadBible(id); const ch = b && b[p.idx] && b[p.idx][+p.ch - 1]; if (!ch) return null;
    const v1 = +p.v, v2 = +(p.v2 || p.v); if (v2 < v1 || v2 > ch.length) return null;
    return ch.slice(v1 - 1, v2).join(' ');
  }
  // Strongove čísla: slovník + čísla slov v každom verši (STEPBible, Open Scriptures)
  const sCache = {};
  const getJson = u => (sCache[u] = sCache[u] || fetch(u).then(r => { if (!r.ok) throw 0; return r.json(); }).catch(() => { delete sCache[u]; return null; }));
  async function strongFor(ref) {
    const p = parseRef(ref); if (!p) return [];
    const [book, lex] = await Promise.all([getJson('strong/b' + p.idx + '.json'), getJson('strong/lex.json')]);
    const ch = book && book[+p.ch - 1]; if (!ch || !lex) return [];
    const seen = new Set(), out = [];
    for (let v = +p.v; v <= +(p.v2 || p.v); v++) (ch[v - 1] || []).forEach(n => {
      const k = (n > 0 ? 'G' : 'H') + Math.abs(n), e = lex[k];
      if (seen.has(k) || !e) return; seen.add(k);
      out.push({ cislo: k, slovo: e[0], prepis: e[1], en: e[2].replace(/\.$/, ''), sk: '' });
    });
    return out.slice(0, 60);
  }
  // doplní prázdne preklady a Strong verša, ktoré máme v appke; vráti počet doplnených položiek
  async function autoFill(x) {
    let n = 0;
    if (!(x.strong || []).some(s => s.cislo || s.slovo)) { const s = await strongFor(x.ref); if (s.length) { x.strong = s; n += s.length; } }
    for (const id of Object.keys(x.preklady)) {
      if (x.preklady[id].trim() || !hasLocal(id)) continue;
      const t = await lookup(id, x.ref); if (t) { x.preklady[id] = t; n++; }
    }
    return n;
  }
  const newVerse = ref => ({ ref, strong: [], preklady: Object.fromEntries(PREKLADY.filter(p => p.zaklad || p.lokalny).map(p => [p.id, ''])) });
  // Zefania XML alebo JSON -> [kniha][kapitola][verš]
  function parseBible(text) {
    const out = Array.from({ length: 66 }, () => []);
    if (text.trim()[0] === '<') {
      const xml = new DOMParser().parseFromString(text, 'text/xml');
      xml.querySelectorAll('BIBLEBOOK').forEach(b => { const bi = +b.getAttribute('bnumber') - 1; if (!out[bi]) return;
        b.querySelectorAll('CHAPTER').forEach(c => { out[bi][+c.getAttribute('cnumber') - 1] = [...c.querySelectorAll('VERS')].map(v => v.textContent.trim()); }); });
    } else {
      const j = JSON.parse(text);
      if (Array.isArray(j)) return j;
      (j.books || []).forEach((b, bi) => { out[bi] = (b.chapters || []).map(c => (c.verses || []).map(v => (v.text || '').trim())); });
    }
    if (out.filter(b => b.length).length < 27) throw new Error('málo kníh');
    return out;
  }

  // ===== push notifikácie (pripomienky) =====
  const b64 = s => { const r = atob((s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...r].map(c => c.charCodeAt(0))); };
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const post = (act, body) => fetch(`${PUSH_API}?a=${act}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
  async function pushInfo() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return { state: isIOS && !standalone ? 'ios-install' : 'unsupported' };
    const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription();
    return { state: sub ? 'on' : Notification.permission === 'denied' ? 'denied' : 'off', reg, sub };
  }
  let syncT;
  const pushSync = () => { clearTimeout(syncT); syncT = setTimeout(async () => { try { const i = await pushInfo(); if (i.sub) await post('sub', { subscription: i.sub.toJSON(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone, reminders: db.reminders }); } catch (e) {} }, 700); };
  async function pushEnable() {
    const i = await pushInfo(); if (!i.reg) throw new Error('Tento prehliadač push notifikácie nepodporuje.');
    if (await Notification.requestPermission() !== 'granted') throw new Error('Oznámenia nie sú povolené. Povoľ ich v nastaveniach prehliadača alebo telefónu.');
    const { publicKey } = await fetch(`${PUSH_API}?a=key`).then(r => r.json());
    const sub = i.sub || await i.reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(publicKey) });
    const r = await post('sub', { subscription: sub.toJSON(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone, reminders: db.reminders });
    if (!r.ok) throw new Error('Server odber neprijal (' + (r.error || 'chyba') + ').');
  }
  async function pushDisable() { const i = await pushInfo(); if (i.sub) { await post('unsub', { endpoint: i.sub.endpoint }).catch(() => {}); await i.sub.unsubscribe(); } }

  // ===== formátovaný text (editor + bezpečné čistenie HTML) =====
  const OK_TAGS = new Set(['STRONG', 'EM', 'U', 'P', 'BR', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR']);
  const TAG_MAP = { DIV: 'P', B: 'STRONG', I: 'EM', H1: 'H2', H4: 'H3', H5: 'H3', H6: 'H3' };
  function clean(html) {
    const t = document.createElement('template'); t.innerHTML = html || '';
    const out = document.createElement('div');
    (function walk(src, dst) {
      src.childNodes.forEach(n => {
        if (n.nodeType === 3) { dst.append(n.textContent); return; }
        if (n.nodeType !== 1 || /^(SCRIPT|STYLE|IFRAME|OBJECT)$/.test(n.tagName)) return;
        if (n.tagName === 'SPAN') {  // tučné / kurzíva z vloženého textu
          let d = dst; const s = n.style;
          if (s.fontWeight === 'bold' || +s.fontWeight >= 600) { const e = document.createElement('strong'); d.append(e); d = e; }
          if (s.fontStyle === 'italic') { const e = document.createElement('em'); d.append(e); d = e; }
          walk(n, d); return;
        }
        const tag = TAG_MAP[n.tagName] || n.tagName;
        if (!OK_TAGS.has(tag) || (tag === 'P' && n.querySelector('ul,ol,blockquote,h2,h3,hr,p,div'))) { walk(n, dst); return; }
        const e = document.createElement(tag); dst.append(e);
        if (tag !== 'BR' && tag !== 'HR') walk(n, e);
      });
    })(t.content, out);
    out.querySelectorAll('p').forEach(p => { if (!p.childNodes.length) p.remove(); });
    return out.innerHTML;
  }
  const htmlOf = o => o.html != null ? clean(o.html) : (o.text || []).map(t => `<p>${esc(t)}</p>`).join('');
  const plainOf = h => { const d = document.createElement('div'); d.innerHTML = h; return [...d.children].map(c => c.textContent.trim()).filter(Boolean); };
  function richEditor(html, onChange) {
    const wrap = el('div', 'rte');
    const tools = [['bold', '<b>B</b>', 'Tučné'], ['italic', '<i>I</i>', 'Kurzíva'], ['underline', '<u>U</u>', 'Podčiarknuté'], '|',
      ['h2', 'Nadpis', 'Veľký nadpis'], ['h3', 'Podnadpis', 'Malý nadpis'], ['p', '¶', 'Bežný odsek'], '|',
      ['insertUnorderedList', '• Zoznam', 'Odrážky'], ['insertOrderedList', '1. Zoznam', 'Číslovanie'], ['quote', '❝', 'Citát'], ['insertHorizontalRule', '―', 'Oddeľovacia čiara'], '|',
      ['undo', '↶', 'Späť'], ['redo', '↷', 'Znova'], ['removeFormat', 'T×', 'Zrušiť formátovanie']];
    const bar = el('div', 'rte-bar', tools.map(t => t === '|' ? '<span class="sep"></span>' : `<button type="button" data-c="${t[0]}" title="${t[2]}" aria-label="${t[2]}">${t[1]}</button>`).join(''));
    const area = el('div', 'rte-area', clean(htmlOf({ html })) || '<p><br></p>'); area.contentEditable = 'true'; area.spellcheck = true;
    wrap.append(bar, area);
    const changed = () => { if (onChange) onChange(clean(area.innerHTML)); };
    const run = c => {
      area.focus();
      try { document.execCommand('styleWithCSS', false, false); document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) {}
      if (c === 'h2' || c === 'h3' || c === 'quote') {
        const tag = c === 'quote' ? 'blockquote' : c, cur = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        document.execCommand('formatBlock', false, '<' + (cur === tag ? 'p' : tag) + '>');
      } else if (c === 'p') document.execCommand('formatBlock', false, '<p>');
      else document.execCommand(c, false, null);
      changed();
    };
    bar.addEventListener('mousedown', e => e.preventDefault());   // nezruš výber textu
    bar.addEventListener('click', e => { const b = e.target.closest('button'); if (b) run(b.dataset.c); });
    area.addEventListener('input', changed);
    area.addEventListener('paste', e => { e.preventDefault(); const h = e.clipboardData.getData('text/html'), t = e.clipboardData.getData('text/plain'); document.execCommand('insertHTML', false, h ? clean(h) : esc(t).replace(/\n/g, '<br>')); changed(); });
    area.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'b') { e.preventDefault(); run('bold'); } });
    return { el: wrap, getHtml: () => clean(area.innerHTML) };
  }

  // ===== zoraďovanie posúvaním (ťahaním za úchyt ⠿) =====
  function makeSortable(container, itemSel, onDone) {
    container.addEventListener('pointerdown', e => {
      const grip = e.target.closest('.grip'); if (!grip) return;
      const item = grip.closest(itemSel); if (!item || item.parentNode !== container) return;
      e.preventDefault();
      let startY = e.clientY; item.classList.add('drag'); grip.setPointerCapture(e.pointerId);
      const siblings = () => [...container.children].filter(c => c.matches(itemSel));
      const move = ev => {
        item.style.transform = `translateY(${ev.clientY - startY}px)`;
        const r = item.getBoundingClientRect(), mid = r.top + r.height / 2, list = siblings(), i = list.indexOf(item);
        const next = list[i + 1], prev = list[i - 1];
        const swap = (fn) => { item.style.transform = ''; const t0 = item.getBoundingClientRect().top; fn(); startY += item.getBoundingClientRect().top - t0; item.style.transform = `translateY(${ev.clientY - startY}px)`; };
        if (next) { const nr = next.getBoundingClientRect(); if (mid > nr.top + nr.height / 2) return swap(() => container.insertBefore(next, item)); }
        if (prev) { const pr = prev.getBoundingClientRect(); if (mid < pr.top + pr.height / 2) swap(() => container.insertBefore(item, prev)); }
      };
      const up = () => { grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up); item.classList.remove('drag'); item.style.transform = ''; onDone(siblings()); };
      grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
    });
  }

  // ===== verejné záložky =====
  let reorder = false, mOpen = [];
  const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return false; [arr[i], arr[j]] = [arr[j], arr[i]]; return true; };
  function renderPublic() {
    const openState = {};
    ['V', 'R', 'M'].forEach(id => openState[id] = [...document.querySelectorAll(`#${id} details`)].map(d => d.open));
    if (!reorder) mOpen = openState.M;
    const v = $('#V'), r = $('#R'), m = $('#M');
    v.replaceChildren(); r.replaceChildren(); m.replaceChildren();

    const V = db.vyznavanie;
    let leadOpen = true; try { leadOpen = localStorage.getItem('modlitby-lead') !== 'closed'; } catch (e) {}
    if (openState.V.length) leadOpen = openState.V[0];
    const lead = acc(esc(V.uvod.nadpis), '', `<div class="rich">${htmlOf(V.uvod)}</div>`, leadOpen); lead.classList.add('lead'); lead.dataset.edit = 'vi';
    v.append(lead, el('div', 'section-label', 'Kategórie'));
    V.kategorie.forEach((k, i) => { const c = acc(esc(k.nazov), '', `<div class="rich">${htmlOf(k)}</div>`); c.dataset.edit = 'v:' + i; v.append(c); });

    if (!db.remy.length) r.append(el('div', 'empty', 'Zatiaľ žiadne verše. Pridaj ich cez tlačidlo +.'));
    db.remy.forEach((x, xi) => {
      const keys = Object.keys(x.preklady).filter(k => x.preklady[k].trim());
      const preview = keys.length ? x.preklady[keys[0]] : '';
      let body = keys.map(k => `<div class="tr"><b>${esc(k)}</b>${esc(x.preklady[k])}</div>`).join('');
      const st = (x.strong || []).filter(s => s.cislo || s.slovo);
      if (st.length) body += `<div class="section-label">Strong</div>` + st.map(s => `<div class="tr"><b>${esc(s.cislo)}</b><span class="orig">${esc(s.slovo)}</span> ${s.prepis ? `<i>${esc(s.prepis)}</i>` : ''}${s.en ? `<br>EN: ${esc(s.en)}` : ''}${s.sk ? `<br>SK: ${esc(s.sk)}` : ''}</div>`).join('');
      if (!body) body = '<p class="empty">Zatiaľ bez textu.</p>';
      const rc = acc(`<span class="ref">${esc(x.ref)}</span>`, keys.length + ' prekl.', body, false, preview); rc.dataset.edit = 'r:' + xi; r.append(rc);
    });
    if (db.remy.length) r.append(el('p', 'credit', 'Texty: KJV, Bible kralická (verejné). Strong: STEPBible.org (CC BY 4.0), Open Scriptures (CC BY-SA).'));

    if (db.modlitby.length) {
      const bar = el('div', 'm-bar', `<span class="hint">${esc(reorder ? 'Kategórie zoradíš posúvaním za ⠿ alebo šípkami.' : (db.mHint == null ? MHINT : db.mHint))}</span><button class="btn small${reorder ? ' primary' : ''}" id="reBtn">${reorder ? 'Hotovo' : '⇅ Zoradiť'}</button>`);
      m.append(bar);
      $('#reBtn', bar).onclick = () => { if (!reorder) mOpen = [...document.querySelectorAll('#M details')].map(d => d.open); reorder = !reorder; renderPublic(); };
    }
    if (reorder) {
      const list = el('div', 'rlist');
      db.modlitby.forEach((k, ki) => {
        list.append(el('div', 'card rcard', `<span class="grip" aria-label="Presunúť">⠿</span><b class="rname">${esc(k.nazov)}</b><span class="sub">${k.slova.length}</span><span class="mvb"><button data-mv="${ki}:-1"${ki === 0 ? ' disabled' : ''} aria-label="Hore">▲</button><button data-mv="${ki}:1"${ki === db.modlitby.length - 1 ? ' disabled' : ''} aria-label="Dole">▼</button></span>`));
        list.lastChild.dataset.i = ki;
      });
      m.append(list);
      makeSortable(list, '.rcard', items => { const old = db.modlitby.slice(); db.modlitby = items.map(x => old[+x.dataset.i]); save(); renderAdmin(); });
      m.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => { const [ki, d] = b.dataset.mv.split(':'); if (move(db.modlitby, +ki, +d)) { save(); renderAdmin(); } });
    } else db.modlitby.forEach((k, ki) => {
      const rows = k.slova.map((s, si) => `<div class="wrow${done[k.nazov + '|' + s] ? ' on' : ''}" data-k="${esc(k.nazov + '|' + s)}" data-edit="c:${ki}:${si}"><span class="wmark"></span><span class="wtxt">${esc(s)}</span></div>`).join('');
      const body = `<div class="wlist">${rows}</div><button class="wadd" data-add="${ki}">＋ Pridať</button>`;
      const mc = acc(esc(k.nazov), k.slova.length, body); mc.dataset.edit = 'm:' + ki; m.append(mc);
    });
    m.querySelectorAll('.wrow[data-k]').forEach(c => c.onclick = () => { c.classList.toggle('on'); if (c.classList.contains('on')) done[c.dataset.k] = 1; else delete done[c.dataset.k]; saveDone(); });
    m.querySelectorAll('.wadd').forEach(b => b.onclick = () => quickAdd(+b.dataset.add));

    ['V', 'R', 'M'].forEach(id => document.querySelectorAll(`#${id} details`).forEach((d, i) => { if ((id === 'M' ? mOpen : openState[id])[i]) d.open = true; }));
  }

  // ===== Správa (backend) =====
  const lines = s => s.split('\n').map(x => x.trim()).filter(Boolean);
  const blocks = s => s.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  const fld = (label, tag, val, rows) => `<label class="fld"><span>${label}</span><${tag}${rows ? ` rows="${rows}"` : ''}${tag === 'input' ? ` value="${esc(val)}"` : ''}>${tag === 'textarea' ? esc(val) : ''}${tag === 'textarea' ? '</textarea>' : '</label>'}${tag === 'textarea' ? '</label>' : ''}`;
  // bind: nájde input v kontajneri podľa poradia a nastaví handler
  function bind(root, sel, fn) { root.querySelectorAll(sel).forEach((n, i) => n.addEventListener('input', () => { fn(n.value, i); save(); })); }
  function btn(root, sel, fn) { root.querySelectorAll(sel).forEach((n, i) => n.addEventListener('click', () => fn(i))); }

  // ===== Správa: zoznam nastavení =====
  let adminPage = null;   // null = hlavný zoznam, inak id podstránky
  const ICONS = {
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20',
    layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    quote: 'M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6',
    heart: 'M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z',
    type: 'M4 7V4h16v3M9 20h6M12 4v16',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
    globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    archive: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5'
  };
  const ico = (n, c) => `<span class="sico" style="--c:${c}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg></span>`;
  const pl = (n, f) => n + ' ' + (n === 1 ? f[0] : n >= 2 && n <= 4 ? f[1] : f[2]);
  const srow = (id, icon, color, title, sub, danger) => `<button type="button" class="srow${danger ? ' danger' : ''}" data-p="${id}">${ico(icon, color)}<span class="stxt"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="chev"></span></button>`;
  const PAGE_TITLE = { vintro: 'Vyznávanie – úvod', vcats: 'Vyznávanie – kategórie', remy: 'Rémy – verše', mcats: 'Modlitby – kategórie', mhint: 'Modlitby – text pod nadpisom', push: 'Pripomienky', prekl: 'Preklady v appke', backup: 'Záloha a obnova', about: 'O aplikácii' };

  function renderAdmin(openIds) {
    const a = $('#A');
    const open = openIds || [...a.querySelectorAll('details')].map(d => d.open);
    a.replaceChildren();
    const goto = p => { adminPage = p; renderAdmin([]); scrollTo(0, 0); };

    // ---------- hlavný zoznam ----------
    if (adminPage == null) {
      const V = db.vyznavanie;
      const hint = db.mHint == null ? MHINT : db.mHint;
      a.append(el('div', 'sgroup-label', 'Obsah'));
      a.append(el('div', 'sgroup',
        srow('vintro', 'book', '#c28a3a', 'Vyznávanie – úvod', V.uvod.nadpis) +
        srow('vcats', 'layers', '#d98a4a', 'Vyznávanie – kategórie', pl(V.kategorie.length, ['kategória', 'kategórie', 'kategórií'])) +
        srow('remy', 'quote', '#5b8def', 'Rémy – verše', pl(db.remy.length, ['verš', 'verše', 'veršov'])) +
        srow('mcats', 'heart', '#d0607e', 'Modlitby – kategórie', pl(db.modlitby.length, ['kategória', 'kategórie', 'kategórií'])) +
        srow('mhint', 'type', '#8b6fe0', 'Modlitby – text pod nadpisom', hint ? hint.slice(0, 40) + (hint.length > 40 ? '…' : '') : 'Skrytý')));
      a.append(el('div', 'sgroup-label', 'Aplikácia'));
      const pushRow = el('div', 'sgroup',
        srow('push', 'bell', '#4fae7b', 'Pripomienky', 'Notifikácie · ' + pl(db.reminders.length, ['pripomienka', 'pripomienky', 'pripomienok'])) +
        srow('prekl', 'globe', '#3bb0b5', 'Preklady v appke', 'KJV, Kralická' + (imported.size ? ' + ' + imported.size + ' importované' : '')));
      a.append(pushRow);
      a.append(el('div', 'sgroup-label', 'Údaje'));
      a.append(el('div', 'sgroup',
        srow('backup', 'archive', '#8a8f9c', 'Záloha a obnova', 'Export, import, obnovenie predvolených') +
        srow('about', 'info', '#6f7fa3', 'O aplikácii', 'Zdroje a licencie')));
      a.append(el('p', 'note', 'Zmeny sa ukladajú automaticky v tomto zariadení.'));
      a.onclick = e => { const b = e.target.closest('[data-p]'); if (b) goto(b.dataset.p); };
      return;
    }

    // ---------- podstránka ----------
    a.onclick = null;
    const head = el('div', 'spage-head', `<button type="button" class="back" aria-label="Späť"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><span>Správa</span></button><h2>${esc(PAGE_TITLE[adminPage])}</h2>`);
    head.querySelector('.back').onclick = () => goto(null);
    a.append(head);
    const root = el('div', 'spage'); a.append(root);
    let n = 0;
    const sec = (title, sub, html) => acc(title, sub, html, open[n++]);

    if (adminPage === 'vintro') {
    const V = db.vyznavanie;
    const vIntro = el('div', 'card pad', fld('Nadpis', 'input', V.uvod.nadpis) + '<div class="fld"><span>Text</span><div class="rte-host"></div></div>');
    bind(vIntro, 'input', x => V.uvod.nadpis = x);
    vIntro.querySelector('.rte-host').append(richEditor(htmlOf(V.uvod), h => { V.uvod.html = h; V.uvod.text = plainOf(h); save(); }).el);
    root.append(vIntro);

    }
    if (adminPage === 'vcats') {
    const V = db.vyznavanie;
    const vCats = el('div', 'card pad', V.kategorie.map(k => `<div class="tr-edit">${fld('Názov', 'input', k.nazov)}<div class="fld"><span>Text</span><div class="rte-host"></div></div><div class="row-actions"><button class="btn small danger" data-del>Zmazať</button></div></div>`).join('') + `<button class="btn" id="addV">+ Pridať kategóriu</button>`);
    bind(vCats, 'input', (x, i) => V.kategorie[i].nazov = x);
    vCats.querySelectorAll('.rte-host').forEach((h, i) => h.append(richEditor(htmlOf(V.kategorie[i]), x => { V.kategorie[i].html = x; V.kategorie[i].text = plainOf(x); save(); }).el));
    btn(vCats, '[data-del]', i => { if (confirm('Zmazať kategóriu?')) { V.kategorie.splice(i, 1); save(); renderAdmin(); } });
    btn(vCats, '#addV', () => { V.kategorie.push({ nazov: 'Nová kategória', text: [''] }); save(); renderAdmin(); });
    root.append(vCats);

    }
    if (adminPage === 'remy') {
    db.remy.forEach((x, vi) => {
      const keys = Object.keys(x.preklady);
      const d = sec(`<span class="ref">${esc(x.ref)}</span>`, keys.length + ' prekl.',
        fld('Odkaz (napr. Ján 3,16)', 'input', x.ref) +
        keys.map(k => `<div class="tr-edit">${fld('Preklad (skratka)', 'input', k)}${fld('Text', 'textarea', x.preklady[k], 3)}<div class="row-actions"><a class="btn small" data-find target="_blank" rel="noopener">Nájsť ↗</a><button class="btn small danger" data-deltr>Zmazať preklad</button></div></div>`).join('') +
        `<label class="fld"><span>Pridať preklad</span><select data-pick>${PREKLADY.filter(p => !(p.id in x.preklady)).map(p => `<option value="${esc(p.id)}">${esc(p.nazov)}</option>`).join('')}<option value="">Vlastný…</option></select></label>` +
        `<div class="row-actions"><button class="btn small" data-addtr>+ Preklad</button><button class="btn small" data-auto>⟳ Doplniť z appky</button></div>` +
        `<div class="section-label">Strong (hebrejčina / gréčtina)</div><div class="row-actions"><a class="btn small" data-findst target="_blank" rel="noopener">Nájsť Strong (BibleHub) ↗</a></div>` +
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
      const refresh = () => { d.querySelectorAll('[data-find]').forEach((l, i) => l.href = findUrl(keys[i], x.ref)); d.querySelector('[data-findst]').href = strongUrl(x.ref); };
      refresh(); refInp.addEventListener('input', refresh);
      texts.forEach((t, i) => t.addEventListener('input', () => { x.preklady[keys[i]] = t.value; save(); }));
      btn(d, '[data-deltr]', i => { delete x.preklady[keys[i]]; save(); renderAdmin(); });
      btn(d, '[data-addtr]', async () => { let k = d.querySelector('[data-pick]').value || 'Nový', c = 1; while (k in x.preklady) k = 'Nový ' + (++c); x.preklady[k] = ''; await autoFill(x); save(); renderAdmin(); });
      btn(d, '[data-auto]', async () => { const n = await autoFill(x); if (!n) alert('Nič sa nedoplnilo. Skontroluj odkaz (napr. „Ján 3,16“) a či je preklad v appke (KJV, Kralická alebo importovaný).'); save(); renderAdmin(); });
      btn(d, '[data-delv]', () => { if (confirm('Zmazať verš ' + x.ref + '?')) { db.remy.splice(vi, 1); save(); renderAdmin(); } });
      root.append(d);
    });
    const addR = el('button', 'btn', '+ Pridať verš'); addR.style.marginBottom = '14px';
    addR.onclick = () => { db.remy.push(newVerse('Nový verš')); save(); renderAdmin(); };
    root.append(addR);

    }
    if (adminPage === 'mhint') {
    const hintSec = el('div', 'card pad', `${fld('Text (prázdny = nezobrazí sa)', 'textarea', db.mHint == null ? MHINT : db.mHint, 4)}<div class="row-actions"><button class="btn small" data-hint-reset>Obnoviť pôvodný text</button></div>`);
    hintSec.querySelector('textarea').addEventListener('input', e => { db.mHint = e.target.value; save(); });
    $('[data-hint-reset]', hintSec).onclick = () => { delete db.mHint; save(); renderAdmin(); };
    root.append(hintSec);
    }
    if (adminPage === 'mcats') {
    db.modlitby.forEach((k, i) => {
      const d = sec(esc(k.nazov), k.slova.length, fld('Názov kategórie', 'input', k.nazov) + fld('Slová / spojenia (každé na nový riadok)', 'textarea', k.slova.join('\n'), 7) + `<div class="row-actions"><button class="btn small danger" data-del>Zmazať kategóriu</button></div>`);
      bind(d, 'input', x => k.nazov = x);
      bind(d, 'textarea', x => k.slova = lines(x));
      btn(d, '[data-del]', () => { if (confirm('Zmazať kategóriu ' + k.nazov + '?')) { db.modlitby.splice(i, 1); save(); renderAdmin(); } });
      root.append(d);
    });
    const addM = el('button', 'btn', '+ Pridať kategóriu');
    addM.onclick = () => { db.modlitby.push({ nazov: 'Nová kategória', slova: [] }); save(); renderAdmin(); };
    root.append(addM);
    }
    if (adminPage === 'prekl') {
    const stat = PREKLADY.map(p => `<div class="tr"><b>${esc(p.id)}</b>${esc(p.nazov)} – ${p.lokalny ? 'vstavaný' : imported.has(p.id) ? 'importovaný' : 'zatiaľ nie je (vkladáš ručne alebo importuj)'}</div>`).join('');
    const imp = el('div', 'card pad', `<p class="note">Vyber súbor s Bibliou (Zefania XML alebo JSON). Uloží sa len v tomto zariadení a potom sa verše doplnia automaticky.</p>${stat}<label class="fld" style="margin-top:12px"><span>Pre preklad</span><select id="impId">${PREKLADY.filter(p => !p.lokalny).map(p => `<option value="${esc(p.id)}">${esc(p.nazov)}</option>`).join('')}</select></label><div class="row-actions"><button class="btn small primary" id="impBible">Vybrať súbor</button><input type="file" id="impFile" accept=".xml,.json,text/xml,application/json" hidden></div>`);
    root.append(imp);
    $('#impBible', imp).onclick = () => $('#impFile', imp).click();
    $('#impFile', imp).onchange = async e => {
      const f = e.target.files[0]; if (!f) return; const id = $('#impId', imp).value;
      try { const data = parseBible(await f.text()); await idbOp('readwrite', s => s.put(data, id)); imported.add(id); delete cache[id]; alert('Preklad ' + id + ' je v appke. Doplň verše tlačidlom „Doplniť z appky“.'); renderAdmin(); }
      catch (err) { alert('Súbor sa nepodarilo načítať: ' + (err.message || 'neplatný formát')); }
    };

    }
    if (adminPage === 'push') {
    const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
    const remRow = r => `<div class="tr-edit rem" data-id="${esc(r.id)}"><div class="rem-top"><input type="time" value="${esc(r.t)}"><button type="button" class="x" data-rdel aria-label="Zmazať">×</button></div>${fld('Nadpis', 'input', r.title || '').replace('<input', '<input data-f="title" placeholder="Čas na modlitbu"')}${fld('Text', 'input', r.body || '').replace('<input', '<input data-f="body" placeholder="Chvíľa pre Boha."')}<div class="days">${DAYS.map((n, i) => `<button type="button" data-d="${i + 1}" class="${(!r.days.length || r.days.includes(i + 1)) ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
    const remSec = el('div', 'card pad', `<p class="note" id="pushNote">Zisťujem stav…</p><div class="row-actions" id="pushBtns"></div><div id="remList">${db.reminders.map(remRow).join('')}</div><div class="row-actions"><button class="btn small" id="remAdd">+ Pridať pripomienku</button></div>`);
    root.append(remSec);
    const note = $('#pushNote', remSec), btns = $('#pushBtns', remSec);
    const msg = {
      'ios-install': 'Na iPhone fungujú notifikácie len keď appku pridáš na plochu: v Safari ťukni na Zdieľať → Pridať na plochu a otvor ju odtiaľ.',
      unsupported: 'Tento prehliadač push notifikácie nepodporuje.',
      denied: 'Oznámenia sú zablokované. Povoľ ich v nastaveniach prehliadača alebo telefónu pre túto stránku.',
      off: 'Notifikácie sú vypnuté. Zapni ich na tomto zariadení.',
      on: 'Notifikácie sú zapnuté. Pripomienky sa posielajú v nastavených časoch.'
    };
    const paint = async () => {
      let st = 'unsupported'; try { st = (await pushInfo()).state; } catch (e) {}
      note.textContent = msg[st];
      btns.innerHTML = st === 'off' ? '<button class="btn primary small" id="pOn">Zapnúť notifikácie</button>' : st === 'on' ? '<button class="btn small" id="pTest">Poslať skúšobnú</button><button class="btn small danger" id="pOff">Vypnúť</button>' : '';
      const on = $('#pOn', btns), off = $('#pOff', btns), test = $('#pTest', btns);
      if (on) on.onclick = async () => { on.disabled = true; try { await pushEnable(); } catch (e) { alert(e.message); } paint(); };
      if (off) off.onclick = async () => { await pushDisable(); paint(); };
      if (test) test.onclick = async () => { test.disabled = true; try { const i = await pushInfo(); const r = await post('test', { endpoint: i.sub.endpoint }); if (!r.ok) alert('Skúšobná notifikácia sa neodoslala.'); } catch (e) { alert('Server je nedostupný.'); } test.disabled = false; };
    };
    paint();
    const remOf = box => db.reminders.find(r => r.id === box.dataset.id);
    remSec.addEventListener('input', e => { const box = e.target.closest('.rem'); if (!box) return; const r = remOf(box); if (!r) return; if (e.target.type === 'time') r.t = e.target.value || '07:00'; else if (e.target.dataset.f) r[e.target.dataset.f] = e.target.value; save(); pushSync(); });
    remSec.addEventListener('click', e => {
      const box = e.target.closest('.rem'); if (!box) return; const r = remOf(box); if (!r) return;
      if (e.target.closest('[data-rdel]')) { db.reminders = db.reminders.filter(x => x !== r); save(); pushSync(); renderAdmin(); return; }
      const b = e.target.closest('[data-d]'); if (!b) return;
      const set = new Set(r.days.length ? r.days : [1, 2, 3, 4, 5, 6, 7]), d = +b.dataset.d;
      if (set.has(d)) { if (set.size > 1) set.delete(d); } else set.add(d);
      r.days = set.size === 7 ? [] : [...set].sort(); b.classList.toggle('on', set.has(d)); save(); pushSync();
    });
    $('#remAdd', remSec).onclick = () => { db.reminders.push({ id: 'r' + Date.now().toString(36), t: '07:00', title: '', body: '', days: [] }); save(); pushSync(); renderAdmin(); };

    }
    if (adminPage === 'backup') {
      root.append(el('div', 'sgroup',
        srow('exp', 'download', '#5b8def', 'Exportovať údaje', 'Stiahne zálohu ako súbor JSON') +
        srow('imp', 'upload', '#4fae7b', 'Importovať údaje', 'Načíta zálohu zo súboru JSON') +
        srow('rst', 'reset', '#d0446f', 'Obnoviť predvolené', 'Zahodí všetky úpravy', true)),
        el('input', null), el('p', 'note', 'Záloha obsahuje vyznávanie, verše, modlitby a pripomienky. Nahrať ju môžeš aj do appky na inom zariadení.'));
      const fileInp = root.querySelector('input'); fileInp.type = 'file'; fileInp.accept = 'application/json'; fileInp.hidden = true;
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-p]'); if (!b) return;
        if (b.dataset.p === 'exp') {
          const url = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }));
          const l = el('a'); l.href = url; l.download = 'modlitby-data.json'; l.click(); URL.revokeObjectURL(url);
        } else if (b.dataset.p === 'imp') fileInp.click();
        else if (b.dataset.p === 'rst' && confirm('Zahodiť všetky úpravy a vrátiť predvolený obsah?')) { db = defaults(); try { localStorage.removeItem(KEY); } catch (e) {} renderPublic(); renderAdmin([]); }
      });
      fileInp.onchange = e => {
        const f = e.target.files[0]; if (!f) return;
        f.text().then(t => {
          const d = JSON.parse(t);
          if (!d.vyznavanie || !Array.isArray(d.remy) || !Array.isArray(d.modlitby)) throw 0;
          if (!Array.isArray(d.reminders)) d.reminders = [];
          db = d; save(); renderAdmin([]);
        }).catch(() => alert('Neplatný súbor.'));
      };
    }
    if (adminPage === 'about') {
      root.append(el('div', 'card pad about', `
        <p><b>Modlitby</b> – osobná appka na vyznávanie, verše a modlitby.</p>
        <p class="note">Údaje sa ukladajú v tomto zariadení. Server (Supabase) slúži len na posielanie pripomienok a ukladá anonymný odber notifikácií, nie tvoje texty.</p>
        <h3>Zdroje a licencie</h3>
        <ul>
          <li>Texty: King James Version a Bible kralická – verejné texty (zdroj: scrollmapper/bible_databases).</li>
          <li>Strongove čísla: STEPBible.org (CC BY 4.0) a Open Scriptures Strong's dictionary (CC BY-SA).</li>
          <li>Písma: Fraunces a Inter (Google Fonts, SIL Open Font License).</li>
        </ul>`));
    }
  }

  renderPublic(); renderAdmin([]);
  // existujúcim veršom bez Strong ho jednorazovo doplň
  Promise.all(db.remy.filter(x => !(x.strong || []).some(s => s.cislo || s.slovo)).map(async x => { const s = await strongFor(x.ref); if (s.length) { x.strong = s; return 1; } return 0; }))
    .then(r => { if (r.some(Boolean)) { save(); renderAdmin(); } });

  // ===== tlačidlo + (R, M) =====
  const sheet = $('#sheet'), form = $('#sheetForm');
  const closeSheet = () => { sheet.hidden = true; };
  sheet.querySelector('.sheet-bg').onclick = closeSheet;
  function openSheet(html, onSubmit) {
    form.onkeydown = null;
    form.innerHTML = html + `<div class="row-actions"><button class="btn primary" type="submit">Pridať</button><button class="btn" type="button" id="shCancel">Zrušiť</button></div>`;
    $('#shCancel').onclick = closeSheet;
    form.onsubmit = e => { e.preventDefault(); if (onSubmit(new FormData(form)) !== false) closeSheet(); };
    sheet.hidden = false;
    const f = form.querySelector('input,textarea'); if (f) setTimeout(() => f.focus(), 50);
  }
  $('#fab').onclick = () => {
    const tab = document.querySelector('.tabs [aria-selected=true]').dataset.tab;
    if (tab === 'R') {
      openSheet(`<h3>Nový verš</h3>${fld('Odkaz (napr. Ján 3,16)', 'input', '').replace('<input', '<input name="ref" required')}<p class="note">Text sa vloží automaticky z prekladov v appke (KJV, Kralická, importované).</p>`, fd => {
        const ref = fd.get('ref').trim(); if (!ref) return false;
        if (!parseRef(ref)) { alert('Odkaz nepoznám. Skús napr. „Ján 3,16“ alebo „1. Korintským 13,4-7“.'); return false; }
        const x = newVerse(ref);
        autoFill(x).then(n => {
          db.remy.push(x); save();
          if (!n) alert('Verš je pridaný, ale text sa nenašiel (skontroluj číslo kapitoly a verša).');
        });
      });
    } else if (tab === 'M') {
      openSheet(`<h3>Nová kategória</h3>${nm(fld('Názov kategórie', 'input', ''), 'nazov').replace('<input', '<input required')}${nm(fld('Slová / spojenia (každé na nový riadok, nepovinné)', 'textarea', '', 4), 'slova')}`, fd => {
        const nazov = (fd.get('nazov') || '').trim(); if (!nazov) return false;
        db.modlitby.push({ nazov, slova: lines(fd.get('slova') || '') });
        mOpen[db.modlitby.length - 1] = true;
        save(); renderAdmin();
      });
    }
  };

  // ===== úprava podržaním =====
  const sheetBtns = (del) => `<div class="row-actions"><button class="btn primary" type="submit">Uložiť</button><button class="btn" type="button" id="shCancel">Zrušiť</button>${del ? '<button class="btn danger" type="button" id="shDel">Zmazať</button>' : ''}</div>`;
  function openEdit(html, onSave, onDelete) {
    form.onkeydown = null;
    form.innerHTML = html + sheetBtns(!!onDelete);
    $('#shCancel').onclick = closeSheet;
    if (onDelete) $('#shDel').onclick = () => { if (confirm('Naozaj zmazať?')) { onDelete(); save(); renderAdmin(); closeSheet(); } };
    form.onsubmit = e => { e.preventDefault(); onSave(new FormData(form)); save(); renderAdmin(); closeSheet(); };
    sheet.hidden = false;
  }
  const focusEnd = () => { const t = form.querySelector('textarea'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } };
  // rýchle pridávanie viacerých slov za sebou do kategórie
  function quickAdd(ki) {
    const k = db.modlitby[ki]; let added = [];
    const show = () => {
      form.innerHTML = `<h3>${esc(k.nazov)}</h3>${nm(fld('Nové slovo / spojenie', 'input', ''), 'w')}<p class="note">${added.length ? 'Pridané: ' + esc(added.join(', ')) : 'Pridaj jedno alebo viac, Enter pridá a ostane otvorené.'}</p><div class="row-actions"><button class="btn primary" type="submit">Pridať</button><button class="btn" type="button" id="shCancel">Hotovo</button></div>`;
      $('#shCancel').onclick = closeSheet;
      const i = form.querySelector('input'); i.focus();
    };
    form.onsubmit = e => {
      e.preventDefault(); const w = (new FormData(form).get('w') || '').trim();
      if (w) { k.slova.push(w); added.push(w); mOpen[ki] = true; save(); renderAdmin(); }
      show();
    };
    sheet.hidden = false; show();
  }
  const nm = (h, n) => h.replace(/<(input|textarea)/, `<$1 name="${n}"`);
  function editFor(kind) {
    const [t, i, j] = kind.split(':'), ix = +i;
    if (t === 'vi') { const u = db.vyznavanie.uvod; let ed; openEdit(`<h3>Úprava úvodu</h3>${nm(fld('Nadpis', 'input', u.nadpis), 'n')}<div class="fld"><span>Text</span><div class="rte-host"></div></div>`, fd => { u.nadpis = fd.get('n'); u.html = ed.getHtml(); u.text = plainOf(u.html); }); ed = richEditor(htmlOf(u)); form.querySelector('.rte-host').append(ed.el); return; }
    if (t === 'v') { const k = db.vyznavanie.kategorie[ix]; let ed; openEdit(`<h3>Úprava kategórie</h3>${nm(fld('Názov', 'input', k.nazov), 'n')}<div class="fld"><span>Text</span><div class="rte-host"></div></div>`, fd => { k.nazov = fd.get('n'); k.html = ed.getHtml(); k.text = plainOf(k.html); }, () => db.vyznavanie.kategorie.splice(ix, 1)); ed = richEditor(htmlOf(k)); form.querySelector('.rte-host').append(ed.el); return; }
    if (t === 'm') {
      const k = db.modlitby[ix];
      const row = w => `<div class="erow"><span class="grip" aria-label="Presunúť">⠿</span><input value="${esc(w)}"><button type="button" class="x" aria-label="Zmazať">×</button></div>`;
      openEdit(`<h3>Úprava kategórie</h3>${nm(fld('Názov', 'input', k.nazov), 'n')}<div class="fld"><span>Položky – poradie zmeníš posúvaním za ⠿</span></div><div class="elist" id="eList">${k.slova.map(row).join('')}</div><div class="erow add"><input id="eNew" placeholder="Nová položka"><button type="button" class="x ok" id="eAdd" aria-label="Pridať">＋</button></div>`, fd => {
        const vals = [...form.querySelectorAll('#eList input')].map(i => i.value.trim()), nw = $('#eNew').value.trim();
        k.nazov = fd.get('n'); k.slova = vals.concat(nw ? [nw] : []).filter(Boolean);
      }, () => db.modlitby.splice(ix, 1));
      const list = $('#eList'), add = () => { const i = $('#eNew'), v = i.value.trim(); if (!v) return; list.insertAdjacentHTML('beforeend', row(v)); i.value = ''; i.focus(); list.lastElementChild.scrollIntoView({ block: 'nearest' }); };
      $('#eAdd').onclick = add;
      form.onkeydown = e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); if (e.target.id === 'eNew') add(); } };
      list.addEventListener('click', e => { const x = e.target.closest('.x'); if (x) x.closest('.erow').remove(); });
      makeSortable(list, '.erow', () => {});
      return;
    }
    if (t === 'c') { const k = db.modlitby[ix]; return openEdit(`<h3>Úprava slova</h3>${nm(fld('Slovo / spojenie', 'input', k.slova[+j]), 'w')}`, fd => { const w = fd.get('w').trim(); if (w) k.slova[+j] = w; else k.slova.splice(+j, 1); }, () => k.slova.splice(+j, 1)); }
    if (t === 'r') {
      const x = db.remy[ix], keys = Object.keys(x.preklady);
      return openEdit(`<h3>Úprava verša</h3>${nm(fld('Odkaz', 'input', x.ref), 'ref')}` + keys.map((k, n) => nm(fld(k, 'textarea', x.preklady[k], 3), 'p' + n)).join('') + `<button class="btn small" type="button" id="shAuto">⟳ Doplniť z appky</button><p></p>`, fd => {
        x.ref = fd.get('ref').trim() || x.ref; keys.forEach((k, n) => x.preklady[k] = fd.get('p' + n));
      }, () => db.remy.splice(ix, 1)), $('#shAuto').addEventListener('click', async () => {
        x.ref = form.elements.ref.value.trim() || x.ref; keys.forEach((k, n) => x.preklady[k] = form.elements['p' + n].value);
        const c = await autoFill(x); keys.forEach((k, n) => form.elements['p' + n].value = x.preklady[k]); if (!c) alert('Nič sa nedoplnilo (skontroluj odkaz alebo či je preklad v appke).');
      });
    }
  }
  let lp = null, lpFired = false;
  document.addEventListener('pointerdown', e => {
    const t = e.target.closest('#V [data-edit], #R [data-edit], #M [data-edit]'); if (!t || e.target.closest('.wadd')) return;
    const target = t;
    const sx = e.clientX, sy = e.clientY; lpFired = false;
    lp = setTimeout(() => { lpFired = true; if (navigator.vibrate) navigator.vibrate(18); editFor(target.dataset.edit); }, 550);
    const cancel = ev => { if (ev.type === 'pointermove' && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return; clearTimeout(lp); document.removeEventListener('pointermove', cancel); document.removeEventListener('pointerup', cancel); document.removeEventListener('pointercancel', cancel); };
    document.addEventListener('pointermove', cancel); document.addEventListener('pointerup', cancel); document.addEventListener('pointercancel', cancel);
  });
  // po dlhom podržaní nerozbaľuj / neoznačuj
  document.addEventListener('click', e => { if (lpFired) { e.preventDefault(); e.stopImmediatePropagation(); lpFired = false; } }, true);
  document.addEventListener('contextmenu', e => { if (e.target.closest('#V [data-edit], #R [data-edit], #M [data-edit]')) e.preventDefault(); });

  // ===== záložky =====
  const names = { V: 'Vyznávanie', R: 'Rémy', M: 'Modlitby', A: 'Správa' };
  function show(t) {
    document.querySelectorAll('.view').forEach(s => s.hidden = s.id !== t);
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
    $('#fab').hidden = !(t === 'R' || t === 'M');
    $('#title').textContent = names[t];
    $('#eyebrow').textContent = new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' });
    try { localStorage.setItem('modlitby-tab', t); } catch (e) {}
    scrollTo(0, 0);
  }
  document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => show(b.dataset.tab));
  let start = 'V';
  try { start = localStorage.getItem('modlitby-tab') || 'V'; } catch (e) {}
  show(names[start] ? start : 'V');

  // ===== veľkosť písma =====
  const sizes = [16, 17, 19, 21];
  let si = -1;
  try { const s = +localStorage.getItem('modlitby-pismo'); si = sizes.indexOf(s); } catch (e) {}
  const applySize = () => { if (si >= 0) document.documentElement.style.setProperty('--fs', sizes[si] + 'px'); };
  applySize();
  $('#sizeBtn').onclick = () => { si = (si + 1) % sizes.length; applySize(); try { localStorage.setItem('modlitby-pismo', sizes[si]); } catch (e) {} };

  // ===== deň / noc =====
  $('#themeBtn').onclick = () => {
    const root = document.documentElement;
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    $('meta[name=theme-color]').content = t === 'dark' ? '#0d1017' : '#f6f1e9';
    try { localStorage.setItem('modlitby-tema', t); } catch (e) {}
  };
})();

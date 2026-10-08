(function(){
'use strict';
const {BOOKS,parseRef,fmtRef,norm}=window.BK;
const B=window.BIB;
const SB_URL='https://xqxcxmpezqpisoatgxvi.supabase.co';
const SB_KEY='sb_publishable_F_UvmisnMcbr6q5jehsMyA_5fV_pqDz';

/* ---------- pomocné ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const dstr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dstr(new Date());
const addDays=(s,n)=>{const [y,m,d]=s.split('-').map(Number);return dstr(new Date(y,m-1,d+n));};
const fmtD=s=>{const [y,m,d]=s.split('-').map(Number);return d+'. '+m+'.';};
const trName=id=>(B.T(id)||{}).name||id;
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2600);}

/* ---------- stav ---------- */
const KEY='biblia.state.v1';
const def=()=>({v:1,at:0,set:{tr:'bkr',gb:{}},prayers:[],verses:[],cards:[],rev:{},pos:{b:42,c:3}});
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===1)return Object.assign(def(),s,{set:Object.assign(def().set,s.set)});}catch(e){}return def();}
let S=load();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function save(){S.at=Date.now();persist();queuePush();}

/* ---------- synchronizácia (Supabase) ---------- */
let sb=null,user=null,syncMsg='',pushT=null;
try{sb=window.supabase.createClient(SB_URL,SB_KEY);}catch(e){sb=null;}
function queuePush(){if(!sb||!user)return;clearTimeout(pushT);pushT=setTimeout(push,1500);}
async function push(){
  if(!sb||!user)return;
  const {error}=await sb.from('biblia_state').upsert({user_id:user.id,data:S,updated_at:new Date().toISOString()});
  syncMsg=error?('Chyba synchronizácie: '+error.message):'Synchronizované '+new Date().toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'});
  updSync();
}
async function pull(){
  if(!sb||!user)return;
  const {data,error}=await sb.from('biblia_state').select('data').maybeSingle();
  if(error){syncMsg='Synchronizácia nie je nastavená: '+error.message;updSync();return;}
  if(data&&data.data&&(data.data.at||0)>S.at){S=Object.assign(def(),data.data,{set:Object.assign(def().set,data.data.set)});persist();render();syncMsg='Načítané zo servera';updSync();}
  else await push();
}
async function syncInit(){
  if(!sb)return;
  try{
    const {data}=await sb.auth.getSession();user=data.session&&data.session.user;
    sb.auth.onAuthStateChange((_e,s)=>{const u=s&&s.user;if(u&&(!user||user.id!==u.id)){user=u;pull();}else user=u||null;});
    if(user)await pull();
  }catch(e){syncMsg='Offline';}
}
function updSync(){const el=$('#syncmsg');if(el)el.textContent=syncMsg;}

/* ---------- výber karty ---------- */
let tab='pray',pf='active';
const TABS=[
 ['pray','Modlitby','<path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-4 3-6 5-9z"/><path d="M9 20h6"/>'],
 ['rem','Rémy','<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h6M8 11h6"/>'],
 ['mem','Memory','<rect x="3" y="4" width="8" height="10" rx="1.5"/><rect x="13" y="10" width="8" height="10" rx="1.5"/><path d="M6 8h2M16 14h2"/>']
];
const svg=(p,s)=>'<svg viewBox="0 0 24 24" width="'+(s||22)+'" height="'+(s||22)+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
function drawTabs(){
  $('#tabbar').innerHTML=TABS.map(t=>'<button class="tab'+(t[0]===tab?' on':'')+'" data-act="tab" data-v="'+t[0]+'">'+svg(t[2])+'<span>'+t[1]+'</span></button>').join('');
}
function render(){
  drawTabs();
  $('#trchip').textContent=B.T(S.set.tr).short;
  const v=tab==='pray'?vPray():tab==='rem'?vRem():vMem();
  const scr=$('#screen');scr.innerHTML=v;
  fillTexts(scr);
}

/* ---------- texty veršov ---------- */
function fillTexts(root){
  root.querySelectorAll('[data-vt]').forEach(async el=>{
    const ref=JSON.parse(el.dataset.vt);
    try{el.textContent=await B.text(S.set.tr,ref,{override:S.set.gb});}
    catch(e){el.innerHTML='<span class="err">'+esc(e.message)+'</span>';}
  });
}
const vText=r=>'<p class="vt" data-vt="'+esc(JSON.stringify(r))+'">Načítavam…</p>';

/* ---------- MODLITBY ---------- */
function vPray(){
  const t=today();
  const all=S.prayers;
  const act=all.filter(p=>!p.answered),ans=all.filter(p=>p.answered);
  const done=act.filter(p=>p.prayed.includes(t)).length;
  let list=pf==='active'?act.slice().sort((a,b)=>(a.prayed.includes(t)-b.prayed.includes(t))||b.created-a.created):ans.slice().sort((a,b)=>(b.answeredAt||0)-(a.answeredAt||0));
  return '<div class="head"><div><h2>Modlitby</h2><p class="sub">'+(act.length?'Dnes '+done+' z '+act.length+' pomodlených':'Pridaj prvú tému na modlitbu')+'</p></div><button class="btn primary" data-act="padd">+ Téma</button></div>'
  +(act.length?'<div class="bar"><i style="width:'+Math.round(done/act.length*100)+'%"></i></div>':'')
  +'<div class="seg"><button class="'+(pf==='active'?'on':'')+'" data-act="pf" data-v="active">Aktívne ('+act.length+')</button><button class="'+(pf==='ans'?'on':'')+'" data-act="pf" data-v="ans">Vyslyšané ('+ans.length+')</button></div>'
  +(list.length?list.map(p=>{
    const dn=p.prayed.includes(t);
    return '<article class="card'+(dn&&!p.answered?' done':'')+'"><div class="row"><h3>'+esc(p.title)+'</h3>'+(p.tag?'<span class="chip">'+esc(p.tag)+'</span>':'')+'</div>'
    +(p.notes?'<p class="notes">'+esc(p.notes)+'</p>':'')
    +(p.ref?'<button class="link" data-act="read" data-id="'+p.id+'" data-k="p">📖 '+esc(fmtRef(p.ref))+'</button>':'')
    +(p.answered?'<p class="meta">Vyslyšané '+fmtD(dstr(new Date(p.answeredAt)))+' · pomodlených '+p.count+'×</p>':'<p class="meta">'+(p.prayed.length?'Naposledy '+fmtD(p.prayed[p.prayed.length-1])+' · ':'')+p.count+'× pomodlené</p>')
    +'<div class="acts">'
    +(p.answered?'<button class="btn" data-act="pun" data-id="'+p.id+'">Vrátiť medzi aktívne</button>':'<button class="btn '+(dn?'':'primary')+'" data-act="ppray" data-id="'+p.id+'">'+(dn?'✓ Dnes pomodlené':'Pomodlil som sa')+'</button><button class="btn" data-act="pans" data-id="'+p.id+'">Vyslyšané</button>')
    +'<button class="btn ghost" data-act="pedit" data-id="'+p.id+'">Upraviť</button></div></article>';
  }).join(''):'<p class="empty">'+(pf==='active'?'Žiadne aktívne témy.':'Zatiaľ žiadne vyslyšané modlitby.')+'</p>');
}
function prayerForm(id){
  const p=S.prayers.find(x=>x.id===id)||{title:'',notes:'',tag:'',ref:null};
  const tags=['Rodina','Cirkev','Priatelia','Vďaka','Moje srdce','Svet'];
  openSheet('<h2>'+(id?'Upraviť tému':'Nová téma modlitby')+'</h2>'
  +'<label>Téma<input id="f-title" value="'+esc(p.title)+'" placeholder="Za koho / za čo sa modlím" maxlength="120"></label>'
  +'<label>Poznámky<textarea id="f-notes" rows="4" placeholder="Detaily, prosby, sľuby…">'+esc(p.notes)+'</textarea></label>'
  +'<label>Skupina<input id="f-tag" value="'+esc(p.tag)+'" list="tags" maxlength="30"><datalist id="tags">'+tags.map(t=>'<option>'+t+'</option>').join('')+'</datalist></label>'
  +'<label>Priradený verš (voliteľné)<input id="f-ref" value="'+esc(p.ref?fmtRef(p.ref):'')+'" placeholder="napr. Fp 4:6"></label>'
  +'<p class="err" id="f-err"></p><div class="acts"><button class="btn primary" data-act="psave" data-id="'+(id||'')+'">Uložiť</button>'+(id?'<button class="btn danger" data-act="pdel" data-id="'+id+'">Zmazať</button>':'')+'<button class="btn ghost" data-act="close">Zrušiť</button></div>');
}
function prayerSave(id){
  const title=$('#f-title').value.trim();if(!title){$('#f-err').textContent='Zadaj tému.';return;}
  const rs=$('#f-ref').value.trim();let ref=null;
  if(rs){ref=parseRef(rs);if(!ref){$('#f-err').textContent='Verš nepoznám. Skús napr. „Fp 4:6“.';return;}}
  const d={title,notes:$('#f-notes').value.trim(),tag:$('#f-tag').value.trim(),ref};
  if(id)Object.assign(S.prayers.find(p=>p.id===id),d);
  else S.prayers.push(Object.assign({id:uid(),created:Date.now(),prayed:[],count:0,answered:false},d));
  save();closeSheet();render();
}

/* ---------- RÉMY ---------- */
function vRem(){
  const vs=S.verses.slice().sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||b.created-a.created);
  return '<div class="head"><div><h2>Rémy</h2><p class="sub">Slová, ktoré ťa teraz oslovujú</p></div></div>'
  +'<form class="add" data-act="radd"><input id="r-ref" placeholder="Pridať verš, napr. Ž 23:1 alebo Rim 8:28-30" autocomplete="off"><button class="btn primary">Pridať</button></form><p class="err" id="r-err"></p>'
  +(vs.length?vs.map(v=>{
    const inMem=S.cards.some(c=>sameRef(c.ref,v.ref));
    return '<article class="card'+(v.pin?' pin':'')+'"><div class="row"><h3>'+esc(fmtRef(v.ref))+'</h3><button class="icon" data-act="rpin" data-id="'+v.id+'" aria-label="Pripnúť" title="Aktuálny verš">'+(v.pin?'★':'☆')+'</button></div>'
    +vText(v.ref)
    +(v.note?'<p class="notes">'+esc(v.note)+'</p>':'')
    +'<div class="acts"><button class="btn" data-act="read" data-id="'+v.id+'" data-k="r">Čítať / porovnať</button>'
    +(inMem?'<span class="chip ok">v Memory</span>':'<button class="btn primary" data-act="r2m" data-id="'+v.id+'">Do Memory</button>')
    +'<button class="btn ghost" data-act="rnote" data-id="'+v.id+'">Poznámka</button><button class="btn ghost" data-act="rdel" data-id="'+v.id+'">Odstrániť</button></div></article>';
  }).join(''):'<p class="empty">Zatiaľ nemáš žiadne rémy. Pridaj verš vyššie.</p>');
}
const sameRef=(a,b)=>a.b===b.b&&a.c===b.c&&a.v1===b.v1&&a.v2===b.v2;
async function addVerse(ref,note){
  if(S.verses.some(v=>sameRef(v.ref,ref))){toast('Tento verš už v rémach máš');return false;}
  S.verses.push({id:uid(),ref,note:note||'',pin:false,created:Date.now()});save();return true;
}

/* ---------- MEMORY ---------- */
const INT=[0,1,2,4,8,16,35,70];
function streak(){let n=0,d=today();if(!S.rev[d])d=addDays(d,-1);while(S.rev[d]){n++;d=addDays(d,-1);}return n;}
const dueCards=()=>S.cards.filter(c=>c.due<=today());
function vMem(){
  const due=dueCards(),mastered=S.cards.filter(c=>c.box>=5).length;
  return '<div class="head"><div><h2>Memory</h2><p class="sub">Učenie veršov naspamäť</p></div></div>'
  +'<div class="stats"><div><b>'+due.length+'</b><span>na dnes</span></div><div><b>'+S.cards.length+'</b><span>verše</span></div><div><b>'+mastered+'</b><span>zvládnuté</span></div><div><b>'+streak()+'</b><span>dní v rade</span></div></div>'
  +(due.length?'<button class="btn primary big" data-act="msess">Začať opakovanie ('+Math.min(due.length,20)+')</button>':'<p class="okmsg">'+(S.cards.length?'Na dnes máš hotovo 🎉':'Pridaj prvý verš na učenie.')+'</p>')
  +'<form class="add" data-act="madd"><input id="m-ref" placeholder="Pridať verš, napr. J 3:16" autocomplete="off"><button class="btn">Pridať</button></form><p class="err" id="m-err"></p>'
  +(S.cards.length?S.cards.slice().sort((a,b)=>a.due.localeCompare(b.due)).map(c=>
    '<article class="card mc"><div class="row"><h3>'+esc(fmtRef(c.ref))+'</h3><span class="chip">'+B.T(c.tr).short+'</span></div><p class="vt small">'+esc(c.text)+'</p>'
    +'<div class="lvl" title="Úroveň '+c.box+'/7">'+[0,1,2,3,4,5,6,7].map(i=>'<i class="'+(i<c.box?'f':'')+'"></i>').join('')+'</div>'
    +'<p class="meta">'+(c.due<=today()?'Na opakovanie dnes':'Ďalšie opakovanie '+fmtD(c.due))+'</p>'
    +'<div class="acts"><button class="btn ghost" data-act="read" data-id="'+c.id+'" data-k="m">Kontext</button><button class="btn ghost" data-act="mdel" data-id="'+c.id+'">Odstrániť</button></div></article>').join(''):'');
}
async function addCard(ref){
  if(S.cards.some(c=>sameRef(c.ref,ref))){toast('Tento verš už v Memory máš');return false;}
  const tr=S.set.tr;
  const text=await B.text(tr,ref,{override:S.set.gb});
  S.cards.push({id:uid(),ref,tr,text,box:0,due:today(),reps:0,lapses:0,created:Date.now()});save();return true;
}

/* --- relácia opakovania --- */
let Q=null; // {queue:[], i, mode, stage}
const words=t=>t.split(/\s+/).filter(Boolean);
const lcs=(a,b)=>{const m=[...Array(a.length+1)].map(()=>new Array(b.length+1).fill(0));for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=a[i-1]===b[j-1]?m[i-1][j-1]+1:Math.max(m[i-1][j],m[i][j-1]);return m;};
const nw=w=>norm(w).replace(/[^a-z0-9]/g,'');
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
const modeFor=c=>c.box<=0?'read':c.box===1?'letters':c.box<=3?'cloze':'type';
const MODES=[['read','Čítať'],['letters','Písmená'],['cloze','Vynechané'],['type','Písať']];
function startSession(){
  const q=dueCards().sort(()=>Math.random()-.5).slice(0,20);
  if(!q.length)return;
  Q={queue:q.map(c=>c.id),i:0,mode:null,shown:false,ok:0,bad:0,again:{}};
  drawSession();
}
function curCard(){return S.cards.find(c=>c.id===Q.queue[Q.i]);}
function drawSession(){
  if(!Q)return;
  const c=curCard();
  if(!c||Q.i>=Q.queue.length){
    const t=Q.ok+Q.bad;
    openSheet('<h2>Hotovo 🎉</h2><p class="big-n">'+Q.ok+' / '+t+'</p><p class="sub">správne. Séria: '+streak()+' dní.</p><div class="acts"><button class="btn primary" data-act="close">Zavrieť</button></div>');
    Q=null;render();return;
  }
  const mode=Q.mode||modeFor(c);
  const ws=words(c.text);
  let body='';
  if(mode==='read'){
    body='<p class="vt big">'+esc(c.text)+'</p><p class="hint">Prečítaj verš nahlas niekoľkokrát a potom ho skús zopakovať zo zatvorenými očami.</p><div class="acts"><button class="btn primary" data-act="sgrade" data-v="1">Zapamätal som si</button><button class="btn" data-act="sgrade" data-v="0">Ešte nie</button></div>';
  }else if(mode==='letters'){
    const L=ws.map(w=>{const m=w.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}])[\p{L}\p{N}]*([^\p{L}\p{N}]*)$/u);return m?esc(m[1]+m[2]+m[3]):esc(w);}).join(' ');
    body='<p class="vt big letters">'+(Q.shown?esc(c.text):L)+'</p><p class="hint">Povedz verš z pamäti podľa prvých písmen.</p>'
    +(Q.shown?'<div class="acts"><button class="btn primary" data-act="sgrade" data-v="1">Vedel som</button><button class="btn" data-act="sgrade" data-v="0">Nevedel som</button></div>':'<div class="acts"><button class="btn primary" data-act="sshow">Ukázať verš</button></div>');
  }else if(mode==='cloze'){
    const pct=c.box<=2?35:60;let hidden=ws.map((w,i)=>hash(c.id+i)%100<pct);if(!hidden.some(Boolean))hidden[Math.floor(ws.length/2)]=true;
    if(!Q.rev)Q.rev={};
    body='<p class="vt big">'+ws.map((w,i)=>hidden[i]&&!Q.shown&&!Q.rev[i]?'<button class="blank" data-act="srev" data-i="'+i+'" style="min-width:'+Math.max(2,w.length*0.6)+'em">&nbsp;</button>':esc(w)).join(' ')+'</p><p class="hint">Doplň v mysli chýbajúce slová, ťuknutím ich odhalíš.</p>'
    +'<div class="acts"><button class="btn primary" data-act="sgrade" data-v="1">Vedel som</button><button class="btn" data-act="sgrade" data-v="0">Nevedel som</button></div>';
  }else{
    body='<textarea id="s-in" rows="5" placeholder="Napíš verš z pamäti…" '+(Q.shown?'disabled':'')+'>'+esc(Q.typed||'')+'</textarea>'
    +(Q.shown?Q.diff+'<div class="acts"><button class="btn primary" data-act="sgrade" data-v="'+(Q.score>=0.85?1:0)+'">Ďalej</button>'+(Q.score<0.85?'<button class="btn" data-act="sgrade" data-v="1">Beriem ako správne</button>':'')+'</div>'
    :'<div class="acts"><button class="btn primary" data-act="scheck">Skontrolovať</button><button class="btn ghost" data-act="sshow2">Ukázať verš</button></div>');
  }
  openSheet('<div class="sess-top"><span>'+(Q.i+1)+' / '+Q.queue.length+'</span><div class="seg tiny">'+MODES.map(m=>'<button class="'+(m[0]===mode?'on':'')+'" data-act="smode" data-v="'+m[0]+'">'+m[1]+'</button>').join('')+'</div><button class="icon" data-act="sclose" aria-label="Zavrieť">✕</button></div>'
  +'<h2 class="ref">'+esc(fmtRef(c.ref))+' <small>'+B.T(c.tr).short+'</small></h2>'+body,true);
  const ta=$('#s-in');if(ta&&!Q.shown)ta.focus();
}
function checkTyped(c,typed){
  const tw=words(c.text),uw=words(typed);
  const a=tw.map(nw),b=uw.map(nw).filter(Boolean);
  const m=lcs(a,b);const score=a.length?m[a.length][b.length]/Math.max(a.length,b.length):0;
  // spätné sledovanie: ktoré slová sedia
  const hit=new Array(a.length).fill(false);let i=a.length,j=b.length;
  while(i>0&&j>0){if(a[i-1]===b[j-1]){hit[i-1]=true;i--;j--;}else if(m[i-1][j]>=m[i][j-1])i--;else j--;}
  return {score,diff:'<p class="vt diff">'+tw.map((w,k)=>'<span class="'+(hit[k]?'ok':'miss')+'">'+esc(w)+'</span>').join(' ')+'</p><p class="hint">Zhoda '+Math.round(score*100)+' %</p>'};
}
function grade(ok){
  const c=curCard();const t=today();
  c.reps++;S.rev[t]=(S.rev[t]||0)+1;
  if(ok){c.box=Math.min(7,c.box+1);c.due=addDays(t,INT[c.box]);Q.ok++;}
  else{c.box=Math.max(0,c.box-2);c.lapses++;c.due=t;Q.bad++;if(!Q.again[c.id]){Q.again[c.id]=1;Q.queue.push(c.id);}}
  save();
  Q.i++;Q.shown=false;Q.typed='';Q.rev={};Q.mode=null;
  drawSession();
}

/* ---------- ČÍTAČKA / PREKLADY / STRONG ---------- */
let R={b:42,c:3,tr:'bkr',hl:null};
function openReader(ref,tr){
  if(ref){R.b=ref.b;R.c=ref.c;R.hl=ref;}else{R.b=S.pos.b;R.c=S.pos.c;R.hl=null;}
  R.tr=tr||S.set.tr;
  drawReader();
}
async function drawReader(){
  S.pos={b:R.b,c:R.c};persist();
  const bk=BOOKS[R.b];
  const trs=B.TRANS.map(t=>'<option value="'+t.id+'"'+(t.id===R.tr?' selected':'')+'>'+t.name+'</option>').join('');
  openSheet('<div class="rd-top"><button class="icon" data-act="rprev" aria-label="Predošlá kapitola">‹</button><div class="rd-title"><select id="rd-book" data-act="rbook">'+BOOKS.map(b=>'<option value="'+b.i+'"'+(b.i===R.b?' selected':'')+'>'+esc(b.name)+'</option>').join('')+'</select><select id="rd-ch" data-act="rch">'+Array.from({length:bk.ch},(_,i)=>'<option'+(i+1===R.c?' selected':'')+'>'+(i+1)+'</option>').join('')+'</select></div><button class="icon" data-act="rnext" aria-label="Nasledujúca kapitola">›</button><button class="icon" data-act="close" aria-label="Zavrieť">✕</button></div>'
  +'<div class="rd-tr"><select id="rd-tr" data-act="rtr">'+trs+'</select></div><div id="rd-body" class="rd-body"><p class="vt">Načítavam…</p></div>',true);
  const body=$('#rd-body');const myR=R.b+':'+R.c+':'+R.tr;
  try{
    if(R.tr==='strong'){body.innerHTML=await strongBody();}
    else{
      const rows=await B.chapter(R.tr,R.b,R.c,{override:S.set.gb,onProgress:p=>{if($('#rd-body'))$('#rd-body').innerHTML='<p class="vt">Sťahujem preklad… '+Math.round(p*100)+' %</p>';}});
      if(myR!==R.b+':'+R.c+':'+R.tr)return;
      body.innerHTML=rows.map(r=>{
        const hl=R.hl&&R.hl.b===R.b&&R.hl.c===R.c&&r[0]>=R.hl.v1&&r[0]<=R.hl.v2;
        return '<p class="rv'+(hl?' hl':'')+'" data-act="rverse" data-v="'+r[0]+'"><sup>'+r[0]+'</sup> '+esc(r[1])+'</p>';
      }).join('')||'<p class="empty">Kapitola v tomto preklade nie je.</p>';
      if(R.hl){const h=body.querySelector('.hl');if(h)h.scrollIntoView({block:'center'});}
    }
  }catch(e){body.innerHTML='<p class="err">'+esc(e.message)+'</p>'+(navigator.onLine?'':'<p class="hint">Si offline a tento preklad ešte nie je stiahnutý.</p>');}
}
async function strongBody(){
  let h='<form class="add" data-act="sq"><input id="sq-in" placeholder="Hľadaj číslo Strong: H7225 alebo G26" autocomplete="off"><button class="btn">Hľadať</button></form><div id="sq-out"></div>';
  if(R.b>38){
    h+='<p class="hint">Hebrejský text s číslami Strong je k dispozícii pre Starý zákon. Pre Nový zákon vyhľadaj číslo Strong (G…) ručne vyššie alebo prepni na iný preklad.</p>';
    return h;
  }
  return h+'<div class="he" dir="rtl">'+await heCh()+'</div><p class="hint">Ťukni na slovo pre jeho význam (Strong).</p>';
}
async function heCh(){
  let out='';
  for(let v=1;v<=200;v++){
    const w=await B.hebrew(R.b,R.c,v);if(!w){if(v>1)break;else continue;}
    out+='<p class="rv"><sup>'+v+'</sup> '+w.map(x=>x[1]?'<button class="hw" data-act="strong" data-v="'+x[1]+'">'+esc(x[0])+'</button>':esc(x[0])).join(' ')+'</p>';
  }
  return out||'<p class="empty">Hebrejský text pre túto kapitolu nie je.</p>';
}
async function showStrong(code){
  const out=$('#sq-out');if(!out)return;out.innerHTML='<p class="vt">Načítavam…</p>';
  try{
    const e=await B.strongEntry(code);
    out.innerHTML=e?'<div class="card se"><div class="row"><h3>'+esc(e.code)+' · '+esc(e.lemma||'')+'</h3></div><p class="meta">'+esc(e.xlit||e.translit||'')+(e.pron?' · '+esc(e.pron):'')+'</p><p>'+esc((e.strongs_def||'').replace(/[{}]/g,'').trim())+'</p>'+(e.kjv_def?'<p class="notes"><b>KJV:</b> '+esc(e.kjv_def.trim())+'</p>':'')+(e.derivation?'<p class="notes">'+esc(e.derivation)+'</p>':'')+'</div>':'<p class="err">Číslo „'+esc(code)+'“ sa nenašlo.</p>';
  }catch(er){out.innerHTML='<p class="err">'+esc(er.message)+'</p>';}
}
async function compare(v){
  const ref={b:R.b,c:R.c,v1:v,v2:v};
  const box=document.createElement('div');box.className='cmp';
  box.innerHTML='<h3>'+esc(fmtRef(ref))+'</h3>'+B.READABLE.map(id=>'<div class="cmpi"><b>'+esc(trName(id))+'</b><p data-id="'+id+'">…</p></div>').join('')
  +'<div class="acts"><button class="btn" data-act="cadd">Do Rémy</button><button class="btn primary" data-act="cmem">Do Memory</button><button class="btn ghost" data-act="cclose">Zavrieť</button></div>';
  box.dataset.ref=JSON.stringify(ref);
  const old=$('#cmp');if(old)old.remove();box.id='cmp';$('#sheet-in').appendChild(box);
  B.READABLE.forEach(async id=>{const el=box.querySelector('[data-id="'+id+'"]');try{el.textContent=await B.text(id,ref,{override:S.set.gb});}catch(e){el.innerHTML='<span class="err">'+esc(e.message)+'</span>';}});
}

/* ---------- nastavenia ---------- */
async function dlStatus(){
  for(const t of B.TRANS.filter(t=>t.kind==='sm')){
    const el=$('#dl-'+t.id);if(!el)continue;
    el.textContent=(await B.kvGet('sm:'+t.id+':v1'))?'Stiahnuté ✓':'Stiahnuť offline';
  }
}
function openSettings(){
  openSheet('<h2>Nastavenia</h2>'
  +'<label>Preklad pre Rémy a Memory<select id="set-tr">'+B.TRANS.filter(t=>t.kind!=='strong').map(t=>'<option value="'+t.id+'"'+(t.id===S.set.tr?' selected':'')+'>'+t.name+'</option>').join('')+'</select></label>'
  +'<h3>Offline preklady</h3><div class="dl">'+B.TRANS.filter(t=>t.kind==='sm').map(t=>'<div><span>'+t.name+'</span><button class="btn" data-act="dl" data-id="'+t.id+'" id="dl-'+t.id+'">…</button></div>').join('')+'</div>'
  +'<h3>Roháčkova a Ekumenický</h3><p class="hint">Načítavajú sa po kapitolách z getBible. Ak ich automatické hľadanie nenájde, zadaj skratku prekladu z api.getbible.net.</p>'
  +'<label>Skratka – Roháčkova<input id="set-roh" value="'+esc(S.set.gb.roh||'')+'" placeholder="(automaticky)"></label>'
  +'<label>Skratka – Ekumenický<input id="set-cep" value="'+esc(S.set.gb.cep||'')+'" placeholder="(automaticky)"></label>'
  +'<h3>Účet a synchronizácia</h3>'+(user?'<p>Prihlásený: <b>'+esc(user.email)+'</b></p><div class="acts"><button class="btn" data-act="syncnow">Synchronizovať</button><button class="btn ghost" data-act="logout">Odhlásiť</button></div>'
   :'<p class="hint">Prihlásením sa dáta synchronizujú medzi zariadeniami.</p><label>E-mail<input id="au-mail" type="email" autocomplete="email"></label><label>Heslo<input id="au-pw" type="password" autocomplete="current-password"></label><div class="acts"><button class="btn primary" data-act="login">Prihlásiť</button><button class="btn" data-act="signup">Vytvoriť účet</button></div>')
  +'<p class="hint" id="syncmsg">'+esc(syncMsg)+'</p><p class="err" id="au-err"></p>'
  +'<div class="acts"><button class="btn primary" data-act="setsave">Uložiť</button><button class="btn ghost" data-act="close">Zavrieť</button></div>');
  dlStatus();
}
async function auth(kind){
  const email=$('#au-mail').value.trim(),password=$('#au-pw').value;
  if(!email||!password){$('#au-err').textContent='Zadaj e-mail a heslo.';return;}
  const r=kind==='login'?await sb.auth.signInWithPassword({email,password}):await sb.auth.signUp({email,password});
  if(r.error){$('#au-err').textContent=r.error.message;return;}
  if(kind==='signup'&&!r.data.session){$('#au-err').textContent='Potvrď e-mail a potom sa prihlás.';return;}
  user=r.data.session.user;await pull();openSettings();
}

/* ---------- plachta (sheet) ---------- */
function openSheet(html,full){
  const sh=$('#sheet');sh.hidden=false;sh.classList.toggle('full',!!full);
  $('#sheet-in').innerHTML=html;document.body.classList.add('lock');
}
function closeSheet(){$('#sheet').hidden=true;$('#sheet-in').innerHTML='';const c=$('#cmp');if(c)c.remove();document.body.classList.remove('lock');Q=null;}

/* ---------- udalosti ---------- */
function find(arr,id){return arr.find(x=>x.id===id);}
document.addEventListener('click',async ev=>{
  const el=ev.target.closest('[data-act]');if(!el||el.tagName==='FORM'||el.tagName==='SELECT')return;
  const a=el.dataset.act,id=el.dataset.id,v=el.dataset.v;
  try{
    switch(a){
      case 'tab':tab=v;render();window.scrollTo(0,0);break;
      case 'pf':pf=v;render();break;
      case 'padd':prayerForm();break;
      case 'pedit':prayerForm(id);break;
      case 'psave':prayerSave(id);break;
      case 'pdel':if(confirm('Zmazať túto tému?')){S.prayers=S.prayers.filter(p=>p.id!==id);save();closeSheet();render();}break;
      case 'ppray':{const p=find(S.prayers,id),t=today();if(p.prayed.includes(t)){p.prayed=p.prayed.filter(d=>d!==t);p.count=Math.max(0,p.count-1);}else{p.prayed.push(t);p.prayed=p.prayed.slice(-60);p.count++;}save();render();break;}
      case 'pans':{const p=find(S.prayers,id);p.answered=true;p.answeredAt=Date.now();save();render();toast('Chvála Pánu! 🙏');break;}
      case 'pun':{const p=find(S.prayers,id);p.answered=false;save();render();break;}
      case 'read':{const k=el.dataset.k;const o=find(k==='p'?S.prayers:k==='r'?S.verses:S.cards,id);openReader(o.ref,o.tr);break;}
      case 'rpin':{const x=find(S.verses,id);x.pin=!x.pin;save();render();break;}
      case 'rdel':if(confirm('Odstrániť tento verš z rémy?')){S.verses=S.verses.filter(x=>x.id!==id);save();render();}break;
      case 'rnote':{const x=find(S.verses,id),n=prompt('Poznámka k veršu',x.note||'');if(n!==null){x.note=n.trim();save();render();}break;}
      case 'r2m':{el.disabled=true;try{await addCard(find(S.verses,id).ref);toast('Pridané do Memory');}catch(e){toast(e.message);}render();break;}
      case 'mdel':if(confirm('Odstrániť verš z Memory?')){S.cards=S.cards.filter(x=>x.id!==id);save();render();}break;
      case 'msess':startSession();break;
      case 'smode':Q.mode=v;Q.shown=false;Q.rev={};drawSession();break;
      case 'sshow':Q.shown=true;drawSession();break;
      case 'sshow2':{const c=curCard();Q.typed=($('#s-in')||{}).value||'';const r=checkTyped(c,Q.typed);Q.score=0;Q.diff=r.diff;Q.shown=true;drawSession();break;}
      case 'scheck':{const c=curCard();Q.typed=$('#s-in').value;const r=checkTyped(c,Q.typed);Q.score=r.score;Q.diff=r.diff;Q.shown=true;drawSession();break;}
      case 'srev':Q.rev[+el.dataset.i]=true;drawSession();break;
      case 'sgrade':grade(v==='1');break;
      case 'sclose':if(confirm('Ukončiť opakovanie?')){closeSheet();render();}break;
      case 'close':closeSheet();render();break;
      case 'bible':openReader();break;
      case 'settings':openSettings();break;
      case 'rprev':if(R.c>1)R.c--;else if(R.b>0){R.b--;R.c=BOOKS[R.b].ch;}R.hl=null;drawReader();break;
      case 'rnext':if(R.c<BOOKS[R.b].ch)R.c++;else if(R.b<65){R.b++;R.c=1;}R.hl=null;drawReader();break;
      case 'rverse':compare(+v);break;
      case 'strong':{const sq=$('#sq-in');if(sq)sq.value=v;showStrong(v);$('#sq-out').scrollIntoView({block:'nearest'});break;}
      case 'cclose':{const c=$('#cmp');if(c)c.remove();break;}
      case 'cadd':case 'cmem':{
        const ref=JSON.parse($('#cmp').dataset.ref);
        if(a==='cadd'){if(await addVerse(ref))toast('Pridané do Rémy');}
        else{try{if(await addCard(ref))toast('Pridané do Memory');}catch(e){toast(e.message);}}
        break;}
      case 'dl':{el.disabled=true;el.textContent='Sťahujem…';try{await B.chapter(id,0,1,{onProgress:p=>el.textContent=Math.round(p*100)+' %'});}catch(e){toast(e.message);}el.disabled=false;dlStatus();break;}
      case 'setsave':S.set.tr=$('#set-tr').value;S.set.gb={roh:$('#set-roh').value.trim(),cep:$('#set-cep').value.trim()};save();closeSheet();render();break;
      case 'login':case 'signup':await auth(a);break;
      case 'logout':await sb.auth.signOut();user=null;syncMsg='';openSettings();break;
      case 'syncnow':await pull();break;
    }
  }catch(e){toast(e.message||'Chyba');}
});
document.addEventListener('change',ev=>{
  const el=ev.target.closest('select[data-act]');if(!el)return;
  if(el.dataset.act==='rbook'){R.b=+el.value;R.c=1;R.hl=null;drawReader();}
  else if(el.dataset.act==='rch'){R.c=+el.value;R.hl=null;drawReader();}
  else if(el.dataset.act==='rtr'){R.tr=el.value;drawReader();}
});
document.addEventListener('submit',async ev=>{
  const f=ev.target.closest('form[data-act]');if(!f)return;ev.preventDefault();
  const a=f.dataset.act;
  if(a==='radd'||a==='madd'){
    const inp=f.querySelector('input'),err=$(a==='radd'?'#r-err':'#m-err');err.textContent='';
    const ref=parseRef(inp.value);
    if(!ref){err.textContent='Verš nepoznám. Skús napr. „Ž 23:1“ alebo „Rim 8:28-30“.';return;}
    const btn=f.querySelector('button');btn.disabled=true;
    try{
      if(a==='radd'){if(await addVerse(ref)){inp.value='';render();}}
      else if(await addCard(ref)){inp.value='';render();}
    }catch(e){err.textContent=e.message;}
    btn.disabled=false;
  }else if(a==='sq'){showStrong($('#sq-in').value);}
});

/* ---------- štart ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  render();syncInit();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
});
})();

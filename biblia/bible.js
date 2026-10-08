/* Preklady Biblie: načítanie z internetu za behu + cache v IndexedDB (offline po prvom načítaní) */
(function(){
'use strict';
const {BOOKS}=window.BK;

/* ---------- IndexedDB (kv) ---------- */
let _db;
function idb(){
  if(_db)return _db;
  _db=new Promise((res,rej)=>{
    if(!window.indexedDB)return rej(new Error('no idb'));
    const r=indexedDB.open('biblia',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
  return _db;
}
async function kvGet(k){try{const d=await idb();return await new Promise((res,rej)=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});}catch(e){return undefined;}}
async function kvSet(k,v){try{const d=await idb();await new Promise((res,rej)=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error);});}catch(e){}}

/* ---------- registrácia prekladov ---------- */
const RAW='https://raw.githubusercontent.com/';
const SM=f=>RAW+'scrollmapper/bible_databases/master/formats/json/'+f+'.json';
// kind: 'sm' = celý preklad z verejnej zbierky (stiahne sa raz), 'gb' = po kapitolách z getBible API (hľadá sa podľa názvu),
// 'strong' = hebrejský text s číslami Strong + slovníky Strong
const TRANS=[
  {id:'roh',name:'Roháčkova',short:'ROH',kind:'gb',lang:'cs',re:/roh[aá][cč]ek|roh[aá]/i,note:'Online z getBible (ak je dostupná).'},
  {id:'cep',name:'Ekumenický',short:'EKU',kind:'gb',lang:'cs',re:/ekumen|ecumen|czech.*(cep|ecumen)|^cep$/i,note:'Online z getBible (ak je dostupný).'},
  {id:'bkr',name:'Kralická',short:'BKR',kind:'sm',file:'CzeBKR',lang:'cs',re:/kralick|bkr/i},
  {id:'csp',name:'Studijní',short:'CSP',kind:'sm',file:'CzeCSP',lang:'cs',re:/studij|csp/i},
  {id:'kjv',name:'KJV',short:'KJV',kind:'sm',file:'KJV',lang:'en',re:/^kjv$|king james/i},
  {id:'strong',name:'Strong (heb/gr)',short:'STR',kind:'strong',lang:'he'}
];
const T=id=>TRANS.find(t=>t.id===id);
const READABLE=TRANS.filter(t=>t.kind!=='strong').map(t=>t.id);

/* ---------- scrollmapper: celý preklad ---------- */
const smMem={};
async function loadSM(t,onProgress){
  if(smMem[t.id])return smMem[t.id];
  const p=smLoad(t,onProgress);
  smMem[t.id]=p;
  p.catch(()=>{delete smMem[t.id];});
  return p;
}
async function smLoad(t,onProgress){
  const key='sm:'+t.id+':v1';
  let data=await kvGet(key);
  if(!data){
    const r=await fetch(SM(t.file));
    if(!r.ok)throw new Error('Preklad sa nepodarilo stiahnuť ('+r.status+')');
    const total=+r.headers.get('content-length')||0;
    let json;
    if(r.body&&total&&onProgress){
      const rd=r.body.getReader();const parts=[];let got=0;
      for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;onProgress(Math.min(1,got/total));}
      json=JSON.parse(await new Blob(parts).text());
    }else json=await r.json();
    if(!json.books||json.books.length!==66)throw new Error('Neočakávaný formát prekladu');
    data=json.books.map(b=>b.chapters.map(c=>c.verses.map(v=>[v.verse,v.text])));
    await kvSet(key,data);
  }
  return data;
}

/* ---------- getBible: po kapitolách ---------- */
let gbList;
async function gbTranslations(){
  if(gbList)return gbList;
  let l=await kvGet('gb:list:v1');
  if(!l){
    const r=await fetch('https://api.getbible.net/v2/translations.json');
    if(!r.ok)throw new Error('getBible nedostupný ('+r.status+')');
    const j=await r.json();
    l=Object.keys(j).map(k=>({abbr:k,name:(j[k].translation||'')+' '+(j[k].abbreviation||''),lang:j[k].lang||j[k].language||''}));
    await kvSet('gb:list:v1',l);
  }
  return gbList=l;
}
async function gbAbbr(t,override){
  if(override&&override[t.id])return override[t.id];
  const l=await gbTranslations();
  const c=l.find(x=>t.re.test(x.name)&&(!x.lang||/^(cs|cz|cze|ces|czech)/i.test(x.lang)||/czech|česk/i.test(x.name)));
  if(!c)throw new Error('Preklad „'+t.name+'“ sa v getBible nenašiel. V nastaveniach zadaj jeho skratku.');
  return c.abbr;
}
async function gbChapter(t,b,c,override){
  const ab=await gbAbbr(t,override);
  const key='gb:'+ab+':'+b+':'+c;
  let v=await kvGet(key);
  if(!v){
    const r=await fetch('https://api.getbible.net/v2/'+encodeURIComponent(ab)+'/'+(b+1)+'/'+c+'.json');
    if(!r.ok)throw new Error('Kapitola sa nepodarila načítať ('+r.status+')');
    const j=await r.json();
    v=(j.verses||[]).map(x=>[+x.verse,String(x.text||'').trim()]);
    if(!v.length)throw new Error('Prázdna kapitola');
    await kvSet(key,v);
  }
  return v;
}

/* ---------- Strong: slovníky + hebrejský text (OSHB) ---------- */
const OSIS_OT=['Gen','Exod','Lev','Num','Deut','Josh','Judg','Ruth','1Sam','2Sam','1Kgs','2Kgs','1Chr','2Chr','Ezra','Neh','Esth','Job','Ps','Prov','Eccl','Song','Isa','Jer','Lam','Ezek','Dan','Hos','Joel','Amos','Obad','Jonah','Mic','Nah','Hab','Zeph','Hag','Zech','Mal'];
const dict={};
async function loadDict(kind){ // 'H' | 'G'
  if(dict[kind])return dict[kind];
  const key='strong:'+kind+':v1';
  let d=await kvGet(key);
  if(!d){
    const url=RAW+'openscriptures/strongs/master/'+(kind==='H'?'hebrew/strongs-hebrew-dictionary.js':'greek/strongs-greek-dictionary.js');
    const r=await fetch(url);
    if(!r.ok)throw new Error('Slovník Strong sa nepodarilo stiahnuť ('+r.status+')');
    const s=await r.text();
    d=JSON.parse(s.slice(s.indexOf('{',s.search(/=\s*\{/)),s.lastIndexOf('}')+1));
    await kvSet(key,d);
  }
  return dict[kind]=d;
}
async function strongEntry(code){ // "H7225" / "G26"
  const m=String(code).trim().toUpperCase().match(/^([HG])0*(\d{1,4})$/);
  if(!m)return null;
  const d=await loadDict(m[1]);
  const e=d[m[1]+m[2]];
  return e?Object.assign({code:m[1]+m[2]},e):null;
}
const hebMem={};
async function hebBook(b){
  if(hebMem[b])return hebMem[b];
  const key='oshb:'+b+':v1';
  let data=await kvGet(key);
  if(!data){
    const r=await fetch(RAW+'openscriptures/morphhb/master/wlc/'+OSIS_OT[b]+'.xml');
    if(!r.ok)throw new Error('Hebrejský text sa nepodarilo stiahnuť ('+r.status+')');
    const x=new DOMParser().parseFromString(await r.text(),'application/xml');
    data={};
    x.querySelectorAll('verse').forEach(vs=>{
      const id=vs.getAttribute('osisID');if(!id)return;
      const p=id.split('.');const key2=(+p[1])+':'+(+p[2]);
      data[key2]=[...vs.querySelectorAll('w')].map(w=>{
        const nums=(w.getAttribute('lemma')||'').split('/').map(s=>s.trim().split(' ')[0]).filter(s=>/^\d+$/.test(s));
        return [w.textContent.replace(/\//g,''),nums.length?'H'+nums[nums.length-1]:''];
      });
    });
    await kvSet(key,data);
  }
  return hebMem[b]=data;
}

/* ---------- verejné API ---------- */
const clean=s=>s.replace(/[⌈⌉]/g,'').replace(/\s+/g,' ').trim();
// kapitola -> [[verš, text], ...]
async function chapter(trId,b,c,opt){
  opt=opt||{};
  const t=T(trId);if(!t)throw new Error('Neznámy preklad');
  let rows;
  if(t.kind==='sm'){const d=await loadSM(t,opt.onProgress);rows=(d[b]&&d[b][c-1])||[];}
  else if(t.kind==='gb'){try{rows=await gbChapter(t,b,c,opt.override);}catch(e){throw new Error(e instanceof TypeError?'„'+t.name+'“ sa nepodarilo načítať z internetu.':e.message);}}
  else throw new Error('Strong sa číta cez hebrejský text');
  return rows.map(r=>[r[0],clean(r[1])]);
}
// odkaz -> text (spojený) alebo [[v,text]]
async function verses(trId,ref,opt){
  const rows=await chapter(trId,ref.b,ref.c,opt);
  return rows.filter(r=>r[0]>=ref.v1&&r[0]<=ref.v2);
}
async function text(trId,ref,opt){
  const v=await verses(trId,ref,opt);
  if(!v.length)throw new Error('Verš v tomto preklade neexistuje');
  return v.map(r=>r[1]).join(' ');
}
// hebrejský text s číslami Strong: [[slovo, 'H1234'], ...] pre verš (len OT)
async function hebrew(b,c,v){
  if(b>38)return null;
  const d=await hebBook(b);
  return d[c+':'+v]||null;
}
window.BIB={TRANS,T,READABLE,chapter,verses,text,hebrew,strongEntry,kvGet,kvSet};
})();


(function(){
'use strict';
const I={
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6"/>',
 car:'<path d="M3 13l2-6h14l2 6v5h-3v-2H6v2H3z"/><path d="M3 13h18"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
 drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 shirt:'<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 cash:'<path d="M3 7h18v10H3z"/><circle cx="12" cy="12" r="2.5"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 archive:'<path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 gift:'<path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13"/><path d="M12 8S10 3 7.5 4.5 8 8 12 8zm0 0s2-5 4.5-3.5S16 8 12 8z"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
 dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
 grid:'<path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>',
 pie:'<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
 bars:'<path d="M12 20V10M18 20V4M6 20v-4"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 left:'<path d="M15 18l-6-6 6-6"/>',
 right:'<path d="M9 18l6-6-6-6"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 alert:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
 over:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>'
};
const ic=(n,s)=>'<svg viewBox="0 0 24 24" width="'+(s||20)+'" height="'+(s||20)+'" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+I[n]+'</svg>';

/* ---------- dátumy ---------- */
const MN12=['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const MS12=['Jan','Feb','Mar','Apr','Máj','Jún','Júl','Aug','Sep','Okt','Nov','Dec'];
const MG12=['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
const DAYMS=864e5;
const _n=new Date();const TODAY=new Date(_n.getFullYear(),_n.getMonth(),_n.getDate());
const addDays=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const mon=d=>addDays(d,-((d.getDay()+6)%7));
const isoWeek=d=>{const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y)/DAYMS+1)/7);};
const fd=d=>d.getDate()+'. '+(d.getMonth()+1)+'.';
const dim=M=>new Date(M.y,M.mo+1,0).getDate();
const round2=n=>Math.round(n*100)/100;

/* ---------- kategórie ---------- */
const PEOPLE={J:'J',I:'I'};
const sb=a=>a.map(x=>({id:x[0],name:x[1]}));
const CATS=[
 {id:'des',name:'Desiatky',icon:'heart',kind:'tithe',subs:[]},
 {id:'poz',name:'Pôžičky',icon:'file',subs:sb([['prima','Prima'],['melon','Žltý melón']])},
 {id:'byv',name:'Bývanie',icon:'home',subs:sb([['najom','Nájom'],['elektrina','Elektrina'],['o2','O2']])},
 {id:'jed',name:'Jedlo',icon:'cart',kind:'weeks',subs:sb([['w0','Týždeň 1'],['w1','Týždeň 2'],['w2','Týždeň 3'],['w3','Týždeň 4']])},
 {id:'dro',name:'Drogéria',icon:'drop',subs:[]},
 {id:'obl',name:'Oblečenie',icon:'shirt',subs:[]},
 {id:'aut',name:'Auto',icon:'car',subs:sb([['nafta','Nafta'],['servis','Servis'],['dialnicna','Diaľničná'],['stk','STK'],['poistka','Poistka']])},
 {id:'app',name:'Aplikácie',icon:'phone',subs:sb([['adobe','Adobe'],['ytb','YTB'],['spotify','Spotify'],['chatgpt','ChatGPT'],['claude','Claude'],['shopify','Shopify']])},
 {id:'dlh',name:'Dlhy',icon:'cash',kind:'debt',subs:[]},
 {id:'dov',name:'Dovolenka',icon:'sun',subs:[]},
 {id:'inv',name:'Investovanie',icon:'trend',subs:[]},
 {id:'odk',name:'Odkladanie',icon:'archive',subs:sb([['deti','Deti'],['rodicia','Rodičia']])},
 {id:'rez',name:'Rezervy',icon:'shield',subs:sb([['r1','Rezerva 1'],['r2','Rezerva 2']])},
 {id:'vyl',name:'Výlety',icon:'compass',subs:[]},
 {id:'osl',name:'Oslavy',icon:'gift',subs:[]},
 {id:'pod',name:'Podnikanie',icon:'brief',subs:sb([['vszp','VšZP'],['rozvoj','Rozvoj']])},
 {id:'ost',name:'Ostatné',icon:'dots',kind:'manual',subs:[]}
];
const GRP_OF={des:'main',poz:'main',jed:'main',byv:'main',dro:'main',aut:'main',app:'main',dlh:'extra'};
CATS.forEach(c=>c.grp=GRP_OF[c.id]||'side');
const GRPS=[['main','Hlavné'],['side','Vedľajšie'],['extra','Mimoriadne']];
const CAT=Object.fromEntries(CATS.map(c=>[c.id,c]));
const DEFLIM={'poz.prima':540,'poz.melon':180,'byv.najom':280,'byv.elektrina':50,'byv.o2':200,
 'jed.w0':125,'jed.w1':125,'jed.w2':125,'jed.w3':125,'dro':100,'obl':100,
 'aut.nafta':150,'aut.servis':45,'aut.dialnicna':10,'aut.stk':10,'aut.poistka':15,
 'app.adobe':20,'app.ytb':20,'app.spotify':10,'app.chatgpt':27,'app.claude':22,'app.shopify':27,
 'dov':100,'inv':50,'odk.deti':50,'odk.rodicia':50,'rez.r1':50,'rez.r2':null,'vyl':50,'osl':50,'pod.vszp':120,'pod.rozvoj':50};
const DEFPLAN=[
 {d:1,name:'Nájom',key:'byv.najom',amt:280},{d:2,name:'Adobe',key:'app.adobe',amt:20},{d:3,name:'YTB',key:'app.ytb',amt:20},{d:3,name:'Spotify',key:'app.spotify',amt:10},
 {d:4,name:'Poistka auta',key:'aut.poistka',amt:15},{d:5,name:'Elektrina',key:'byv.elektrina',amt:50},{d:6,name:'STK',key:'aut.stk',amt:10},{d:8,name:'O2',key:'byv.o2',amt:200},
 {d:9,name:'ChatGPT',key:'app.chatgpt',amt:27},{d:9,name:'Claude',key:'app.claude',amt:22},{d:10,name:'Desiatok 10 %',key:'des',amt:null},
 {d:11,name:'Dovolenka',key:'dov',amt:100},{d:11,name:'Investovanie',key:'inv',amt:50},{d:11,name:'Odkladanie – deti',key:'odk.deti',amt:50},{d:11,name:'Odkladanie – rodičia',key:'odk.rodicia',amt:50},{d:11,name:'Rezerva 1',key:'rez.r1',amt:50},
 {d:12,name:'Shopify',key:'app.shopify',amt:27},{d:15,name:'Prima',key:'poz.prima',amt:540},{d:15,name:'Žltý melón',key:'poz.melon',amt:180},
 {d:20,name:'Podnikanie – VšZP',key:'pod.vszp',amt:120},{d:22,name:'Podnikanie – Rozvoj',key:'pod.rozvoj',amt:50},{d:28,name:'Splátka dlhu',key:'dlh.realbyt',amt:70}
];
const S={
  tab:'home', month:5, anaTab:'ana', expanded:null, trend:'chart', grp:'all', incAll:false, upAll:false, doneAll:false, repAll:false, confirm:false,
  months:[], tx:[], incTx:[], debts:[], members:[], me:'J', hh:null, loaded:false, mode:'exp', draft:{cat:'jed',sub:'',who:'J'}, rep:{J:true,I:true}
};

/* ---------- mesiace, limity, týždne ---------- */
const M_=m=>S.months[m];
const mname=m=>MN12[M_(m).mo];
const mshort=m=>MS12[M_(m).mo];
const vis=()=>S.months.map((x,i)=>i).filter(i=>S.months[i].status!=='planned');
const prevVis=m=>{const v=vis(),k=v.indexOf(m);return k>0?v[k-1]:-1;};
const calIdx=d=>S.months.findIndex(x=>x.y===d.getFullYear()&&x.mo===d.getMonth());
const curDay=M=>{const f=new Date(M.y,M.mo,1),l=new Date(M.y,M.mo,dim(M));return TODAY<f?0:TODAY>l?dim(M):TODAY.getDate();};
function weekInfoM(M,k){const a=addDays(mon(new Date(M.y,M.mo,1)),7*k),b=addDays(a,6);return{n:isoWeek(a),a,b,range:fd(a)+' – '+fd(b),label:'Týždeň '+isoWeek(a)+' ('+fd(a)+' – '+fd(b)+')'};}
const weekInfo=(m,k)=>weekInfoM(M_(m),k);
function foodAssign(dt){
  for(let i=0;i<S.months.length;i++){const a=mon(new Date(S.months[i].y,S.months[i].mo,1)),b=addDays(a,27);if(dt>=a&&dt<=b)return{m:i,w:Math.floor(Math.round((dt-a)/DAYMS)/7)};}
  const ci=calIdx(dt);return{m:ci>=0?ci:S.month,w:3};
}
function curWeek(m){const a=mon(new Date(M_(m).y,M_(m).mo,1));const k=Math.floor(Math.round((TODAY-a)/DAYMS)/7);return Math.max(0,Math.min(3,k));}

/* ---------- Supabase ---------- */
const SB_URL='https://xqxcxmpezqpisoatgxvi.supabase.co';
const SB_KEY='sb_publishable_F_UvmisnMcbr6q5jehsMyA_5fV_pqDz';
const db=window.supabase.createClient(SB_URL,SB_KEY);
const pad2=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const parseD=s=>{const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);};
async function fetchAll(table,orderCols){
  let out=[],from=0;
  for(;;){
    let q=db.from(table).select('*').range(from,from+999);
    (orderCols||['id']).forEach(c=>{q=q.order(c);});
    const {data,error}=await q;
    if(error)throw error;
    out=out.concat(data);
    if(data.length<1000)break;
    from+=1000;
  }
  return out;
}
async function createFirstMonth(){
  const m=await db.from('months').insert({y:TODAY.getFullYear(),mo:TODAY.getMonth(),status:'active',seq:1,inc_j:0,inc_i:0}).select().single();
  if(m.error){if(m.error.code==='23505')return;throw m.error;}
  const l=await db.from('month_limits').insert(Object.entries(DEFLIM).map(([key,amount])=>({month_id:m.data.id,key,amount})));
  if(l.error)throw l.error;
  const p=await db.from('planned_payments').insert(DEFPLAN.map((x,i)=>({month_id:m.data.id,day:x.d,name:x.name,key:x.key,amount:x.amt,sort:i})));
  if(p.error)throw p.error;
}
async function loadAll(){
  const {data:{session}}=await db.auth.getSession();
  if(!session)return 'auth';
  S.email=session.user.email;
  const mem=await fetchAll('members',['user_id']);
  const mine=mem.find(x=>x.user_id===session.user.id);
  if(!mine)return 'onboard';
  S.me=mine.initial;S.members=mem;S.email=session.user.email;
  const keepId=S.months[S.month]?S.months[S.month].id:null;
  const [hh,months,limits,plans,txs,incs,debts]=await Promise.all([
    db.from('households').select('*').limit(1),fetchAll('months'),fetchAll('month_limits',['month_id','key']),
    fetchAll('planned_payments'),fetchAll('transactions'),fetchAll('incomes'),fetchAll('debts',['sub'])]);
  if(hh.error)throw hh.error;
  S.hh=hh.data[0]||null;
  if(!months.length){await createFirstMonth();return loadAll();}
  months.sort((a,b)=>a.y-b.y||a.mo-b.mo);
  const idx={};
  S.months=months.map((r,i)=>{idx[r.id]=i;return{id:r.id,y:r.y,mo:r.mo,status:r.status,seq:r.seq,inc:{J:+r.inc_j,I:+r.inc_i},lim:{},plan:[]};});
  limits.forEach(r=>{const i=idx[r.month_id];if(i!==undefined)S.months[i].lim[r.key]=r.amount===null?null:+r.amount;});
  plans.sort((a,b)=>a.sort-b.sort).forEach(r=>{const i=idx[r.month_id];if(i!==undefined)S.months[i].plan.push({d:r.day,name:r.name,key:r.key,amt:r.amount===null?null:+r.amount});});
  S.tx=txs.filter(r=>idx[r.month_id]!==undefined).map(r=>({id:r.id,m:idx[r.month_id],dt:parseD(r.dt),cat:r.cat,sub:r.sub,amt:+r.amount,who:r.who,note:r.note}));
  S.incTx=incs.filter(r=>idx[r.month_id]!==undefined).map(r=>({id:r.id,m:idx[r.month_id],dt:parseD(r.dt),who:r.who,amt:+r.amount,note:r.note}));
  S.debts=debts;
  CAT.dlh.subs=debts.map(d=>({id:d.sub,name:d.name,bal:+d.balance,asOf:parseD(d.as_of)}));
  let k=keepId?S.months.findIndex(x=>x.id===keepId):-1;
  if(k<0||S.months[k].status==='planned'){k=S.months.findIndex(x=>x.status==='active');if(k<0){const v=vis();k=v.length?v[v.length-1]:0;}}
  S.month=k;S.loaded=true;
  return 'ok';
}
const limT={};
function saveLimit(M,key){
  clearTimeout(limT[M.id+key]);
  limT[M.id+key]=setTimeout(async()=>{
    const {error}=await db.from('month_limits').upsert({month_id:M.id,key,amount:M.lim[key]},{onConflict:'month_id,key'});
    if(error){console.error(error);toast('Limit sa nepodarilo uložiť',true);}
  },400);
}

/* ---------- výpočty ---------- */
const NF0=new Intl.NumberFormat('sk-SK',{maximumFractionDigits:0});
const NF2=new Intl.NumberFormat('sk-SK',{minimumFractionDigits:2,maximumFractionDigits:2});
const nb=s=>s.replace(/\s/g,' ');
const eur=n=>nb((n<0?'−':'')+NF0.format(Math.abs(Math.round(n))))+' €';
const eur2=n=>nb(NF2.format(n))+' €';
const sgn=n=>(Math.round(n)>0?'+':Math.round(n)<0?'−':'')+eur(Math.abs(n));
const sum=a=>a.reduce((x,y)=>x+y,0);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pctOf=(v,l)=>l>0?Math.min(100,v/l*100):0;
const getLim=(m,key)=>{const v=M_(m).lim[key];return v===undefined||v===null?null:v;};
const incExp=m=>M_(m).inc.J+M_(m).inc.I;
const incTxm=m=>S.incTx.filter(t=>t.m===m);
const received=m=>sum(incTxm(m).map(t=>t.amt));
const income=(m=S.month)=>{const r=received(m);return M_(m).status==='closed'?(r||incExp(m)):Math.max(incExp(m),r);};
const txm=m=>S.tx.filter(t=>t.m===m);
const total=m=>sum(txm(m).map(t=>t.amt));
const byCat=m=>{const o={};CATS.forEach(c=>o[c.id]=0);txm(m).forEach(t=>o[t.cat]+=t.amt);return o;};
const bySub=m=>{const o={};txm(m).forEach(t=>{const k=t.cat+'.'+t.sub;o[k]=(o[k]||0)+t.amt;});return o;};
const byWho=m=>{const o={J:0,I:0};txm(m).forEach(t=>o[t.who]+=t.amt);return o;};
const baseLimit=(c,m)=>c.kind==='tithe'?income(m)*.1:c.kind==='manual'?0:(c.subs.length?sum(c.subs.map(s=>getLim(m,c.id+'.'+s.id)||0)):(getLim(m,c.id)||0));
const rawPlan=(m=S.month)=>sum(CATS.filter(c=>c.kind!=='debt').map(c=>baseLimit(c,m)));
const debtPlan=(m=S.month)=>Math.max(0,income(m)-rawPlan(m));
const catLimit=(c,m=S.month)=>c.kind==='debt'?debtPlan(m):baseLimit(c,m);
const budget=(m=S.month)=>sum(CATS.map(c=>catLimit(c,m)));
const debtBal=s=>s.bal-sum(S.tx.filter(t=>t.cat==='dlh'&&t.sub===s.id&&t.dt>=s.asOf).map(t=>t.amt));
function status(spent,limit){
  if(!(limit>0)) return {k:'ok',t:'',i:'check'};
  const p=spent/limit;
  if(p>1.0001) return {k:'bad',t:'Prekročené o '+eur(spent-limit),i:'over'};
  if(p>=.85&&p<.9999) return {k:'warn',t:'Pozor, blízko limitu',i:'alert'};
  return {k:'ok',t:'V norme',i:'check'};
}
const pill=s=>'<span class="pill '+s.k+'">'+ic(s.i,14)+s.t+'</span>';
const flag=s=>s.k==='ok'?'':'<span class="flag '+s.k+'">'+(s.k==='bad'?s.t:'Pozor, blízko limitu')+'</span>';
const dot=(w,sm)=>'<span class="dot '+(sm?'sm ':'')+w+'" title="'+PEOPLE[w]+'" aria-label="'+PEOPLE[w]+'">'+w+'</span>';
const dl=t=>t.dt.getDate()+'. '+MG12[t.dt.getMonth()];
const byDateDesc=(a,b)=>b.dt-a.dt||b.id-a.id;
function subName(c,s,m){return c.kind==='weeks'?weekInfo(m,+s.id[1]).label:s.name;}
function txLabel(t){
  const c=CAT[t.cat]; if(!c.subs.length) return c.name;
  const s=c.subs.find(x=>x.id===t.sub);
  return c.name+(s?' · '+(c.kind==='weeks'?'týždeň '+weekInfo(t.m,+t.sub[1]).n:s.name):'');
}
function txRows(arr){
  return '<div class="list">'+arr.map(t=>'<div class="li"><span class="ico">'+ic(CAT[t.cat].icon,18)+'</span><div class="t"><b>'+esc(t.note||CAT[t.cat].name)+'</b><span>'+esc(txLabel(t))+' · '+dl(t)+'</span></div>'+dot(t.who,true)+'<span class="a num">'+eur2(t.amt)+'</span></div>').join('')+'</div>';
}
function leaves(m){
  const ss=bySub(m),cc=byCat(m),out=[];
  CATS.forEach(c=>{
    if(c.kind==='debt'||c.kind==='manual') return;
    if(c.subs.length) c.subs.forEach(s=>{const l=getLim(m,c.id+'.'+s.id);if(l>0) out.push({c,name:c.name+' · '+(c.kind==='weeks'?'týždeň '+weekInfo(m,+s.id[1]).n:s.name),limit:l,spent:ss[c.id+'.'+s.id]||0});});
    else{const l=catLimit(c,m);if(l>0) out.push({c,name:c.name,limit:l,spent:cc[c.id]});}
  });
  return out;
}
function mpick(){
  const v=vis(),k=v.indexOf(S.month);
  return '<div class="mpick"><button data-act="prev" aria-label="Predchádzajúci mesiac"'+(k<=0?' disabled':'')+'>'+ic('left',18)+'</button><span>'+mname(S.month)+' '+M_(S.month).y+'</span><button data-act="next" aria-label="Nasledujúci mesiac"'+(k>=v.length-1?' disabled':'')+'>'+ic('right',18)+'</button></div>';
}
const head=t=>'<div class="sh"><h1>'+t+'</h1>'+mpick()+'</div>';

/* ---------- prehľad ---------- */
function incomeBlock(m){
  const M=M_(m),recv=received(m),entries=incTxm(m).slice().sort(byDateDesc),shown=S.incAll?entries:entries.slice(0,2);
  return '<div class="blk"><h3>Príjmy <span class="small num">'+eur(recv)+(M.status!=='closed'?' z '+eur(incExp(m))+' očakávaných':'')+'</span></h3><section class="card">'+
   (entries.length?'<div class="list">'+shown.map(t=>'<div class="li"><div class="t"><b>'+esc(t.note)+'</b><span>'+dl(t)+'</span></div>'+dot(t.who,true)+'<span class="a num" style="color:var(--ok)">+'+eur2(t.amt)+'</span></div>').join('')+'</div>'+(entries.length>2?'<button class="link" data-act="incAll" aria-expanded="'+S.incAll+'">'+(S.incAll?'Zobraziť menej':'Zobraziť všetky '+entries.length)+'</button>':''):'<p class="empty">V tomto mesiaci zatiaľ žiadny príjem.</p>')+
   '<button class="btn ghost" style="width:100%;margin-top:12px" data-act="addinc">Pridať príjem</button></section></div>';
}
function planAmt(m,p){return p.amt===null?income(m)*.1:p.amt;}
function relDay(dd){return dd===1?'zajtra':'o '+dd+(dd<5?' dni':' dní');}
function upcomingBlock(m){
  const M=M_(m); if(M.status!=='active') return '';
  const cd=curDay(M), ups=M.plan.filter(p=>p.d>cd&&p.d<=dim(M)).sort((a,b)=>a.d-b.d), left=sum(ups.map(p=>planAmt(m,p)));
  const shown=S.upAll?ups:ups.slice(0,3);
  const rows=shown.map(u=>'<div class="li"><div class="t"><b>'+esc(u.name||'Platba')+'</b><span>'+u.d+'. '+MG12[M.mo]+(TODAY.getMonth()===M.mo&&TODAY.getFullYear()===M.y?' · '+relDay(u.d-cd):'')+'</span></div><span class="a num">'+eur(planAmt(m,u))+'</span></div>').join('');
  return '<div class="blk"><h3>Nastávajúce platby <span class="small num">spolu '+eur(left)+'</span></h3><section class="card">'+(ups.length?'<div class="list">'+rows+'</div>'+(ups.length>3?'<button class="link" data-act="upAll" aria-expanded="'+S.upAll+'">'+(S.upAll?'Zobraziť menej':'Zobraziť všetkých '+ups.length)+'</button>':''):'<p class="empty">V tomto mesiaci už nič nezostáva.</p>')+'</section></div>';
}
function gradRow(name,extra,spent,limit){
  const st=status(spent,limit), left=limit-spent;
  return '<div class="gr"><div class="row-between"><b>'+name+'</b><span class="num"><b>'+eur(spent)+'</b> <span class="small">/ '+eur(limit)+'</span></span></div><div class="track" role="img" aria-label="'+name+': '+eur(spent)+' z '+eur(limit)+'"><div class="fill '+(st.k==='ok'?'':st.k)+'" style="width:'+pctOf(spent,limit)+'%"></div></div><span class="small">'+[extra,st.k==='ok'?'zostáva '+eur(left):''].filter(Boolean).join(' · ')+'</span>'+flag(st)+'</div>';
}
function gradualBlock(m){
  const ss=bySub(m),cc=byCat(m),M=M_(m);
  let food;
  if(M.status==='active'){const k=curWeek(m),w=weekInfo(m,k);food=gradRow('Jedlo · týždeň '+w.n,w.range,ss['jed.w'+k]||0,getLim(m,'jed.w'+k)||0);}
  else food=gradRow('Jedlo','celý mesiac',cc.jed,catLimit(CAT.jed,m));
  return '<div class="blk"><h3>Postupné výdavky</h3><section class="card">'+food+gradRow('Drogéria','',cc.dro,catLimit(CAT.dro,m))+gradRow('Nafta','',ss['aut.nafta']||0,getLim(m,'aut.nafta')||0)+'</section></div>';
}
function doneBlock(m){
  const M=M_(m),a=mon(new Date(M.y,M.mo,1)),b=addDays(mon(new Date(M.y,M.mo,dim(M))),6);
  const all=S.tx.filter(t=>t.dt>=a&&t.dt<=b).sort(byDateDesc), shown=S.doneAll?all:all.slice(0,4);
  return '<div class="blk"><h3>Vykonané platby <span class="small num">'+fd(a)+' – '+fd(b)+'</span></h3><section class="card">'+(all.length?txRows(shown)+(all.length>4?'<button class="link" data-act="doneAll" aria-expanded="'+S.doneAll+'">'+(S.doneAll?'Zobraziť menej':'Zobraziť všetkých '+all.length)+'</button>':''):'<p class="empty">V tomto období zatiaľ žiadna platba.</p>')+'<p class="note" style="margin-top:10px">Mesiac sa na začiatku a na konci dopĺňa na celé týždne.</p></section></div>';
}
function viewHome(){
  const m=S.month, spent=total(m), bud=budget(m), left=bud-spent, open=M_(m).status==='active';
  const need=(open&&incExp(m)===0&&received(m)===0)?'<section class="card"><b>Nastavte príjem</b><p class="small" style="margin:4px 0 10px">Rozpočet a desiatky sa počítajú z príjmu. Zadajte očakávaný príjem J a I.</p><button class="btn sm" data-act="editM" data-m="'+m+'">Nastaviť</button></section>':'';
  const st=open?'':'<div style="margin-top:12px">'+pill(left>=0?{k:'ok',t:'Pod rozpočtom',i:'check'}:{k:'bad',t:'Nad rozpočtom',i:'over'})+'</div>';
  return head('Prehľad')+
  '<section class="card hero"><div class="lbl">Minuté · '+mname(m)+'</div><div class="big num">'+eur(spent)+'</div>'+
  '<div class="track" role="img" aria-label="Minuté '+eur(spent)+' z '+eur(bud)+'"><div class="fill'+(spent>bud?' bad':'')+'" style="width:'+pctOf(spent,bud)+'%"></div></div>'+
  '<div class="row-between small" style="margin-top:8px"><span class="num">z '+eur(bud)+' rozpočtu</span><span class="num">'+(left>=0?'zostáva <b>'+eur(left)+'</b>':'nad o <b>'+eur(-left)+'</b>')+'</span></div>'+st+'</section>'+
  need+upcomingBlock(m)+gradualBlock(m)+doneBlock(m);
}

/* ---------- rozpočet ---------- */
function stepper(act,attrs,val,label,d){
  return '<div class="ctl"><button data-act="'+act+'" '+attrs+' data-d="-'+d+'" aria-label="Znížiť '+label+' o '+d+' eur">−</button><output class="num">'+eur(val)+'</output><button data-act="'+act+'" '+attrs+' data-d="'+d+'" aria-label="Zvýšiť '+label+' o '+d+' eur">+</button></div>';
}
function subsHtml(c,m){
  const ss=bySub(m);
  if(c.kind==='tithe') return '<div class="subs"><p class="small" style="margin:0 0 8px">Vždy 10 % z príjmu ('+eur(income(m))+'). Limit sa nastavuje sám.</p>'+(txm(m).some(t=>t.cat==='des')?txRows(txm(m).filter(t=>t.cat==='des')):'<p class="empty">V tomto mesiaci zatiaľ bez zápisu.</p>')+'</div>';
  if(c.kind==='manual') return '<div class="subs"><p class="small" style="margin:0 0 8px">Bez limitu, len ručné zápisy.</p>'+(txm(m).some(t=>t.cat==='ost')?txRows(txm(m).filter(t=>t.cat==='ost').sort(byDateDesc)):'<p class="empty">V tomto mesiaci zatiaľ bez zápisu.</p>')+'</div>';
  if(c.kind==='debt') return '<div class="subs"><p class="small" style="margin:0 0 4px">Sumy sú zostatky dlhov. Plán splátok je zvyšok príjmu po ostatných kategóriách ('+eur(debtPlan(m))+').</p>'+c.subs.map(s=>{const paid=sum(txm(m).filter(t=>t.cat==='dlh'&&t.sub===s.id).map(t=>t.amt));return '<div class="sub"><div class="nm">'+s.name+'<span>Splatené v mesiaci: '+eur(paid)+'</span></div><div class="rt num">'+eur(debtBal(s))+'</div></div>';}).join('')+'<div class="sub"><div class="nm"><b>Dlhy spolu</b></div><div class="rt num">'+eur(sum(c.subs.map(debtBal)))+'</div></div></div>';
  if(!c.subs.length) return '<div class="subs"><div class="sub"><div class="nm">Mesačný limit</div>'+stepper('lim','data-c="'+c.id+'"',getLim(m,c.id)||0,'limit',10)+'</div></div>';
  return '<div class="subs">'+c.subs.map(s=>{
    const key=c.id+'.'+s.id, v=ss[key]||0, l=getLim(m,key), has=l!==null;
    const st=has?status(v,l):null;
    return '<div class="sub"><div class="nm">'+subName(c,s,m)+'<span class="num">'+eur(v)+(has?' z '+eur(l):' · bez limitu')+'</span></div>'+stepper('lim','data-c="'+c.id+'" data-s="'+s.id+'"',l||0,'limit',has&&l>=100?10:5)+(has?'<div class="track"><div class="fill '+(st.k==='ok'?'':st.k)+'" style="width:'+pctOf(v,l)+'%"></div></div>':'')+'</div>';
  }).join('')+'</div>';
}
function grpStats(m,list){const cc=byCat(m);return {spent:sum(list.map(c=>cc[c.id])),limit:sum(list.map(c=>catLimit(c,m)))};}
function catRow(c,m,cc){
  const v=cc[c.id], lim=catLimit(c,m), s=status(v,lim), op=S.expanded===c.id;
  const right=lim>0?'<b>'+eur(v)+'</b> <i>/ '+eur(lim)+'</i>':'<b>'+eur(v)+'</b> <i>bez limitu</i>';
  return '<div class="b"><button class="b-head" data-act="exp" data-c="'+c.id+'" aria-expanded="'+op+'"><div class="b-top"><span class="ico">'+ic(c.icon,18)+'</span><div class="t"><b>'+c.name+'</b>'+flag(s)+'</div><span class="num rt2">'+right+'</span></div>'+(lim>0?'<div class="track thin"><div class="fill '+(s.k==='ok'?'':s.k)+'" style="width:'+pctOf(v,lim)+'%"></div></div>':'')+'</button>'+(op?subsHtml(c,m):'')+'</div>';
}
function viewBudgets(){
  const m=S.month, cc=byCat(m);
  const gl=k=>CATS.filter(c=>c.grp===k);
  const sel=S.grp, list=sel==='all'?CATS:gl(sel);
  const g=grpStats(m,list), left=g.limit-g.spent, st=status(g.spent,g.limit);
  const tabs=[['all','Spolu']].concat(GRPS).map(x=>'<button data-act="grp" data-g="'+x[0]+'" aria-pressed="'+(S.grp===x[0])+'">'+x[1]+'</button>').join('');
  const summary='<section class="card"><div class="small">'+(left>=0?'Zostáva':'Prekročené o')+'</div><div class="big2 num">'+eur(Math.abs(left))+'</div><div class="track"><div class="fill '+(st.k==='ok'?'':st.k)+'" style="width:'+pctOf(g.spent,g.limit)+'%"></div></div><div class="row-between small" style="margin-top:8px"><span>Minuté <b class="num">'+eur(g.spent)+'</b></span><span class="num">z '+eur(g.limit)+'</span></div></section>';
  const body=sel==='all'?GRPS.map(gr=>{const l=gl(gr[0]),s2=grpStats(m,l);return '<div class="blk"><h3>'+gr[1]+' <span class="small num">'+eur(s2.spent)+' z '+eur(s2.limit)+'</span></h3><section class="card bud">'+l.map(c=>catRow(c,m,cc)).join('')+'</section></div>';}).join(''):'<section class="card bud">'+list.map(c=>catRow(c,m,cc)).join('')+'</section>';
  const raw=rawPlan(m),inc=income(m);
  return head('Rozpočet')+'<div class="seg full" role="group" aria-label="Skupina výdavkov">'+tabs+'</div>'+summary+(sel==='all'?incomeBlock(m):'')+body+
    '<p class="note">Zmena limitu platí len pre mesiac '+mname(m)+'. Celý mesiac upravíte v karte Plán.</p>'+(raw>inc?'<div class="warnbox">Plán bez dlhov prevyšuje príjem o '+eur(raw-inc)+'.</div>':'');
}

/* ---------- grafy a analytika ---------- */
function chartMonths(){
  const ids=vis(),N=ids.length,buds=ids.map(i=>budget(i)),tots=ids.map(total);
  const max=Math.ceil(Math.max(...buds,...tots)*1.08/1000)*1000;
  const W=340,H=180,l=36,r=6,t=16,b=24,pw=W-l-r,ph=H-t-b,y=v=>t+ph-v/max*ph,band=pw/N,bw=Math.min(28,band-8);
  let g='<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="hatch-bg"/><line x1="0" y1="0" x2="0" y2="6" class="hatch-ln"/></pattern></defs>';
  for(let v=0;v<=max;v+=1000) g+='<line class="grid" x1="'+l+'" x2="'+(W-r)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="ax" x="'+(l-6)+'" y="'+(y(v)+3)+'" text-anchor="end">'+NF0.format(v)+'</text>';
  let bars='',marks='',hits='';
  ids.forEach((i,k)=>{
    const v=tots[k],bx=l+band*k+(band-bw)/2,top=y(v),sel=i===S.month,open=M_(i).status==='active';
    const fill=open?'url(#hatch)':sel?'var(--bar)':'var(--bar-soft)';
    const stroke=open?' stroke="var(--bar)" stroke-width="'+(sel?2.5:1.5)+'"':'';
    bars+='<path d="M'+bx+','+(t+ph)+' V'+(top+4)+' a4,4 0 0 1 4,-4 h'+(bw-8)+' a4,4 0 0 1 4,4 V'+(t+ph)+' Z" fill="'+fill+'"'+stroke+'/>';
    if(sel) bars+='<text class="vlab" x="'+(bx+bw/2)+'" y="'+(top-5)+'" text-anchor="middle">'+eur(v)+'</text>';
    bars+='<text class="ax" x="'+(bx+bw/2)+'" y="'+(H-7)+'" text-anchor="middle" style="'+(sel?'font-weight:700;fill:var(--ink)':'')+'">'+mshort(i)+'</text>';
    marks+='<line class="budget" x1="'+(l+band*k+3)+'" x2="'+(l+band*(k+1)-3)+'" y1="'+y(buds[k])+'" y2="'+y(buds[k])+'"/>';
    hits+='<rect class="hit" x="'+(l+band*k)+'" y="'+t+'" width="'+band+'" height="'+ph+'" data-act="pick" data-m="'+i+'" data-tip="'+mname(i)+': '+eur(v)+' z '+eur(buds[k])+(open?' (priebežne)':'')+'"/>';
  });
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Výdavky v jednotlivých mesiacoch oproti rozpočtu mesiaca">'+g+bars+marks+hits+'</svg>';
}
function tableMonths(){
  return '<div class="tscroll"><table><thead><tr><th>Mesiac</th><th>Výdavky</th><th>Rozpočet</th><th>Rozdiel</th></tr></thead><tbody>'+vis().map(i=>{const v=total(i),b=budget(i),d=v-b,open=M_(i).status==='active';return '<tr><td>'+mname(i)+(open?' (priebežne)':'')+'</td><td>'+eur(v)+'</td><td>'+eur(b)+'</td><td class="'+(open?'':d>0?'bad':'ok')+'">'+(open?'–':sgn(d))+'</td></tr>';}).join('')+'</tbody></table></div>';
}
function breakdown(){
  const m=S.month,cc=byCat(m),tot=total(m)||1;
  const items=CATS.map(c=>({c,v:cc[c.id]})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v),mx=items[0]?items[0].v:1,shown=items.slice(0,6),rest=items.slice(6);
  const v0=vis(),k0=v0.indexOf(m),prevs=v0.slice(Math.max(0,k0-3),k0),showDelta=M_(m).status==='closed'&&prevs.length>0;
  return '<div class="hb">'+shown.map(({c,v})=>{
    let d='';
    if(showDelta){const avg=sum(prevs.map(k=>byCat(k)[c.id]))/prevs.length;if(avg>0&&Math.abs(Math.round((v-avg)/avg*100))>=15){const pc=Math.round((v-avg)/avg*100);d='<div class="dl'+(pc>=15?' up':'')+'">'+(pc>0?'▲ +':'▼ −')+Math.abs(pc)+' % oproti priemeru predošlých mesiacov</div>';}}
    return '<div class="hb-r"><span class="nm">'+c.name+'</span><span class="vl num">'+eur(v)+' · '+Math.round(v/tot*100)+' %</span><div class="tr"><i style="width:'+v/mx*100+'%"></i></div>'+d+'</div>';
  }).join('')+(rest.length?'<p class="note">Ďalších '+rest.length+' kategórií: '+eur(sum(rest.map(x=>x.v)))+'</p>':'')+'</div>';
}
function insights(){
  const m=S.month,cc=byCat(m),list=[];
  const v0=vis(),k0=v0.indexOf(m),prevs=v0.slice(Math.max(0,k0-3),k0);
  if(M_(m).status==='closed'&&prevs.length){
    let best=null;CATS.filter(c=>c.kind!=='debt').forEach(c=>{const avg=sum(prevs.map(k=>byCat(k)[c.id]))/prevs.length,df=cc[c.id]-avg;if(!best||df>best.df)best={c,df};});
    if(best&&best.df>20) list.push('Najväčší nárast: <b>'+best.c.name+'</b>, o '+eur(best.df)+' viac než je priemer predošlých mesiacov.');
  }
  const over=leaves(m).filter(x=>x.spent>x.limit+.005).sort((a,b)=>(b.spent-b.limit)-(a.spent-a.limit));
  if(over.length) list.push('Nad limitom: '+over.slice(0,3).map(x=>'<b>'+esc(x.name)+'</b> (+'+eur(x.spent-x.limit)+')').join(', ')+(over.length>3?' a ďalšie '+(over.length-3):'')+'.');
  else list.push('Žiadna položka nie je nad limitom.');
  if(M_(m).status==='closed'){const ss=bySub(m);const n=[0,1,2,3].filter(k=>(ss['jed.w'+k]||0)>(getLim(m,'jed.w'+k)||0)).length;list.push('Jedlo: nad limitom boli <b>'+n+' zo 4</b> týždňov.');}
  const dp=sum(txm(m).filter(t=>t.cat==='dlh').map(t=>t.amt));
  list.push('Na splátky dlhov išlo <b>'+eur(dp)+'</b>'+(M_(m).status==='closed'?' z plánovaných '+eur(debtPlan(m)):'')+'.');
  return '<ul class="ins">'+list.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
}
function viewAnalytics(){
  const tabs='<div class="seg full" role="group" aria-label="Analytika"><button data-act="anatab" data-v="ana" aria-pressed="'+(S.anaTab==='ana')+'">Grafy</button><button data-act="anatab" data-v="rep" aria-pressed="'+(S.anaTab==='rep')+'">Report</button></div>';
  if(S.anaTab==='rep') return head('Analytika')+tabs+viewReport();
  const m=S.month,who=byWho(m),wt=who.J+who.I||1;
  return head('Analytika')+tabs+
  '<div class="blk"><div class="row-between" style="margin-bottom:8px"><h3 style="margin:0">Výdavky po mesiacoch</h3><div class="seg" role="group" aria-label="Zobrazenie"><button data-act="trend" data-v="chart" aria-pressed="'+(S.trend==='chart')+'">Graf</button><button data-act="trend" data-v="table" aria-pressed="'+(S.trend==='table')+'">Tabuľka</button></div></div><section class="card">'+
  (S.trend==='chart'?'<div class="legend"><span><i class="sw" style="background:var(--bar)"></i>Výdavky</span><span><i class="sw dash"></i>Rozpočet mesiaca</span></div>'+chartMonths()+'<p class="note">Klepnutím na stĺpec vyberiete mesiac.</p>':tableMonths())+'</section></div>'+
  '<div class="blk"><h3>Kam idú peniaze · '+mname(m)+'</h3><section class="card">'+breakdown()+'</section></div>'+
  '<div class="blk"><h3>Kto platí · '+mname(m)+'</h3><section class="card"><div class="legend" style="margin:0"><span>'+dot('J',true)+'J <b class="num">'+eur(who.J)+'</b> · '+Math.round(who.J/wt*100)+' %</span><span>'+dot('I',true)+'I <b class="num">'+eur(who.I)+'</b> · '+Math.round(who.I/wt*100)+' %</span></div><div class="split"><i class="J" style="flex:'+who.J/wt+'"></i><i class="I" style="flex:'+who.I/wt+'"></i></div></section></div>'+
  '<div class="blk"><h3>Čo si všimnúť</h3><section class="card">'+insights()+'</section></div>';
}
function viewReport(){
  const m=S.month;
  if(M_(m).status==='active'){
    const closed=S.months.map((x,i)=>i).filter(i=>S.months[i].status==='closed'),li=closed[closed.length-1];
    return '<section class="card"><h3 style="margin:0 0 8px;font-size:15px">'+mname(m)+' ešte beží</h3><p class="sentence" style="margin-bottom:12px">Report vznikne po uzavretí mesiaca v karte Plán.</p>'+(li!==undefined?'<button class="btn" data-act="goLast" data-m="'+li+'">Zobraziť '+mname(li).toLowerCase()+'</button>':'')+'</section>'+deliv();
  }
  const spent=total(m),bud=budget(m),diff=spent-bud,rest=income(m)-spent,cc=byCat(m),pi=prevVis(m);
  const sentence='V mesiaci '+mname(m).toLowerCase()+' ste minuli '+eur(spent)+', '+(diff>0?'o '+eur(diff)+' nad rozpočtom':'o '+eur(-diff)+' pod rozpočtom')+'. Z príjmov '+eur(income(m))+' vám '+(rest>=0?'zostalo '+eur(rest)+'.':'chýba '+eur(-rest)+'.');
  const lv=leaves(m).filter(x=>x.spent>x.limit+.005).sort((a,b)=>(b.spent-b.limit)-(a.spent-a.limit));
  const row=(n,pl,sk)=>{const d=sk-pl;return '<tr><td>'+n+'</td><td>'+eur(pl)+'</td><td>'+eur(sk)+'</td><td class="'+(d>.5?'bad':'ok')+'">'+sgn(d)+'</td></tr>';};
  const gr=GRPS.map(g=>{const s=grpStats(m,CATS.filter(c=>c.grp===g[0]));return row(g[1],s.limit,s.spent);}).join('')+row('<b>Spolu</b>',bud,spent);
  const all=S.repAll?'<div class="tscroll" style="margin-top:10px"><table><tbody>'+CATS.filter(c=>catLimit(c,m)>0||cc[c.id]>0).map(c=>row(c.name,catLimit(c,m),cc[c.id])).join('')+'</tbody></table></div>':'';
  return '<section class="card"><p class="sentence">'+sentence+'</p></section>'+
  '<section class="card"><div class="kpis"><div><div class="k">Príjmy</div><div class="v num">'+eur(income(m))+'</div></div><div><div class="k">Výdavky</div><div class="v num">'+eur(spent)+'</div><div class="s num">'+(pi>=0?sgn(spent-total(pi))+' voči '+mshort(pi):'')+'</div></div><div><div class="k">Zostalo</div><div class="v num">'+eur(rest)+'</div></div></div></section>'+
  '<div class="blk"><h3>Plnenie rozpočtu</h3><section class="card"><div class="tscroll"><table><thead><tr><th>Skupina</th><th>Plán</th><th>Skutočnosť</th><th>Rozdiel</th></tr></thead><tbody>'+gr+'</tbody></table></div><button class="link" data-act="repAll" aria-expanded="'+S.repAll+'">'+(S.repAll?'Skryť kategórie':'Zobraziť kategórie')+'</button>'+all+'</section></div>'+
  '<div class="blk"><h3>Položky nad limitom</h3><section class="card">'+(lv.length?'<div class="list">'+lv.slice(0,5).map(x=>'<div class="li"><div class="t"><b>'+esc(x.name)+'</b><span class="num">'+eur(x.spent)+' z '+eur(x.limit)+'</span></div><span class="a num" style="color:var(--bad)">+'+eur(x.spent-x.limit)+'</span></div>').join('')+'</div>':'<p class="empty">Všetky položky sú v limite.</p>')+'</section></div>'+deliv();
}
function deliv(){return '';}
function _delivOld(){
  return '<div class="blk"><h3>Doručenie reportu</h3><section class="card"><p class="small" style="margin:0 0 4px">E-mailom po uzavretí mesiaca. V prototype sa neodosiela.</p>'+['J','I'].map(w=>'<div class="sw-row"><span class="who">'+dot(w,true)+PEOPLE[w]+'</span><button class="switch" role="switch" aria-checked="'+S.rep[w]+'" aria-label="Posielať report: '+PEOPLE[w]+'" data-act="rep" data-w="'+w+'"></button></div>').join('')+'</section></div>';
}

/* ---------- plán ---------- */
function nextMonthOf(){const l=S.months[S.months.length-1];return {y:l.mo===11?l.y+1:l.y,mo:(l.mo+1)%12};}
function householdBlock(){
  const hh=S.hh||{},full=S.members.length>=2;
  return '<div class="blk"><h3>Domácnosť</h3><section class="card"><div class="row-between"><span>Ste prihlásený ako</span>'+dot(S.me,true)+'</div>'+
   (full?'<p class="small" style="margin:10px 0 0">V domácnosti sú obaja členovia.</p>':'<p class="small" style="margin:10px 0 6px">Druhý člen sa pridá po registrácii zadaním tohto kódu:</p><div class="code">'+esc(hh.invite_code||'')+'</div>')+
   '<button class="btn ghost" style="width:100%;margin-top:12px" data-act="logout">Odhlásiť</button></section></div>';
}
function viewPlan(){
  const act=S.months.findIndex(x=>x.status==='active');
  const planned=S.months.map((x,i)=>i).filter(i=>S.months[i].status==='planned');
  const closed=S.months.map((x,i)=>i).filter(i=>S.months[i].status==='closed').reverse();
  const nx=nextMonthOf();
  let actHtml='';
  if(act>=0){
    const next=S.months[act+1]&&S.months[act+1].status==='planned'?act+1:-1;
    const conf=S.confirm&&next>=0?'<div class="confirm"><p style="margin:0 0 10px"><b>Ukončiť '+mname(act)+' a aktivovať '+mname(next)+'?</b><br><span class="small">'+mname(act)+' sa presunie do histórie. Dá sa naďalej otvoriť aj upraviť.</span></p><div class="btns"><button class="btn sm" data-act="doSwitch">Áno, prepnúť</button><button class="btn sm ghost" data-act="cancelSwitch">Zrušiť</button></div></div>':'';
    actHtml='<div class="blk"><h3>Aktívny mesiac</h3><section class="card"><div class="row-between"><div><div class="mt">'+mname(act)+' '+M_(act).y+'</div><div class="small">Aktívny, kým ho neprepnete.</div></div><span class="pill ok">'+ic('check',14)+'Aktívny</span></div><div class="row-between small" style="margin-top:12px"><span>Minuté <b class="num">'+eur(total(act))+'</b></span><span class="num">z '+eur(budget(act))+'</span></div><div class="btns" style="margin-top:12px"><button class="btn ghost sm" data-act="editM" data-m="'+act+'">Upraviť</button>'+(next>=0?'<button class="btn sm" data-act="askSwitch">Prepnúť na '+mname(next)+'</button>':'')+'</div>'+(next<0?'<p class="note" style="margin-top:10px">Na prepnutie najprv pridajte nasledujúci mesiac.</p>':'')+conf+'</section></div>';
  }
  const plHtml='<div class="blk"><h3>Plánované mesiace</h3><section class="card">'+(planned.length?'<div class="list">'+planned.map(i=>'<div class="li"><div class="t"><b>'+mname(i)+' '+M_(i).y+'</b><span class="num">rozpočet '+eur(budget(i))+' · príjem '+eur(incExp(i))+'</span></div><button class="btn ghost sm" data-act="editM" data-m="'+i+'">Upraviť</button></div>').join('')+'</div>':'<p class="empty">Zatiaľ žiadny plánovaný mesiac.</p>')+'<button class="btn" style="width:100%;margin-top:12px" data-act="newM">Pridať mesiac '+MN12[nx.mo].toLowerCase()+' '+nx.y+'</button></section></div>';
  const hiHtml='<div class="blk"><h3>História</h3><section class="card">'+(closed.length?'<div class="list">'+closed.map(i=>{const sp=total(i),rest=income(i)-sp;return '<div class="li col"><div class="t"><b>'+mname(i)+' '+M_(i).y+'</b><span class="num">minuté '+eur(sp)+' · zostalo '+eur(rest)+'</span></div><div class="btns"><button class="btn ghost sm" data-act="viewM" data-m="'+i+'">Zobraziť</button><button class="btn ghost sm" data-act="editM" data-m="'+i+'">Upraviť</button></div></div>';}).join('')+'</div>':'<p class="empty">Zatiaľ žiadny uzavretý mesiac.</p>')+'</section></div>';
  return '<div class="sh"><h1>Plán</h1></div>'+actHtml+plHtml+hiHtml+householdBlock();
}

/* ---------- editor mesiaca ---------- */
let E=null;
const planOpts=()=>CATS.filter(c=>c.kind!=='manual'&&c.kind!=='weeks').map(c=>c.subs.length?'<optgroup label="'+c.name+'">'+c.subs.map(s=>'<option value="'+c.id+'.'+s.id+'">'+c.name+' · '+s.name+'</option>').join('')+'</optgroup>':'<option value="'+c.id+'">'+c.name+'</option>').join('');
function openEditor(mode,idx){
  let src,y,mo;
  if(mode==='edit'){src=M_(idx);y=src.y;mo=src.mo;}
  else{src=S.months.reduce((a,b)=>b.seq>a.seq?b:a);const n=nextMonthOf();y=n.y;mo=n.mo;}
  E={mode,idx,y,mo,draft:{inc:Object.assign({},src.inc),lim:Object.assign({},src.lim),plan:src.plan.map(p=>Object.assign({},p))}};
  renderEditor();$('editor').hidden=false;
}
function renderEditor(keep){
  const ed=$('editor'),old=ed.querySelector('.ed-body'),st=old&&keep?old.scrollTop:0,dr=E.draft,M={y:E.y,mo:E.mo};
  const incSum=dr.inc.J+dr.inc.I;
  const limRows=CATS.filter(c=>c.kind!=='manual').map(c=>{
    if(c.kind==='tithe') return '<div class="eg"><div class="eg-h">'+c.name+'</div><p class="small" style="margin:0">10 % z príjmu, teda '+eur(incSum*.1)+'.</p></div>';
    if(c.kind==='debt') return '<div class="eg"><div class="eg-h">'+c.name+'</div><p class="small" style="margin:0">Zvyšok príjmu po ostatných kategóriách sa použije na splátky.</p></div>';
    const rows=c.subs.length?c.subs.map((s,k)=>{const key=c.id+'.'+s.id,v=dr.lim[key];return '<div class="fr"><label for="e-lim-'+c.id+'-'+s.id+'">'+(c.kind==='weeks'?weekInfoM(M,k).label:s.name)+'</label><input class="num-in" type="text" inputmode="decimal" id="e-lim-'+c.id+'-'+s.id+'" data-k="lim.'+key+'" value="'+(v===null||v===undefined?'':v)+'" placeholder="bez limitu" aria-label="Limit '+esc(s.name)+'"></div>';}).join(''):'<div class="fr"><label for="e-lim-'+c.id+'">Mesačný limit</label><input class="num-in" type="text" inputmode="decimal" id="e-lim-'+c.id+'" data-k="lim.'+c.id+'" value="'+(dr.lim[c.id]??'')+'" aria-label="Limit '+c.name+'"></div>';
    return '<div class="eg"><div class="eg-h">'+c.name+'</div>'+rows+'</div>';
  }).join('');
  const plRows=dr.plan.map((p,i)=>'<div class="pl"><div class="pl-1"><label class="fld2" for="e-pl-'+i+'-d">Deň<input class="num-in sm" type="text" inputmode="numeric" id="e-pl-'+i+'-d" data-k="pl.'+i+'.d" value="'+p.d+'"></label><label class="fld2 grow" for="e-pl-'+i+'-name">Názov<input class="txt-in" type="text" id="e-pl-'+i+'-name" data-k="pl.'+i+'.name" value="'+esc(p.name)+'"></label><label class="fld2" for="e-pl-'+i+'-amt">Suma<input class="num-in sm" type="text" inputmode="decimal" id="e-pl-'+i+'-amt" data-k="pl.'+i+'.amt" value="'+(p.amt===null?'10 %':p.amt)+'"'+(p.amt===null?' disabled':'')+'></label></div><div class="pl-2"><label class="fld2 grow" for="e-pl-'+i+'-key">Kategória<select class="txt-in" id="e-pl-'+i+'-key" data-k="pl.'+i+'.key">'+planOpts().replace('value="'+p.key+'"','value="'+p.key+'" selected')+'</select></label><button type="button" class="x" data-act="plDel" data-i="'+i+'" aria-label="Odstrániť platbu">'+ic('trash',16)+'</button></div></div>').join('');
  ed.innerHTML='<div class="ed-head"><button type="button" class="x" data-act="edClose" aria-label="Zavrieť">'+ic('x',18)+'</button><h2>'+(E.mode==='new'?'Nový mesiac':'Upraviť mesiac')+' · '+MN12[E.mo]+' '+E.y+'</h2></div>'+
   '<div class="ed-body">'+(E.mode==='new'?'<p class="small" style="margin:0">Predvyplnené podľa naposledy pridaného mesiaca. Upravte, čo treba, a uložte.</p>':'')+
   '<section class="card"><h3 class="eh">Očakávaný príjem</h3>'+['J','I'].map(w=>'<div class="fr"><label for="e-inc-'+w+'">'+PEOPLE[w]+'</label><input class="num-in" type="text" inputmode="decimal" id="e-inc-'+w+'" data-k="inc.'+w+'" value="'+dr.inc[w]+'"></div>').join('')+'<div class="fr"><b>Spolu</b><b class="num">'+eur(incSum)+'</b></div></section>'+
   '<section class="card"><h3 class="eh">Limity kategórií</h3>'+limRows+'</section>'+
   '<section class="card"><h3 class="eh">Plánované platby</h3>'+(dr.plan.length?plRows:'<p class="empty">Zatiaľ žiadna plánovaná platba.</p>')+'<button type="button" class="btn ghost" style="width:100%;margin-top:12px" data-act="plAdd">Pridať platbu</button></section></div>'+
   '<div class="ed-foot"><button type="button" class="btn" data-act="edSave">Uložiť mesiac</button></div>';
  ed.querySelector('.ed-body').scrollTop=st;
}
function edInput(e){
  const el=e.target.closest('[data-k]');if(!el||!E)return;
  const k=el.dataset.k.split('.'),v=el.value,num=x=>{const n=parseFloat(String(x).replace(/\s/g,'').replace(',','.'));return isFinite(n)&&n>=0?n:0;};
  const dr=E.draft;
  if(k[0]==='inc') dr.inc[k[1]]=num(v);
  else if(k[0]==='lim'){const key=k.slice(1).join('.');dr.lim[key]=v.trim()===''?null:num(v);}
  else if(k[0]==='pl'){const p=dr.plan[+k[1]];if(k[2]==='d')p.d=Math.max(1,Math.min(31,Math.round(num(v))||1));else if(k[2]==='name')p.name=v;else if(k[2]==='amt')p.amt=num(v);else if(k[2]==='key')p.key=v;}
}
async function saveEditor(){
  const dr=E.draft,days=new Date(E.y,E.mo+1,0).getDate();
  dr.plan.forEach(p=>{p.d=Math.min(p.d,days);});
  const btn=document.querySelector('[data-act=edSave]');if(btn)btn.disabled=true;
  try{
    let mid;
    if(E.mode==='edit'){
      mid=M_(E.idx).id;
      const u=await db.from('months').update({inc_j:dr.inc.J,inc_i:dr.inc.I}).eq('id',mid);
      if(u.error)throw u.error;
    }else{
      const hasAct=S.months.some(x=>x.status==='active'),seq=Math.max(0,...S.months.map(x=>x.seq))+1;
      const ins=await db.from('months').insert({y:E.y,mo:E.mo,status:hasAct?'planned':'active',seq,inc_j:dr.inc.J,inc_i:dr.inc.I}).select().single();
      if(ins.error)throw ins.error;
      mid=ins.data.id;
    }
    const lr=await db.from('month_limits').upsert(Object.entries(dr.lim).map(([key,amount])=>({month_id:mid,key,amount})),{onConflict:'month_id,key'});
    if(lr.error)throw lr.error;
    const del=await db.from('planned_payments').delete().eq('month_id',mid);
    if(del.error)throw del.error;
    if(dr.plan.length){
      const pr=await db.from('planned_payments').insert(dr.plan.map((p,i)=>({month_id:mid,day:p.d,name:p.name,key:p.key,amount:p.amt,sort:i})));
      if(pr.error)throw pr.error;
    }
    const wasNew=E.mode==='new',mo=E.mo;
    E=null;$('editor').hidden=true;S.tab='plan';
    await loadAll();render();
    toast('Mesiac '+MN12[mo].toLowerCase()+(wasNew?' pridaný':' uložený'));
  }catch(err){
    console.error(err);toast('Mesiac sa nepodarilo uložiť',true);if(btn)btn.disabled=false;
  }
}
async function doSwitch(){
  const act=S.months.findIndex(x=>x.status==='active'),nx=act+1;
  if(act<0||!S.months[nx]||S.months[nx].status!=='planned')return;
  const r=await db.rpc('activate_month',{p_month:S.months[nx].id});
  if(r.error){console.error(r.error);toast('Prepnutie sa nepodarilo',true);return;}
  S.confirm=false;S.upAll=false;S.doneAll=false;S.incAll=false;
  await loadAll();S.month=S.months.findIndex(x=>x.status==='active');render();
  toast(mname(S.month)+' je teraz aktívny');
}

/* ---------- shell ---------- */
const TABS=[['home','Prehľad','grid'],['bud','Rozpočet','pie'],null,['ana','Analytika','bars'],['plan','Plán','cal']];
const $=id=>document.getElementById(id);
function renderTabs(){
  $('tabbar').innerHTML=TABS.map(t=>t?'<button class="tab" data-act="tab" data-t="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+ic(t[2],22)+t[1]+'</button>':'<button class="fab" data-act="add" aria-label="Pridať výdavok alebo príjem">'+ic('plus',26)+'</button>').join('');
}
function render(keepScroll){
  const sc=$('screen'),st=sc.scrollTop;
  sc.innerHTML=({home:viewHome,bud:viewBudgets,ana:viewAnalytics,plan:viewPlan})[S.tab]();
  sc.scrollTop=keepScroll?st:0;
  hideTip();renderTabs();
}
function sheetDate(){const v=$('date').value;let d=v?new Date(v+'T00:00:00'):new Date(TODAY);if(isNaN(d))d=new Date(TODAY);if(d>TODAY)d=new Date(TODAY);return d;}
function renderSheet(){
  const inc=S.mode==='inc';
  $('stitle').textContent=inc?'Nový príjem':'Nový výdavok';$('save').textContent=inc?'Pridať príjem':'Pridať výdavok';
  $('m-exp').setAttribute('aria-pressed',!inc);$('m-inc').setAttribute('aria-pressed',inc);
  $('catwrap').hidden=inc;$('wholbl').textContent=inc?'Kto dostal':'Kto platil';$('note').placeholder=inc?'Napr. Výplata':'Napr. Lidl';
  $('chips').innerHTML=GRPS.map(g=>'<div class="gl">'+g[1]+'</div><div class="subchips">'+CATS.filter(c=>c.grp===g[0]).map(c=>'<button type="button" class="sc" data-act="cat" data-c="'+c.id+'" aria-pressed="'+(S.draft.cat===c.id)+'">'+c.name+'</button>').join('')+'</div>').join('');
  $('whoseg').innerHTML=['J','I'].map(w=>'<button type="button" data-act="who" data-w="'+w+'" aria-pressed="'+(S.draft.who===w)+'">'+dot(w,true)+PEOPLE[w]+'</button>').join('');
  const sw=$('subwrap');
  if(inc){sw.innerHTML='<div class="subchips">'+['Výplata','Odmena','Iný príjem'].map(n=>'<button type="button" class="sc" data-act="preset" data-n="'+n+'">'+n+'</button>').join('')+'</div>';return;}
  const c=CAT[S.draft.cat];
  if(c.kind==='weeks'){const fa=foodAssign(sheetDate()),w=weekInfo(fa.m,fa.w);sw.innerHTML='<p class="note">Zapíše sa do týždňa '+w.n+' ('+w.range+') podľa dátumu.</p>';}
  else if(c.subs.length) sw.innerHTML='<div class="sec-t" style="margin-bottom:8px">'+(c.kind==='debt'?'Komu':'Podkategória')+'</div><div class="subchips">'+c.subs.map(s=>'<button type="button" class="sc" data-act="sub" data-s="'+s.id+'" aria-pressed="'+(S.draft.sub===s.id)+'">'+s.name+'</button>').join('')+'</div>';
  else sw.innerHTML='';
}
function parseAmt(){const v=parseFloat($('amt').value.replace(/\s/g,'').replace(',','.'));return isFinite(v)&&v>0?v:0;}
function openSheet(mode){
  S.mode=mode||'exp';S.draft={cat:'jed',sub:'',who:S.me};$('amt').value='';$('note').value='';$('date').max=iso(TODAY);$('date').min=iso(new Date(S.months[0].y,S.months[0].mo,1));$('date').value=iso(TODAY);$('save').disabled=true;
  renderSheet();$('sheet').hidden=false;setTimeout(()=>$('amt').focus(),30);
}
function closeSheet(){$('sheet').hidden=true;}
let toastT;
function toast(msg,err){const t=$('toast');t.className='toast'+(err?' err':'');t.innerHTML=ic(err?'alert':'check',18)+esc(msg);t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600);}
function stepVis(dir){const v=vis(),k=v.indexOf(S.month)+dir;if(k>=0&&k<v.length){S.month=v[k];S.expanded=null;S.doneAll=false;S.upAll=false;S.incAll=false;render(true);}}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act;
  if(a==='tab'){S.tab=el.dataset.t;S.confirm=false;render();}
  else if(a==='prev')stepVis(-1);
  else if(a==='next')stepVis(1);
  else if(a==='pick'){S.month=+el.dataset.m;render(true);}
  else if(a==='exp'){S.expanded=S.expanded===el.dataset.c?null:el.dataset.c;render(true);}
  else if(a==='lim'){
    const key=el.dataset.s?el.dataset.c+'.'+el.dataset.s:el.dataset.c,M=M_(S.month),cur=M.lim[key]||0;
    M.lim[key]=Math.max(0,cur+ +el.dataset.d);render(true);saveLimit(M,key);
  }
  else if(a==='grp'){S.grp=el.dataset.g;S.expanded=null;render(true);}
  else if(a==='trend'){S.trend=el.dataset.v;render(true);}
  else if(a==='anatab'){S.anaTab=el.dataset.v;render();}
  else if(a==='goLast'){S.month=+el.dataset.m;render();}
  else if(a==='rep'){S.rep[el.dataset.w]=!S.rep[el.dataset.w];render(true);}
  else if(a==='upAll'){S.upAll=!S.upAll;render(true);}
  else if(a==='doneAll'){S.doneAll=!S.doneAll;render(true);}
  else if(a==='incAll'){S.incAll=!S.incAll;render(true);}
  else if(a==='repAll'){S.repAll=!S.repAll;render(true);}
  else if(a==='add'){openSheet('exp');}
  else if(a==='addinc'){openSheet('inc');}
  else if(a==='mode'){S.mode=el.dataset.v;renderSheet();}
  else if(a==='preset'){$('note').value=el.dataset.n;}
  else if(a==='close'){closeSheet();}
  else if(a==='cat'){const c=CAT[el.dataset.c];S.draft.cat=c.id;S.draft.sub=(c.kind==='weeks'||!c.subs.length)?'':c.subs[0].id;renderSheet();}
  else if(a==='sub'){S.draft.sub=el.dataset.s;renderSheet();}
  else if(a==='who'){S.draft.who=el.dataset.w;renderSheet();}
  else if(a==='newM'){openEditor('new');}
  else if(a==='editM'){openEditor('edit',+el.dataset.m);}
  else if(a==='viewM'){S.month=+el.dataset.m;S.tab='home';render();}
  else if(a==='askSwitch'){S.confirm=true;render(true);}
  else if(a==='cancelSwitch'){S.confirm=false;render(true);}
  else if(a==='doSwitch'){doSwitch();}
  else if(a==='logout'){sb.auth.signOut();}
  else if(a==='edClose'){E=null;$('editor').hidden=true;}
  else if(a==='edSave'){saveEditor();}
  else if(a==='plAdd'){E.draft.plan.push({d:1,name:'',key:'byv.najom',amt:0});renderEditor(true);const b=$('editor').querySelector('.ed-body');b.scrollTop=b.scrollHeight;}
  else if(a==='plDel'){E.draft.plan.splice(+el.dataset.i,1);renderEditor(true);}
});
$('sheet').addEventListener('click',e=>{if(e.target===$('sheet'))closeSheet();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('sheet').hidden)closeSheet();else if(E){E=null;$('editor').hidden=true;}}});
$('amt').addEventListener('input',()=>{$('save').disabled=!parseAmt();});
$('date').addEventListener('change',renderSheet);
$('editor').addEventListener('input',edInput);
$('editor').addEventListener('change',edInput);
$('form').addEventListener('submit',async e=>{
  e.preventDefault();
  const amt=parseAmt();if(!amt)return;
  const dt=sheetDate(),btn=$('save');btn.disabled=true;
  try{
    if(S.mode==='inc'){
      let m=calIdx(dt);if(m<0)m=S.month;
      const r=await db.from('incomes').insert({month_id:M_(m).id,dt:iso(dt),amount:round2(amt),who:S.draft.who,note:$('note').value.trim()||'Príjem'}).select().single();
      if(r.error)throw r.error;
      S.incTx.push({id:r.data.id,m,dt,who:r.data.who,amt:+r.data.amount,note:r.data.note});
      S.month=M_(m).status==='planned'?S.month:m;S.tab='bud';S.grp='all';closeSheet();render();
      toast('Príjem '+eur2(amt)+' pridaný');return;
    }
    const c=CAT[S.draft.cat];let m,sub='';
    if(c.kind==='weeks'){const fa=foodAssign(dt);m=fa.m;sub='w'+fa.w;}
    else{m=calIdx(dt);if(m<0)m=S.month;sub=c.subs.length?(S.draft.sub||c.subs[0].id):'';}
    const r=await db.from('transactions').insert({month_id:M_(m).id,dt:iso(dt),cat:c.id,sub,amount:round2(amt),who:S.draft.who,note:$('note').value.trim()||c.name}).select().single();
    if(r.error)throw r.error;
    S.tx.push({id:r.data.id,m,dt,cat:c.id,sub,amt:+r.data.amount,who:r.data.who,note:r.data.note});
    S.month=M_(m).status==='planned'?S.month:m;S.tab='home';closeSheet();render();
    toast('Výdavok '+eur2(amt)+' pridaný');
  }catch(err){
    console.error(err);toast('Zápis sa nepodarilo uložiť. Skúste to znova.',true);btn.disabled=false;
  }
});
$('sheet').querySelector('.x').innerHTML=ic('x',18);

const tip=$('tip');
function hideTip(){tip.hidden=true;}
document.addEventListener('pointermove',e=>{
  const el=e.target.closest&&e.target.closest('[data-tip]');
  if(!el){hideTip();return;}
  tip.textContent=el.getAttribute('data-tip');tip.hidden=false;
  const w=tip.offsetWidth,x=Math.min(window.innerWidth-w-8,Math.max(8,e.clientX-w/2));
  tip.style.left=x+'px';tip.style.top=Math.max(8,e.clientY-tip.offsetHeight-14)+'px';
});
document.addEventListener('pointerleave',hideTip);
$('screen').addEventListener('scroll',hideTip);

/* ---------- prihlásenie a spustenie ---------- */
const gate=$('gate');
function showGate(html){gate.innerHTML=html;gate.hidden=false;}
function hideGate(){gate.hidden=true;gate.innerHTML='';}
const AUTH_ERR={'Invalid login credentials':'Nesprávny e-mail alebo heslo.','Email not confirmed':'E-mail ešte nie je potvrdený. Otvorte potvrdzovací e-mail a skúste to znova.','User already registered':'Tento e-mail už má účet. Prihláste sa.'};
function authView(signup,msg,cls){
  showGate('<div><h1>Rodinný rozpočet</h1><p class="small" style="margin:8px 0 0">'+(signup?'Vytvorte si účet.':'Prihláste sa.')+'</p></div>'+
   '<form id="auth-form" novalidate style="display:flex;flex-direction:column;gap:14px"><label class="fld" for="a-email">E-mail<input id="a-email" type="email" autocomplete="email" inputmode="email"></label>'+
   '<label class="fld" for="a-pass">Heslo (aspoň 6 znakov)<input id="a-pass" type="password" autocomplete="'+(signup?'new-password':'current-password')+'"></label>'+
   '<div id="a-msg" class="msg'+(cls?' '+cls:'')+'" role="status">'+esc(msg||'')+'</div><button class="btn" id="a-go" type="submit">'+(signup?'Vytvoriť účet':'Prihlásiť')+'</button></form>'+
   '<button class="link" id="a-toggle" type="button">'+(signup?'Už mám účet, prihlásiť sa':'Nemám účet, vytvoriť')+'</button>');
  $('a-toggle').onclick=()=>authView(!signup);
  $('auth-form').onsubmit=async ev=>{
    ev.preventDefault();
    const email=$('a-email').value.trim(),password=$('a-pass').value;
    if(!email||password.length<6){authView(signup,'Zadajte e-mail a heslo s aspoň 6 znakmi.','bad');$('a-email').value=email;return;}
    $('a-go').disabled=true;
    const r=signup?await db.auth.signUp({email,password}):await db.auth.signInWithPassword({email,password});
    if(r.error){authView(signup,AUTH_ERR[r.error.message]||r.error.message,'bad');$('a-email').value=email;return;}
    if(signup&&!r.data.session){authView(false,'Poslali sme potvrdzovací e-mail. Po potvrdení sa prihláste.','ok');$('a-email').value=email;return;}
    boot();
  };
}
function onboardView(msg){
  let who='J';
  showGate('<div><h1>Vitajte</h1><p class="small" style="margin:8px 0 0">Prihlásený: '+esc(S.email||'')+'</p></div>'+
   '<section class="card"><h3 style="margin:0 0 10px;font-size:16px">Vytvoriť domácnosť</h3><div class="sec-t" style="margin-bottom:8px">Ste</div><div class="whoseg" id="ob-who"></div><button class="btn" id="ob-create" style="width:100%;margin-top:14px">Vytvoriť</button></section>'+
   '<section class="card"><h3 style="margin:0 0 10px;font-size:16px">Pridať sa k domácnosti</h3><label class="fld" for="ob-code">Pozývací kód<input id="ob-code" type="text" autocomplete="off" autocapitalize="off"></label><button class="btn ghost" id="ob-join" style="width:100%;margin-top:14px">Pridať sa</button></section>'+
   '<div id="ob-msg" class="msg bad" role="status">'+esc(msg||'')+'</div><button class="link" id="ob-out" type="button">Odhlásiť</button>');
  const drawWho=()=>{$('ob-who').innerHTML=['J','I'].map(w=>'<button type="button" data-w="'+w+'" aria-pressed="'+(who===w)+'">'+dot(w,true)+PEOPLE[w]+'</button>').join('');$('ob-who').querySelectorAll('button').forEach(b=>b.onclick=()=>{who=b.dataset.w;drawWho();});};
  drawWho();
  $('ob-out').onclick=()=>db.auth.signOut();
  $('ob-create').onclick=async()=>{const r=await db.rpc('bootstrap_household',{p_initial:who});if(r.error){onboardView('Domácnosť sa nepodarilo vytvoriť.');return;}boot();};
  $('ob-join').onclick=async()=>{const code=$('ob-code').value;const r=await db.rpc('join_household',{p_code:code});if(r.error){onboardView(/full/.test(r.error.message)?'Domácnosť už má dvoch členov.':'Kód nepoznáme. Skontrolujte ho.');return;}boot();};
}
let relT;
function subscribe(){
  if(S.ch)return;
  S.ch=db.channel('hh-sync').on('postgres_changes',{event:'*',schema:'public'},()=>{clearTimeout(relT);relT=setTimeout(reload,600);}).subscribe();
}
async function reload(){try{const r=await loadAll();if(r==='ok'&&$('editor').hidden)render(true);}catch(e){console.error(e);}}
function resetState(){
  if(S.ch){db.removeChannel(S.ch);S.ch=null;}
  S.months=[];S.tx=[];S.incTx=[];S.debts=[];S.members=[];S.hh=null;S.loaded=false;S.month=0;S.tab='home';
  $('sheet').hidden=true;$('editor').hidden=true;
}
async function boot(){
  showGate('<div class="loading">Načítavam…</div>');
  try{
    const r=await loadAll();
    if(r==='auth')return authView(false);
    if(r==='onboard')return onboardView();
    hideGate();subscribe();S.tab='home';render();
  }catch(e){
    console.error(e);
    showGate('<div><h1>Nepodarilo sa načítať</h1><p class="small">Skontrolujte pripojenie a skúste to znova.</p></div><button class="btn" id="retry">Skúsiť znova</button>');
    $('retry').onclick=boot;
  }
}
db.auth.onAuthStateChange(ev=>{if(ev==='SIGNED_OUT'){resetState();authView(false);}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S.loaded)reload();});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
boot();
})();

/* Knihy Biblie: poradie (66), názvy, skratky, počty kapitol, parsovanie odkazov */
(function(){
'use strict';
// [osis, názov, počet kapitol, aliasy (bez diakritiky, malé písmená, bez medzier a bodiek)]
const L=[
['Gen','Genesis',50,'gn gen genezis 1mojzisova 1moj'],
['Exod','Exodus',40,'ex exo 2mojzisova 2moj'],
['Lev','Leviticus',27,'lv lev levitikus 3mojzisova 3moj'],
['Num','Numeri',36,'nu num numeri 4mojzisova 4moj'],
['Deut','Deuteronomium',34,'dt deut 5mojzisova 5moj'],
['Josh','Jozue',24,'joz jos'],
['Judg','Soudců',21,'sd soudcu soudci sudcovia sud'],
['Ruth','Rút',4,'rt rut'],
['1Sam','1. Samuelova',31,'1sa 1sam 1s 1samuelova'],
['2Sam','2. Samuelova',24,'2sa 2sam 2s 2samuelova'],
['1Kgs','1. Královská',22,'1kr 1kral 1krl 1kralovska 1kralov'],
['2Kgs','2. Královská',25,'2kr 2kral 2krl 2kralovska 2kralov'],
['1Chr','1. Paralipomenon',29,'1pa 1par 1paralipomenon 1kron 1kronicka'],
['2Chr','2. Paralipomenon',36,'2pa 2par 2paralipomenon 2kron 2kronicka'],
['Ezra','Ezdráš',10,'ezd ezr ezdras'],
['Neh','Nehemjáš',13,'neh nehemias nehemjas'],
['Esth','Ester',10,'est ester'],
['Job','Jób',42,'job jb'],
['Ps','Žalmy',150,'z zal zalm zalmy ps zaltar'],
['Prov','Přísloví',31,'pr prisl prislovi prov'],
['Eccl','Kazatel',12,'kaz kazatel'],
['Song','Píseň písní',8,'pis pisen pisenpisni piesen piesenpiesni'],
['Isa','Izajáš',66,'iz iza izaias izajas'],
['Jer','Jeremjáš',52,'jr jer jeremias jeremjas'],
['Lam','Pláč',5,'pl plac placjeremiasuv'],
['Ezek','Ezechiel',48,'ez ezech ezechiel'],
['Dan','Daniel',12,'dan da daniel'],
['Hos','Ozeáš',14,'oz hos ozeas'],
['Joel','Jóel',3,'jl joel'],
['Amos','Amos',9,'am amos'],
['Obad','Abdijáš',1,'abd ab abdias abdijas'],
['Jonah','Jonáš',4,'jon jonas'],
['Mic','Micheáš',7,'mich mi micheas'],
['Nah','Nahum',3,'nah na nahum'],
['Hab','Abakuk',3,'abk hab abakuk'],
['Zeph','Sofonjáš',3,'sof zef sofonias sofonjas'],
['Hag','Ageus',2,'ag agg ageus'],
['Zech','Zacharjáš',14,'za zach zech zacharias zacharjas'],
['Mal','Malachiáš',4,'mal malachias'],
['Matt','Matouš',28,'mt mat matous matus'],
['Mark','Marek',16,'mk mar marek'],
['Luke','Lukáš',24,'lk luk lukas'],
['John','Jan',21,'j jn jan joh'],
['Acts','Skutky',28,'sk skut skutky'],
['Rom','Římanům',16,'r rm rim rimanum rimanom'],
['1Cor','1. Korintským',16,'1k 1ko 1kor 1korintskym'],
['2Cor','2. Korintským',13,'2k 2ko 2kor 2korintskym'],
['Gal','Galatským',6,'ga gal galatskym'],
['Eph','Efezským',6,'ef efezskym'],
['Phil','Filipským',4,'fp fil flp filipskym'],
['Col','Koloským',4,'ko kol koloskym'],
['1Thess','1. Tesalonickým',5,'1te 1tes 1tez 1tesalonickym 1tesalonicanum'],
['2Thess','2. Tesalonickým',3,'2te 2tes 2tez 2tesalonickym 2tesalonicanum'],
['1Tim','1. Timoteovi',6,'1tm 1tim 1timoteovi'],
['2Tim','2. Timoteovi',4,'2tm 2tim 2timoteovi'],
['Titus','Titovi',3,'tt tit titovi'],
['Phlm','Filemonovi',1,'flm filem filemonovi'],
['Heb','Židům',13,'zid zidum zd hebr hebrejom'],
['Jas','Jakubův',5,'jk jak jakub jakubuv'],
['1Pet','1. Petrův',5,'1pt 1pet 1petruv'],
['2Pet','2. Petrův',3,'2pt 2pet 2petruv'],
['1John','1. Janův',5,'1j 1jan 1januv'],
['2John','2. Janův',1,'2j 2jan 2januv'],
['3John','3. Janův',1,'3j 3jan 3januv'],
['Jude','Juda',1,'jud juda judova'],
['Rev','Zjevení',22,'zj zjav zjeveni zjavenie apokalypsa']
];
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[\s.]+/g,'');
const BOOKS=L.map((x,i)=>({i,osis:x[0],name:x[1],ch:x[2],al:(norm(x[1])+' '+x[3]).split(' ')}));
const MAP={};
BOOKS.forEach(b=>b.al.forEach(a=>{if(!(a in MAP))MAP[a]=b.i;}));

function findBook(s){
  const n=norm(s);if(!n)return -1;
  if(n in MAP)return MAP[n];
  if(n.length>=3){const c=BOOKS.find(b=>b.al.some(a=>a.startsWith(n)));if(c)return c.i;}
  return -1;
}
// "Ján 3:16", "J 3,16-18", "1 Kor 13:4" -> {b,c,v1,v2} alebo null
function parseRef(str){
  const m=String(str||'').trim().match(/^(\d?\s*\.?\s*[^\d\s:,.\-–][^\d:,]*?)\s*(\d{1,3})\s*[:,.]\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?\s*$/);
  if(!m)return null;
  const b=findBook(m[1]);if(b<0)return null;
  const c=+m[2],v1=+m[3],v2=m[4]?+m[4]:v1;
  if(c<1||c>BOOKS[b].ch||v2<v1)return null;
  return {b,c,v1,v2};
}
const fmtRef=r=>BOOKS[r.b].name+' '+r.c+':'+r.v1+(r.v2>r.v1?'-'+r.v2:'');
window.BK={BOOKS,parseRef,fmtRef,findBook,norm};
})();

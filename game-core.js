(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.VillsporCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TYPES={ILD:{strong:'VEKST',weak:'VANN',color:'#f06a45',icon:'🔥'},VEKST:{strong:'VANN',weak:'ILD',color:'#70b85f',icon:'🌿'},VANN:{strong:'ILD',weak:'VEKST',color:'#4bb8d3',icon:'💧'}};
const MOVES={
  glosprang:{name:'Glødesprang',type:'ILD',power:14},askesnurr:{name:'Askespinn',type:'ILD',power:10,effect:'weaken'},
  rotgrep:{name:'Rotgrep',type:'VEKST',power:13},sporevind:{name:'Sporevind',type:'VEKST',power:9,effect:'heal'},
  skumsprut:{name:'Skumsprut',type:'VANN',power:14},duggslor:{name:'Duggslør',type:'VANN',power:8,effect:'guard'},
  konglekast:{name:'Konglekast',type:'VEKST',power:15},barkbrak:{name:'Barkbrak',type:'VEKST',power:11},
  bobleblink:{name:'Bobleblink',type:'VANN',power:12},fossedunk:{name:'Fossedunk',type:'VANN',power:16},
  kullnebb:{name:'Kullnebb',type:'ILD',power:13},vingegnist:{name:'Vingegnist',type:'ILD',power:15},
  flammesverd:{name:'Flammesverd',type:'ILD',power:18},lavastorm:{name:'Lavastorm',type:'ILD',power:21},
  ildspor:{name:'Ildspor',type:'ILD',power:12},mosevern:{name:'Mosevern',type:'VEKST',power:7,effect:'guard'},
  kildepust:{name:'Kildepust',type:'VANN',power:7,effect:'heal'},harpikssnor:{name:'Harpikssnor',type:'VEKST',power:8,effect:'weaken'},
  taakeskjold:{name:'Tåkeskjold',type:'VANN',power:7,effect:'guard'},sotdis:{name:'Sotdis',type:'ILD',power:8,effect:'weaken'},
  glodhjerte:{name:'Glødhjerte',type:'ILD',power:9,effect:'heal'}
};
const CREATURES={
  gnistrev:{id:'gnistrev',name:'Gnistrev',type:'ILD',role:'Rask sporjeger',bio:'En sky revegnist som lager små bål når den nyser.',base:{hp:42,attack:14,defense:9,speed:14},moves:['glosprang','askesnurr','ildspor'],colors:['#f27b45','#ffd568','#6b3430'],shape:'fox'},
  mosemurr:{id:'mosemurr',name:'Mosemurr',type:'VEKST',role:'Seig beskytter',bio:'En lun skogsånd som sover under mosekledde steiner.',base:{hp:48,attack:11,defense:14,speed:8},moves:['rotgrep','sporevind','mosevern'],colors:['#6da85c','#b7d875','#355e45'],shape:'moss'},
  bekkskvett:{id:'bekkskvett',name:'Bekkskvett',type:'VANN',role:'Stødig helbreder',bio:'En rastløs bekkunge som alltid svømmer motstrøms.',base:{hp:44,attack:13,defense:10,speed:13},moves:['skumsprut','duggslor','kildepust'],colors:['#55bdd3','#d7f4e9','#28617d'],shape:'otter'},
  kongleklo:{id:'kongleklo',name:'Kongleklo',type:'VEKST',role:'Herdet taktiker',bio:'Samler blanke ting i kongleskallet sitt.',base:{hp:50,attack:14,defense:13,speed:7},moves:['konglekast','barkbrak','harpikssnor'],colors:['#8c6741','#79ad52','#403b2d'],shape:'crab'},
  fjordfnugg:{id:'fjordfnugg',name:'Fjordfnugg',type:'VANN',role:'Rask tåkevokter',bio:'Et fjærlett fjordvesen som varsler regn.',base:{hp:40,attack:12,defense:9,speed:17},moves:['bobleblink','fossedunk','taakeskjold'],colors:['#91dbe4','#f0fff3','#527c9c'],shape:'bird'},
  kullvinge:{id:'kullvinge',name:'Kullvinge',type:'ILD',role:'Snikende svekker',bio:'Trives i varme bergsprekker og tegner med sot.',base:{hp:43,attack:15,defense:8,speed:15},moves:['kullnebb','vingegnist','sotdis'],colors:['#332f3e','#f16a42','#ffc85a'],shape:'bat'},
  flammefyrsten:{id:'flammefyrsten',name:'Flammefyrsten',type:'ILD',role:'Kraftig fjellvokter',bio:'Fjellets stolte, eldgamle vokter. Et vennskap som må fortjenes.',base:{hp:64,attack:16,defense:14,speed:11},moves:['flammesverd','lavastorm','glodhjerte'],colors:['#9d2e28','#ff6b32','#ffd45a'],shape:'dragon',boss:true,legendary:true}
};
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function statsFor(id,level=1){const c=CREATURES[id];if(!c)throw new Error('Ukjent vesen: '+id);return{maxHp:c.base.hp+(level-1)*6,attack:c.base.attack+(level-1)*2,defense:c.base.defense+(level-1)*2,speed:c.base.speed+(level-1)};}
function makeCreature(id,level=1){const s=statsFor(id,level);return{id,level,xp:0,hp:s.maxHp,maxHp:s.maxHp,status:{guard:0,weaken:0}};}
function typeMultiplier(moveType,targetType){if(TYPES[moveType].strong===targetType)return 1.5;if(TYPES[moveType].weak===targetType)return .67;return 1;}
function xpNeeded(level){return 24+level*16;}
function gainXp(unit,amount){const levels=[];unit.xp+=amount;while(unit.xp>=xpNeeded(unit.level)){unit.xp-=xpNeeded(unit.level);unit.level++;const s=statsFor(unit.id,unit.level);const gain=s.maxHp-unit.maxHp;unit.maxHp=s.maxHp;unit.hp=Math.min(unit.maxHp,unit.hp+gain+6);levels.push(unit.level);}return levels;}
function calcDamage(attacker,defender,moveId,roll=.85){const move=MOVES[moveId];const a=statsFor(attacker.id,attacker.level);const d=statsFor(defender.id,defender.level);const weaken=attacker.status?.weaken?0.78:1;const guard=defender.status?.guard?0.72:1;const mult=typeMultiplier(move.type,CREATURES[defender.id].type);const raw=(move.power+a.attack*.72-d.defense*.36)*clamp(roll,.75,1)*mult*weaken*guard;return{damage:Math.max(2,Math.round(raw)),mult,move};}
function applyMove(attacker,defender,moveId,roll=.85){const result=calcDamage(attacker,defender,moveId,roll);defender.hp=clamp(defender.hp-result.damage,0,defender.maxHp);const effect=result.move.effect;if(effect==='heal')attacker.hp=clamp(attacker.hp+Math.round(attacker.maxHp*.14),0,attacker.maxHp);if(effect==='guard')attacker.status.guard=2;if(effect==='weaken')defender.status.weaken=2;return result;}
function tickStatus(unit){for(const k of ['guard','weaken'])if(unit.status?.[k]>0)unit.status[k]--;}
function unlockedMoveIds(unit){const moves=CREATURES[unit.id].moves;return moves.slice(0,unit.level>=3?3:2);}
function chooseEnemyMove(attacker,defender,roll=.5){const options=unlockedMoveIds(attacker).map(id=>{const move=MOVES[id],result=calcDamage(attacker,defender,id,.9);let score=result.damage+(result.mult>1?10:result.mult<1?-5:0);if(move.effect==='heal')score+=attacker.hp/attacker.maxHp<.45?22:-12;if(move.effect==='guard')score+=attacker.status?.guard?-9:7;if(move.effect==='weaken')score+=defender.status?.weaken?-8:9;return{id,score};}).sort((a,b)=>b.score-a.score);if(options.length>1&&roll>.82)return options[1].id;return options[0].id;}
function captureChance(unit){if(CREATURES[unit.id].boss)return 0;return clamp(.22+(1-unit.hp/unit.maxHp)*.68,0.22,.9);}
function canCapture(unit,roll){return roll<captureChance(unit);}
function bossFriendshipState(unit,relicCount=0,alreadyCaught=false){if(!unit||unit.id!=='flammefyrsten')return'not-boss';if(alreadyCaught)return'already';if(relicCount<3)return'missing-relics';if(unit.hp/unit.maxHp>.25)return'weaken';return'ready';}
function validateData(){const errors=[];const ids=Object.keys(CREATURES);if(ids.filter(id=>!CREATURES[id].boss).length!==6)errors.push('Må ha seks fangbare vesener');for(const [id,c] of Object.entries(CREATURES)){if(!TYPES[c.type])errors.push(id+' har ugyldig type');if(c.moves.length<2)errors.push(id+' mangler angrep');for(const m of c.moves)if(!MOVES[m])errors.push(id+' viser til ukjent angrep '+m);}return errors;}
return{TYPES,MOVES,CREATURES,clamp,statsFor,makeCreature,typeMultiplier,xpNeeded,gainXp,calcDamage,applyMove,tickStatus,unlockedMoveIds,chooseEnemyMove,captureChance,canCapture,bossFriendshipState,validateData};
});

(function(){
'use strict';
const params=new URLSearchParams(location.search);
if(params.get('debug')!=='1')return;
const D=window.VillsporDebug,C=D?.core;
if(!D||!C)return;
document.body.dataset.debugTools='active';
D.runtimeConfig.debugActive=true;
const originalPowers=Object.fromEntries(Object.entries(C.MOVES).map(([id,m])=>[id,m.power]));
const panel=document.createElement('aside');
panel.id='debugTools';panel.className='debug-tools';panel.setAttribute('aria-label','Villspor utviklerverktøy');
panel.innerHTML=`<div class="debug-head"><h2>Villspor · utviklerverktøy</h2><button id="debugCollapse" aria-label="Skjul utviklerverktøy">−</button></div><p>Kun aktivt med <code>?debug=1</code>. Endringer varer til siden lastes på nytt.</p>
<label>Spillerfart <span><input id="debugSpeed" type="range" min="80" max="260" step="2"><output id="debugSpeedOut"></output></span></label>
<label>Møtesjanse <span><input id="debugEncounter" type="range" min="0" max="1" step="0.01"><output id="debugEncounterOut"></output></span></label>
<label>Synlige vesener <input id="debugRoamers" type="checkbox" checked></label>
<label>Lydnivå <span><input id="debugVolume" type="range" min="0" max="1" step="0.05"><output id="debugVolumeOut"></output></span></label>
<label>Angrep <select id="debugMove"></select></label>
<label>Angrepsstyrke <span><input id="debugPower" type="range" min="2" max="30" step="1"><output id="debugPowerOut"></output></span></label>
<div class="debug-actions"><button id="debugSound">Test lyder</button><button id="debugRoamer">Plasser vesen</button><button id="debugScent">Aktiver sporsans</button><button id="debugHeal">Helbred flokken</button><button id="debugBerry">+1 villbær</button><button id="debugMaterials">+9 materialer</button><button id="debugBase">Åpne Fjordbygda</button><button id="debugForm">Klar naturform</button><button id="debugReset">Nullstill tuning</button></div>
<div id="debugState" class="debug-state" aria-live="polite"></div>`;
document.body.append(panel);
const $=id=>document.getElementById(id),speed=$('debugSpeed'),encounter=$('debugEncounter'),roamers=$('debugRoamers'),volume=$('debugVolume'),move=$('debugMove'),power=$('debugPower');
for(const [id,m] of Object.entries(C.MOVES)){const option=document.createElement('option');option.value=id;option.textContent=m.name;move.append(option);}
function setOut(id,value){$(id).textContent=value;}
function sync(){speed.value=D.runtimeConfig.playerSpeed;encounter.value=D.runtimeConfig.encounterChance;roamers.checked=D.runtimeConfig.roamerEnabled;volume.value=typeof zzfxV==='number'?zzfxV:.3;power.value=C.MOVES[move.value].power;setOut('debugSpeedOut',speed.value);setOut('debugEncounterOut',`${Math.round(encounter.value*100)} %`);setOut('debugVolumeOut',`${Math.round(volume.value*100)} %`);setOut('debugPowerOut',power.value);}
speed.oninput=()=>{D.runtimeConfig.playerSpeed=Number(speed.value);setOut('debugSpeedOut',speed.value);};
encounter.oninput=()=>{D.runtimeConfig.encounterChance=Number(encounter.value);setOut('debugEncounterOut',`${Math.round(encounter.value*100)} %`);};
roamers.onchange=()=>{D.runtimeConfig.roamerEnabled=roamers.checked;if(!roamers.checked)D.game.roamers=[];else D.spawnRoamers();};
volume.oninput=()=>{if(typeof zzfxV==='number')zzfxV=Number(volume.value);setOut('debugVolumeOut',`${Math.round(volume.value*100)} %`);};
move.onchange=sync;
power.oninput=()=>{C.MOVES[move.value].power=Number(power.value);setOut('debugPowerOut',power.value);};
let soundIndex=0;const sounds=['dialog','menu','trail','hit','critical','enemy','heal','capture','lose','chime'];
$('debugSound').onclick=()=>D.playSound(sounds[soundIndex++%sounds.length]);
$('debugRoamer').onclick=()=>{D.forceRoamer('gnistrev',D.game.player.x/32+1.4,D.game.player.y/32);};
$('debugScent').onclick=()=>{D.game.scent.cooldownUntil=0;D.activateScent();};
$('debugHeal').onclick=()=>{for(const u of D.game.team)u.hp=u.maxHp;D.refreshBattle();};
$('debugBerry').onclick=()=>{D.game.inventory.berries++;D.refreshBattle();};
$('debugMaterials').onclick=()=>{for(const k of ['wood','crystal','herb'])D.game.inventory[k]+=9;D.refreshPanels();};
$('debugBase').onclick=()=>{D.game.bossDefeated=true;Object.assign(D.game.base.buildings,{workshop:2,training:1,garden:1});D.refreshPanels();};
$('debugForm').onclick=()=>{const u=D.game.team[0];if(!u)return;u.level=5;u.bond=3;u.xp=0;const s=C.statsFor(u.id,u.level,u.form);u.maxHp=s.maxHp;u.hp=s.maxHp;D.refreshPanels();};
$('debugReset').onclick=()=>{D.runtimeConfig.playerSpeed=142;D.runtimeConfig.encounterChance=.1;D.runtimeConfig.roamerEnabled=true;if(typeof zzfxV==='number')zzfxV=.3;for(const [id,n] of Object.entries(originalPowers))C.MOVES[id].power=n;D.spawnRoamers();sync();};
let hidden=false;const toggle=document.createElement('button');toggle.className='debug-tools-toggle hidden';toggle.textContent='🛠 Tuning';toggle.setAttribute('aria-label','Vis utviklerverktøy');document.body.append(toggle);
panel.ondblclick=e=>{if(e.target.closest('input,select,button'))return;hidden=true;panel.classList.add('hidden');toggle.classList.remove('hidden');};
toggle.onclick=()=>{hidden=false;panel.classList.remove('hidden');toggle.classList.add('hidden');};
$('debugCollapse').onclick=()=>{hidden=true;panel.classList.add('hidden');toggle.classList.remove('hidden');};
function monitor(){if(!hidden){const s=D.getSnapshot();$('debugState').textContent=`Modus: ${s.mode} · Område: ${s.area} · Roamers: ${s.roamers.length} · Fallback: ${D.runtimeConfig.fallbackEncounters} · Partikler: ${s.particles}`;}setTimeout(monitor,400);}
sync();monitor();
})();
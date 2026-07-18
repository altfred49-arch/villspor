(function(){
'use strict';
const params=new URLSearchParams(location.search);
if(params.get('debug')!=='1')return;
const D=window.VillsporDebug,C=D?.core;
if(!D||!C)return;
document.body.dataset.debugTools='active';
const originalPowers=Object.fromEntries(Object.entries(C.MOVES).map(([id,m])=>[id,m.power]));
const panel=document.createElement('aside');
panel.id='debugTools';panel.className='debug-tools';panel.setAttribute('aria-label','Villspor utviklerverktøy');
panel.innerHTML=`<div class="debug-head"><h2>Villspor · utviklerverktøy</h2><button id="debugCollapse" aria-label="Skjul utviklerverktøy">−</button></div><p>Kun aktivt med <code>?debug=1</code>. Endringer varer til siden lastes på nytt.</p>
<label>Spillerfart <span><input id="debugSpeed" type="range" min="80" max="260" step="2"><output id="debugSpeedOut"></output></span></label>
<label>Møtesjanse <span><input id="debugEncounter" type="range" min="0" max="1" step="0.01"><output id="debugEncounterOut"></output></span></label>
<label>Lydnivå <span><input id="debugVolume" type="range" min="0" max="1" step="0.05"><output id="debugVolumeOut"></output></span></label>
<label>Angrep <select id="debugMove"></select></label>
<label>Angrepsstyrke <span><input id="debugPower" type="range" min="2" max="30" step="1"><output id="debugPowerOut"></output></span></label>
<div class="debug-actions"><button id="debugSound">Test lyder</button><button id="debugHeal">Helbred flokken</button><button id="debugBerry">+1 villbær</button><button id="debugReset">Nullstill tuning</button></div>
<div id="debugState" class="debug-state" aria-live="polite"></div>`;
document.body.append(panel);
const $=id=>document.getElementById(id),speed=$('debugSpeed'),encounter=$('debugEncounter'),volume=$('debugVolume'),move=$('debugMove'),power=$('debugPower');
for(const [id,m] of Object.entries(C.MOVES)){const option=document.createElement('option');option.value=id;option.textContent=m.name;move.append(option);}
function setOut(id,value){$(id).textContent=value;}
function sync(){speed.value=D.game.player.speed;encounter.value=D.runtimeConfig.encounterChance;volume.value=typeof zzfxV==='number'?zzfxV:.3;power.value=C.MOVES[move.value].power;setOut('debugSpeedOut',speed.value);setOut('debugEncounterOut',`${Math.round(encounter.value*100)} %`);setOut('debugVolumeOut',`${Math.round(volume.value*100)} %`);setOut('debugPowerOut',power.value);}
speed.oninput=()=>{D.game.player.speed=Number(speed.value);setOut('debugSpeedOut',speed.value);};
encounter.oninput=()=>{D.runtimeConfig.encounterChance=Number(encounter.value);setOut('debugEncounterOut',`${Math.round(encounter.value*100)} %`);};
volume.oninput=()=>{if(typeof zzfxV==='number')zzfxV=Number(volume.value);setOut('debugVolumeOut',`${Math.round(volume.value*100)} %`);};
move.onchange=sync;
power.oninput=()=>{C.MOVES[move.value].power=Number(power.value);setOut('debugPowerOut',power.value);};
let soundIndex=0;const sounds=['dialog','menu','trail','hit','critical','enemy','heal','capture','lose','chime'];
$('debugSound').onclick=()=>D.playSound(sounds[soundIndex++%sounds.length]);
$('debugHeal').onclick=()=>{for(const u of D.game.team)u.hp=u.maxHp;D.refreshBattle();};
$('debugBerry').onclick=()=>{D.game.inventory.berries++;D.refreshBattle();};
$('debugReset').onclick=()=>{D.game.player.speed=142;D.runtimeConfig.encounterChance=.28;if(typeof zzfxV==='number')zzfxV=.3;for(const [id,n] of Object.entries(originalPowers))C.MOVES[id].power=n;sync();};
let hidden=false;const toggle=document.createElement('button');toggle.className='debug-tools-toggle hidden';toggle.textContent='🛠 Tuning';toggle.setAttribute('aria-label','Vis utviklerverktøy');document.body.append(toggle);
panel.ondblclick=e=>{if(e.target.closest('input,select,button'))return;hidden=true;panel.classList.add('hidden');toggle.classList.remove('hidden');};
toggle.onclick=()=>{hidden=false;panel.classList.remove('hidden');toggle.classList.add('hidden');};
$('debugCollapse').onclick=()=>{hidden=true;panel.classList.add('hidden');toggle.classList.remove('hidden');};
function monitor(){if(!hidden){const s=D.getSnapshot();$('debugState').textContent=`Modus: ${s.mode} · Område: ${s.area} · Flokk: ${s.team.length} · Bær: ${s.inventory.berries}`;}setTimeout(monitor,400);}
sync();monitor();
})();
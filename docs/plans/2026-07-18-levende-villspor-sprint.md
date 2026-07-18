# Levende Villspor Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Gjøre utforskningen merkbart mer levende og mindre tilfeldig ved å vise naturvesener i verden, gi Ninni en aktiv sporsans og la vennene bo synlig ved campingplassen.

**Architecture:** Behold vanilla Canvas, eksisterende verden, alle sju vesener og lagringsformat `villspor-save-v1`. Legg transient utforskningsstate i `game.roamers` og runtime-konfigurasjon, mens bare nødvendige spillerpreferanser beholdes i dagens save. Bruk eksisterende SVG-er til oververden, kamp og campingplass; ingen ny motor, karteditor eller runtime-avhengighet.

**Tech Stack:** HTML5 Canvas, vanilla JavaScript, eksisterende `game-core.js`, ZzFX, Playwright Chromium/WebKit og axe-core.

---

## Sprintmål

1. Synlige naturvesener vandrer i riktige biomer og kan møtes gjennom faktisk kontakt/samhandling.
2. Ninnis sporsans peker mot nærmeste relevante spor uten å avsløre alt.
3. Tilfeldige møter reduseres og fungerer bare som fallback, slik at spilleren får mer kontroll.
4. Fangede vesener og leirreserve er synlige og interaktive ved campingplassen.
5. Verden får lette, ressursvennlige miljøeffekter som skiller camp, skog og hule.
6. Gamle lagringer, begge avslutninger, Flammefyrsten, nattsporet og Sporprøven forblir urørt.

## Utenfor sprinten

- Ingen nye vesener, typer, områder eller hovedhistorie.
- Ingen Phaser-/Tiled-migrering.
- Ingen crafting, butikk, økonomi eller ny lagringsnøkkel.
- Ingen CI-workflow før GitHub-tokenet har `workflow`-scope.

## Akseptansekriterier

- Minst 3 samtidige roamers kan eksistere uten merkbar frame-drop.
- Camp viser opptil 4 venner fra reserve/fangst uten å blokkere stier eller NPC-er.
- Sporsans fungerer med tastatur og mobilens A-knapp.
- Samme roamer kan ikke utløse dobbel kamp.
- Roamers og miljøpartikler lagres ikke i `localStorage`.
- Standardseier og vennskapsavslutning består eksisterende E2E.
- 390×844 portrett og lavt WebKit-landskap har null clipping/overflow.
- Axe rapporterer 0 brudd i eksisterende fire tilstander.

---

### Task 1: Lås kontrakter med røde tester

**Objective:** Beskriv ny oppførsel før produksjonskode endres.

**Files:**
- Modify: `tests.mjs`
- Modify: `e2e.mjs`

**Steps:**
1. Legg til statiske tester for `ROAMER_ZONES`, `spawnRoamers`, `updateRoamers`, `activateScent` og `drawCampFriends`.
2. Legg til E2E-fixtur som tvinger én roamer til et traverserbart punkt og krever at normal interaksjon starter riktig kamp.
3. Seed en sentinel-save, bruk sporsans og roamer, kall `saveGame()`, og krev at transient state ikke finnes i serialisert save.
4. Kjør `npm test`; forvent FAIL på manglende funksjoner.
5. Commit: `test: define living-world contracts`.

### Task 2: Transient roamer-modell

**Objective:** Lag en liten, deterministisk modell for synlige møter uten save-migrasjon.

**Files:**
- Modify: `game.js` nær `encounters`, `fresh()` og world-update
- Test: `tests.mjs`

**Design:**
```js
const ROAMER_ZONES={
  forest:{ids:['gnistrev','mosemurr','bekkskvett','kongleklo','fjordfnugg'],max:3},
  cave:{ids:['kullvinge','gnistrev','bekkskvett'],max:2}
};
// {token,id,x,y,homeX,homeY,dir,cooldown,engaged:false}
```

**Steps:**
1. Legg `roamers:[]` til `fresh()` som transient state.
2. Implementer spawn kun på traverserbare tiles, utenfor port, NPC-er, relikvier og spilleren.
3. Bruk stabil token per spawn og `engaged`-lås før kampstart.
4. Respawn etter kamp/avstand, ikke på hver frame.
5. Hold `saveGame()` uendret slik at `roamers` aldri serialiseres.
6. Kjør `npm test`; forvent PASS.
7. Commit: `feat: add transient world roamers`.

### Task 3: Bevegelse, kontakt og møteintro

**Objective:** Gjør roamers lesbare og trygge å møte gjennom vanlig utforskning.

**Files:**
- Modify: `game.js` (`update`, `interact`, `startBattle`, world drawing)
- Modify: `styles.css`
- Test: `e2e.mjs`

**Steps:**
1. Gi roamers langsom vandring rundt hjemmepunktet; stopp ved blokkert tile.
2. La dem vende seg bort fra spilleren på kort avstand, men aldri løpe gjennom vegger.
3. Start kamp ved A/E innen 46 px eller kontrollert kontakt innen 24 px.
4. Vis kort HTML-basert møtebanner med navn/type før kamp, men ikke legg viktig informasjon kun i canvas.
5. Bruk eksisterende `startBattle(id, level, false)` og eksisterende lydwrapper.
6. E2E skal gå fysisk til roamer, starte kamp og bevise at bare én kamp opprettes.
7. Commit: `feat: connect visible roamers to battles`.

### Task 4: Ninnis aktive sporsans

**Objective:** Gi spilleren kontroll over jakten uten å lage et nytt kontrollsystem.

**Files:**
- Modify: `game.js`
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests.mjs`, `e2e.mjs`

**Design:**
- A/E uten nærliggende NPC/objekt aktiverer sporsans i 6 sekunder.
- En liten HTML-chip viser `Ninni finner et 🔥/🌿/💧-spor mot øst`.
- Canvas viser 3–5 glimt langs retningen, ikke en GPS-linje.
- Cooldown 8 sekunder for å unngå spam; ingen lagring.

**Steps:**
1. Prioriter vanlig NPC-/objektinteraksjon før sporsans.
2. Finn nærmeste ikke-engasjerte roamer i samme område.
3. Hvis ingen finnes: behold dagens «Ninni snuser etter spor …».
4. Speil type og grov retning i HTML for tilgjengelighet.
5. Test tastatur og mobil-A, cooldown, ingen mål og ny aktivering etter kamp.
6. Commit: `feat: add Ninni scent guidance`.

### Task 5: Synlige venner ved camp

**Objective:** La fangst og reserve få synlig emosjonell verdi uten nytt progresjonssystem.

**Files:**
- Modify: `game.js`
- Test: `e2e.mjs`

**Steps:**
1. Velg opptil fire unike fangede venner, prioritert fra reserve og deretter ikke-ledende teammedlemmer.
2. Plasser dem i faste, kollisjonssikre camp-slots rundt bålet.
3. Bruk eksisterende SVG/fallback-rendering i mindre størrelse.
4. A/E nær en venn viser én artsspesifikk kort replikk; ingen belønning og ingen save-endring.
5. Flammefyrsten får egen postgame-replikk og mindre visuell skala i camp.
6. Test full flokk, tom reserve, Flammefyrsten og gamle saves.
7. Commit: `feat: bring captured friends into camp`.

### Task 6: Ressurslette biomeeffekter

**Objective:** Skille områdene visuelt uten nye filer eller tung partikkelmotor.

**Files:**
- Modify: `game.js`
- Test: `e2e.mjs`

**Effects:**
- Camp: 8–12 ildfluer/gnister nær leirbålet.
- Skog: langsomme løv/mosestøv med lav alpha.
- Hule: små glødende støvkorn rundt krystaller.

**Steps:**
1. Lag ett fast gjenbrukt partikkelarray; ingen objektallokering per frame.
2. Begrens til maks 24 partikler og pause oppdatering utenfor world mode.
3. Respekter `prefers-reduced-motion`: statiske glimt, ingen drift.
4. Ta skjermbilder i alle tre biomer og kontroller lesbarhet mot HUD/minikart.
5. Commit: `feat: add lightweight biome ambience`.

### Task 7: Balansér møtetetthet

**Objective:** La synlige møter være hovedregelen uten å skape tomme områder.

**Files:**
- Modify: `game.js` (`runtimeConfig`, `maybeEncounter`)
- Modify: `debug-tools.js`
- Test: `tests.mjs`, `e2e.mjs`

**Steps:**
1. Reduser tilfeldig standard møtesjanse fra 28 % til 10 % som fallback.
2. Ikke tillat random encounter når en synlig roamer er nærmere enn 180 px.
3. Legg `Roamer-antall` og `Fallback-møter` til debugpanelet; lagring forblir deaktivert i debugmodus.
4. Test at tuning resetter ved reload og ikke påvirker sentinel-save.
5. Kjør ti deterministiske spawn-/encounter-scenarier i enhetstest.
6. Commit: `balance: make visible encounters primary`.

### Task 8: Full regresjon og offentlig release

**Objective:** Bevis at den levende verden ikke har ødelagt ferdig innhold.

**Files:**
- Modify: `README.md`
- Modify: `e2e.mjs`
- Update: `qa/*.png`

**Steps:**
1. Dokumenter sporsans, roamers og campvenner i README.
2. Kjør `node --check game.js && node --check debug-tools.js`.
3. Kjør `npm test`; forvent alle gamle tester + nye tester grønne.
4. Kjør Chromium og WebKit E2E; krev begge avslutninger, nattspor, Sporprøven, gamle saves og nye roamer/sporsans-scenarier.
5. Kjør axe i begge motorer; forvent 0 brudd.
6. Visuell QA: desktop camp/skog/hule, 390×844, lavt landskap og reduced-motion.
7. Review fokusert på save-nøkkel, transient state, dobbeltmøter, frame-allokering og mobil clipping.
8. Commit: `feat: make Villspor world feel alive`.
9. Push, vent på Pages-build for eksakt commit, kjør offentlig E2E i begge motorer.
10. Lag ny integritetstestet ZIP og rapporter commit, testtall, URL og SHA-256.

---

## Definition of Done

- [ ] Synlige roamers er hovedveien til vanlige møter.
- [ ] Sporsans fungerer på tastatur og mobil.
- [ ] Campvenner bruker fangst/reserve uten ny permanent progresjon.
- [ ] Miljøeffekter respekterer reduced motion og påvirker ikke UI.
- [ ] Ingen transient state finnes i `villspor-save-v1`.
- [ ] Gamle lagringer og begge avslutninger fungerer.
- [ ] Chromium, WebKit og axe er grønne lokalt og offentlig.
- [ ] Review er ferdig før release og ZIP.

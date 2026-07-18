# Villspor: Basecamp, Fjordbygda og Naturformer Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Bygg tre sammenhengende sprinter som gir Villspor en varig ekspedisjonsloop, en ny region med tre nye originalvesener og en valgbart utviklingssystem for flokken.

**Architecture:** Behold vanilla Canvas-motoren og eksisterende lagringsnøkkel. Utvid den eksplisitte `game`-staten med bakoverkompatible standardverdier for base, materialer, nye trenerresultater og enhetsfeltene `bond`, `form` og `selectedMoves`. Nye verdenskilder, byggverk, trenere og fjordregionen er dataorienterte konstanter; runtime-entiteter forblir transiente.

**Tech Stack:** HTML5 Canvas, vanilla JavaScript, lokal SVG, Playwright Chromium/WebKit, axe-core.

---

## Sprint 1 – Furuly Basecamp

### Task 1: Persistente basemodeller
- Modify: `game.js`
- Test: `tests.mjs`, `e2e.mjs`
- Legg til `inventory.wood/crystal/herb`, `base.buildings`, `base.assignments`, `base.gardenCharge` og `gathered`.
- Normaliser gamle lagringer uten å endre `villspor-save-v1`.
- Bevar roamers, scent, particles og rendercache som transiente felt.

### Task 2: Ressursloop
- Modify: `game.js`
- Legg til synlige, faste ressurspunkter i camp/skog/hule/fjord.
- Samhandling samler ressursen én gang og lagrer stabil node-ID.
- Ordinære seire gir et lite områdebundet materialdropp.

### Task 3: Tre byggverk med tre nivåer
- Modify: `game.js`, `index.html`, `styles.css`
- Roglassverksted, Treningsring og Bærhage står på faste camp-plasser.
- Et tilgjengelig basepanel viser nivå, kostnad, effekt, oppgradering og bemanning.
- Byggene endrer canvasutseende per nivå.

### Task 4: Bemanning og effekter
- Modify: `game.js`, `game-core.js`
- Bare reservevesener kan bemanne ett bygg om gangen.
- Verksted forbedrer sporsans/fangst, treningsring gir reserve-XP, hage produserer villbær via seire.
- Bytte fra reserve til aktiv flokk fjerner ugyldig bemanning trygt.

## Sprint 2 – Ruten til Fjordbygda

### Task 5: Ny region og forbindelse
- Modify: `game.js`
- Utvid verden østover og legg til en tydelig fjordrute etter hulen.
- Regionen åpnes etter fullført hovedhistorie og minst fire samlede bygningsnivåer.
- Oppdater kollisjon, kamera, minimap, områdenavn og bakoverkompatibel spillerposisjon.

### Task 6: Tre nye originalvesener
- Modify: `game-core.js`, `game.js`
- Create: `assets/creatures/lynglo.svg`, `assets/creatures/ravnbluss.svg`, `assets/creatures/stormhjort.svg`
- Hvert vesen får original rolle, egenskap, fire teknikker og fjordbundet roamerplass.
- Sporbok og illustrasjonssystem skal håndtere totalt ti vesener dynamisk.

### Task 7: Trenere og vokterprøve
- Modify: `game.js`
- To faste trenere og én fjordvokter gir kamper uten fangst.
- Førsteseier og gjenspillbar seier lagres og gir kontrollerte material/XP-belønninger.
- Vokterseier lagrer `fjordMark` og vises i Reisedagboken.

## Sprint 3 – Naturformer og teknikkvalg

### Task 8: Fire teknikker og aktivt valg av tre
- Modify: `game-core.js`, `game.js`, `index.html`, `styles.css`
- Alle ikke-bossvesener får fire teknikker.
- De tre første følger eksisterende progresjon; teknikk fire låses på nivå fem.
- Flokkspanelet lar spilleren velge om tredje eller fjerde teknikk skal være aktiv.

### Task 9: Naturformvalg
- Modify: `game-core.js`, `game.js`
- Ved nivå fem og tre vennskapsbånd velges permanent Sporform eller Vernform.
- Sporform forbedrer angrep/fart; Vernform forbedrer HP/forsvar.
- Valget vises i flokk, sporbok, kamp og canvas med et lett visuelt merke.

### Task 10: Vennskapsbånd og lagstrategi
- Modify: `game.js`, `game-core.js`
- Aktivt vesen får bånd ved seier; basebemanning og trenerkamper gjør reservevenner relevante.
- Fiende-AI vurderer alle lovlige aktive teknikker og formularstatistikk.
- Debugverktøy kan teste materialer, bygningsnivå, fjord og utviklingsklar enhet uten save-forurensning.

## Integrasjon og release

### Task 11: TDD og save-matrise
- Modify: `tests.mjs`, `e2e.mjs`, `a11y.mjs`
- RED før implementasjon for datamodell, lagringsnormalisering, bygg, fjordport, trenere, teknikkvalg og former.
- Test gammel save uten nye felt, avbrutt kamp, full flokk/reserve og ugyldig bemanning.

### Task 12: Mobil, tilgjengelighet og ytelse
- Basepanelet skal være scrollbar på 390×844 og kompakt landskap.
- Permanente live-regioner annonserer ressurs, bygg og naturform.
- Reduced motion stopper nye pulser/markører.
- Mål maksimal entity/partikkelbelastning i Chromium og WebKit.

### Task 13: Review og publisering
- Full spec- og kvalitetsreview av samlet diff.
- Kjør statiske tester, E2E Chromium/WebKit og axe begge motorer lokalt.
- Verifiser representative skjermbilder.
- Commit/push, vent på eksakt Pages-commit, kjør offentlig matrise og lag integritetstestet ZIP.

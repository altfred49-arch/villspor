# Verifikasjon – Furuly Basecamp, Fjordbygda og Naturformer

Dato: 2026-07-19
Baseline: `bdde2cc` (Levende Villspor)

## Leveranse

### Sprint 1 – Furuly Basecamp

- Furuved, glødestein og villurt fra ni synlige materialnoder og ekspedisjonsseire.
- Roglassverksted, Treningsring og Bærhage med tre nivåer hver.
- Reservebemanning med unik arbeider per bygg og typebasert bonus.
- Persistente bygg, materialer, bemanning og hageprogresjon.

### Sprint 2 – Fjordbygda

- Verden utvidet fra 42 til 60 fliser uten å flytte den opprinnelige historien.
- Fysisk rute som krever fullført hovedhistorie og fire byggenivåer.
- Lynglo, Ravnbluss og Stormhjort med originale SVG-er.
- Tre Fjordbygda-roamers, Runa, Aksel og Fjordvokter Inga.
- Trenerkamper uten fangst, førsteseiersbelønning, rematch og varig voktermerke.

### Sprint 3 – Naturformer

- Fire teknikker for alle ni fangbare arter.
- Aktivt valg mellom artens tredje og fjerde teknikk fra nivå 5.
- Sporform og Vernform ved nivå 5 + tre vennskapsbånd.
- Formbaserte egenskaper, kampgjengivelse, lag-/reserve-UI og persistens.

## Lokal testmatrise

| Kontroll | Chromium | WebKit |
|---|---:|---:|
| Statiske tester | 51/51 | Motoruavhengig |
| E2E-assertions | 265/265 | 265/265 |
| E2E runtime-/console-feil | 0 | 0 |
| axe-states | 7 | 7 |
| axe-brudd | 0 | 0 |
| Skjermbilder | 26 | 26 |

E2E dekker blant annet begge Flammefyrsten-avslutningene, postgame, gammel save uten ekspansjonsfelter, atomisk byggkjøp, alle bygg på nivå 3, bemanning, fysisk passering til/fra Fjordbygda, tre trenerseire, fangstforbud i trenerkamp, voktermerke, naturform, teknikkvalg, save round-trip, debugisolasjon, reduced motion, 390×844 portrett og kompakt landskap.

## Save-kompatibilitet

En eksplisitt pre-ekspansjon-save uten materialer, base, trenere, former eller teknikkvalg lastes med følgende standarder:

- Materialer: 0/0/0.
- Bygg: 0/0/0.
- Bemanning: tom.
- Trenere: ingen seire og intet voktermerke.
- Enheter: `bond: 0`, `form: null`, `selectedMoves: null`.

Eksisterende lag, reserve, nivå, HP, fangster, historie og avslutning beholdes. Roamers, partikler, sporsans-runtime, kamp og campcache serialiseres ikke.

## Ytelse

Femsekundersmåling med åtte roamers og full pool på 24 partikler:

| Motor | Frames | Gjennomsnitt | P95 | Maks |
|---|---:|---:|---:|---:|
| Chromium | 300 | 16,67 ms | 17,6 ms | 18,7 ms |
| WebKit | 300 | 16,67 ms | 18,0 ms | 20,0 ms |

Dette matcher eller forbedrer baseline med fem roamers.

## Visuell kontroll

Kontrollert i full desktop, 390×844 mobilportrett og kompakt landskap:

- Basepanel har tre lesbare byggkort, materialrad, bemanningsvalg og intern vertikal scrolling.
- Fjordbygda har sammenhengende fjell–fjord-overgang, lesbar hovedsti, tre tydelige trenere og synlige vesener.
- Ingen horisontal overflow i base-, flokk- eller Sporbokpanel.
- Kampmenyen ligger innenfor Canvas i portrett og landskap.
- Reduced motion fryser roamerbevegelse og pulsering dynamisk.
- Fokus flyttes til åpnet panel, bevares etter Basecamp-handlinger og returneres til en synlig åpner ved lukking.
- Tegnesløyfen suspenderes bak fullskjermspaneler for redusert mobil batteri- og varmebelastning.
- Materialer har tekstlige navn i tillegg til dekorative symboler.
- `0 HP` bevares ved lasting og naturformvalg; trenerbelønninger telles nøyaktig én gang.

## Releasekrav

- Offentlig commit skal samsvare med lokal `HEAD`.
- Nytt HTML og alle nye SVG-er skal returnere HTTP 200.
- Chromium/WebKit E2E og axe skal kjøres mot GitHub Pages før releasearkivet godkjennes.
- Release-ZIP skal ekskludere `.git`, `node_modules`, `qa-*`, `.DS_Store` og lokale midlertidige filer.

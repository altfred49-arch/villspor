# Villspor – Ninnis hemmelige verden

Et originalt, mobilvennlig monsterfangst-RPG laget som en spillbar vertikal prototype.

## Spill

Åpne `index.html`, eller start en lokal server:

```bash
python3 -m http.server 8770
```

Gå deretter til `http://127.0.0.1:8770`.

## Kontroller

- **Flytt:** WASD, piltaster eller berøringsknapper (hold inne for kontinuerlig bevegelse)
- **Samhandle:** E, Enter eller A
- **Flokk:** F
- **Dagbok:** Q
- **Pause:** P eller Escape
- **Fullskjerm:** ⛶-knappen øverst til høyre. På Safari uten Fullscreen API vises veiledning for «Legg til på Hjem-skjermen».

I lav landskapsmodus blir kampmenyen automatisk komprimert nederst, og utforskningskontrollene skjules mens en kamp pågår.

## Mål

Snakk med Bestemor Tora, finn naturvesenene i skogen, fang minst to, åpne fjellporten og stans Flammefyrsten.

Tre valgfrie glødespor er gjemt i skogen og hulen. De gir erfaring, flere villbær og et sterkere Roglass. Villbær kan brukes til taktisk helbredelse i kamp. Minikartet viser veien østover mot fjellets hjerte. Nye venner utover flokken på tre venter i leirreserven og kan byttes inn fra flokkspanelet.

## Teknikk

Ren HTML5 Canvas, CSS og JavaScript uten byggetrinn. `game-core.js` inneholder datamodell og testbar kampmotor. Sju originale, lokalt lagrede SVG-illustrasjoner brukes i kamp, flokk og leirreserve, med programmatisk fallback dersom en fil ikke kan lastes. Mobilkontrollene bruker Pointer Events og blokkerer tekstmarkering, touch-callout og kontekstmeny bare på kontrollområdet. Fremdrift lagres lokalt i nettleseren.

## Tester

```bash
npm install
npm test
# Med lokal server på port 8770:
npm run test:e2e
```

`BASE_URL` og `QA_OUT` kan overstyres for å teste en publisert versjon og lagre skjermbilder et annet sted.

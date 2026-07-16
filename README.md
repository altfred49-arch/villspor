# Villspor – Ninnis hemmelige verden

Et originalt, mobilvennlig monsterfangst-RPG laget som en spillbar vertikal prototype.

## Spill

Åpne `index.html`, eller start en lokal server:

```bash
python3 -m http.server 8770
```

Gå deretter til `http://127.0.0.1:8770`.

## Kontroller

- **Flytt:** WASD, piltaster eller berøringsknapper
- **Samhandle:** E, Enter eller A
- **Flokk:** F
- **Dagbok:** Q
- **Pause:** P eller Escape

## Mål

Snakk med Bestemor Tora, finn naturvesenene i skogen, fang minst to, åpne fjellporten og stans Flammefyrsten.

Tre valgfrie glødespor er gjemt i skogen og hulen. De gir erfaring, flere villbær og et sterkere Roglass. Villbær kan brukes til taktisk helbredelse i kamp. Minikartet viser veien østover mot fjellets hjerte.

## Teknikk

Ren HTML5 Canvas, CSS og JavaScript uten byggetrinn. `game-core.js` inneholder datamodell og testbar kampmotor. Fremdrift lagres lokalt i nettleseren.

## Tester

```bash
node tests.mjs
```

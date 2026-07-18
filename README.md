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

Snakk med Bestemor Tora, finn naturvesenene i skogen, bli venn med minst to, åpne fjellporten og ro ned Flammefyrsten. Vanlig seier er alltid mulig. Samler du alle tre glødesporene og svekker Fyrsten til 25 % HP, våkner **Fjellroglasset** og åpner en egen vennskapsavslutning.

Tre valgfrie glødespor er gjemt i skogen og hulen. De gir erfaring, flere villbær og et sterkere Roglass. Villbær kan brukes til taktisk helbredelse i kamp. Minikartet viser veien østover mot fjellets hjerte. Nye venner utover flokken på tre venter i leirreserven og kan byttes inn fra flokkspanelet.

Loke og Skogvokter Siv tilbyr hvert sitt lagrede sideoppdrag med engangsbelønning. Et blått glimt i hulen leder til den valgfrie Stjernesteinen. Alle sju vesener lærer et tredje, rollebasert angrep på nivå 3, mens fiendene vurderer typefordel, lav HP og statuseffekter før de angriper.

Ved campingplassen starter **Ninnis nattspor**, et firestegs sporoppdrag gjennom eksisterende områder med miljøspor, dialog, kamp og engangsbelønning. I kamp varsler Ninni hvilken type handling fienden forbereder uten å avsløre alle detaljer. Hvert vesen har dessuten en liten rollebasert passiv egenskap som vises i Flokk og Sporbok.

Etter begge avslutningene forblir verden åpen. Reisedagboken markerer hovedhistorien som fullført, NPC-ene reagerer på utfallet, og Sporboka viser oppdaget-/vennestatus for alle sju vesener. Hvis Flammefyrsten først beseires, kan vennskapsprøven forsøkes igjen ved fjellets hjerte. En ny Sporstein ved campingplassen åpner dessuten den gjenspillbare **Sporprøven**: tre kamper uten hvile mellom rundene, med første- og gjentakelsesbelønning samt lagret rekord for færrest brukte villbær. Roglassknappen avbryter prøven trygt.

## Teknikk

Ren HTML5 Canvas, CSS og JavaScript uten byggetrinn. `game-core.js` inneholder datamodell og testbar kampmotor. Sju originale, lokalt lagrede SVG-illustrasjoner brukes i kamp, flokk og leirreserve, med programmatisk fallback dersom en fil ikke kan lastes. Mobilkontrollene bruker Pointer Events og blokkerer tekstmarkering, touch-callout og kontekstmeny bare på kontrollområdet. Fremdrift lagres lokalt i nettleseren. Lokalt vendoret [ZzFXMicro](https://github.com/KilledByAPixel/ZzFX) (MIT) gir navngitte spilllyder med oscillator-fallback.

### Utviklerverktøy

Åpne `http://127.0.0.1:8770/?debug=1` for et sesjonsbasert balansepanel. Det kan justere spillerfart, møtesjanse, lydnivå og angrepsstyrke, teste lyder, helbrede flokken og legge til et testbær. Panelet lastes uten produksjonsfunksjon når parameteren mangler og skriver aldri tuning til lagringen.

## Tester

```bash
npm install
npm test
# Med lokal server på port 8770:
npm run test:e2e
npm run test:e2e:webkit
npm run test:a11y
npm run test:a11y:webkit
```

`BASE_URL`, `QA_OUT` og `BROWSER=chromium|webkit` kan overstyres for å teste en publisert versjon og lagre skjermbilder et annet sted. Kommandoene er klare til å brukes i en CI-matrise når GitHub-tokenet har `workflow`-rettighet.

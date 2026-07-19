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

Loke og Skogvokter Siv tilbyr hvert sitt lagrede sideoppdrag med engangsbelønning. Et blått glimt i hulen leder til den valgfrie Stjernesteinen. Alle de ni fangbare vesnene lærer et tredje, rollebasert angrep på nivå 3 og får et fjerde teknikkvalg på nivå 5, mens fiendene vurderer typefordel, lav HP og statuseffekter før de angriper.

Ved campingplassen starter **Ninnis nattspor**, et firestegs sporoppdrag gjennom eksisterende områder med miljøspor, dialog, kamp og engangsbelønning. I kamp varsler Ninni hvilken type handling fienden forbereder uten å avsløre alle detaljer. Hvert vesen har dessuten en liten rollebasert passiv egenskap som vises i Flokk og Sporbok.

Skogen og hulen har nå synlige naturvesener som vandrer i sine egne biomer. Kontakt eller samhandling starter et kontrollert møte, mens tilfeldige møter er redusert til 10 % fallback når ingen synlig roamer er i nærheten. Ninnis sporsans viser type og grov retning mot nærmeste vesen i seks sekunder. Fangede venner kan sees og snakkes med ved campingplassen, som også har ildfluer, skogsstøv og krystallglød med støtte for redusert bevegelse.

Etter begge avslutningene forblir verden åpen. Reisedagboken markerer hovedhistorien som fullført, NPC-ene reagerer på utfallet, og Sporboka viser oppdaget-/vennestatus for alle ti vesener. Hvis Flammefyrsten først beseires, kan vennskapsprøven forsøkes igjen ved fjellets hjerte. En ny Sporstein ved campingplassen åpner dessuten den gjenspillbare **Sporprøven**: tre kamper uten hvile mellom rundene, med første- og gjentakelsesbelønning samt lagret rekord for færrest brukte villbær. Roglassknappen avbryter prøven trygt.

### Furuly Basecamp og Fjordbygda

Ekspedisjoner og materialnoder gir **furuved**, **glødestein** og **villurt**. Ved campingplassen kan disse brukes til å bygge tre nivåer av Roglassverkstedet, Treningsringen og Bærhagen. Reservevenner kan bemanne ett bygg hver; riktig naturtype forsterker byggets bonus. Fire samlede byggenivåer og fullført hovedhistorie åpner ruten til **Fjordbygda**.

Fjordbygda har tre nye originale vesener – **Lynglo**, **Ravnbluss** og **Stormhjort** – samt trenerne Runa og Aksel. Seier over begge åpner Fjordvokter Ingas lokale prøve. Trenerkamper tillater ikke fangst, men gir erfaring, materialer og et varig Fjordvoktermerke.

På nivå 5 og med tre vennskapsbånd kan et ordinært vesen velge en permanent **Sporform** eller **Vernform**. Sporform prioriterer angrep og fart; Vernform prioriterer HP og forsvar. Spilleren kan samtidig velge hvilken av artens to avanserte teknikker som skal fylle den tredje aktive kampplassen.

## Teknikk

Ren HTML5 Canvas, CSS og JavaScript uten byggetrinn. `game-core.js` inneholder datamodell og testbar kampmotor. Ti originale, lokalt lagrede SVG-illustrasjoner brukes i kamp, flokk og leirreserve, med programmatisk fallback dersom en fil ikke kan lastes. Mobilkontrollene bruker Pointer Events og blokkerer tekstmarkering, touch-callout og kontekstmeny bare på kontrollområdet. Fremdrift, base, trenere, former og teknikkvalg lagres lokalt og migreres bakoverkompatibelt. Lokalt vendoret [ZzFXMicro](https://github.com/KilledByAPixel/zzfx) (MIT) gir navngitte spilllyder med oscillator-fallback.

### Utviklerverktøy

Åpne `http://127.0.0.1:8770/?debug=1` for et sesjonsbasert balansepanel. Det kan justere spillerfart, møtesjanse, synlige roamers, lydnivå og angrepsstyrke, plassere et testvesen, aktivere sporsans, teste lyder, helbrede flokken og legge til testressurser. Panelet kan også klargjøre Basecamp, Fjordbygda og naturformprogresjon og viser antall roamers, fallbackmøter og partikler. Mens debugmodus er aktiv, er all lagring deaktivert; tuning og testhandlinger forsvinner ved ny sidelasting og kan derfor ikke overskrive et vanlig spill.

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

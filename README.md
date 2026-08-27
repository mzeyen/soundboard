# Waveboard

Ein modernes, lokal-first Soundboard im Stream-Deck-Stil. Sounds und eigene Hintergrundbilder lassen sich direkt im Browser hochladen und per Klick oder Tastatur abspielen.

## Start

```bash
npm install
npm run dev
```

Für den Serverbetrieb werden `ADMIN_EMAIL`, `ADMIN_PASSWORD` und optional `DATA_DIR` als Umgebungsvariablen benötigt. Freigegebene Startseiten-Sounds werden zentral in `DATA_DIR/featured.json` gespeichert und sind ohne Anmeldung abspielbar; Änderungen erfordern eine gültige Admin-Sitzung. Nicht freigegebene Sounds bleiben lokal im Browser des Administrators.

## Funktionen

- Einfache lokale Anmeldung
- Audio-Upload für MP3, WAV und OGG
- Eigene Bilder als Pad-Hintergrund
- Stream-Deck-artiges, responsives Raster
- Wiedergabe per Klick oder Zahlentasten 1–8
- Lautstärkeregelung, Kategorien und Löschen von Pads

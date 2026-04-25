# Questions

Eine webbasierte, Kahoot-ähnliche Live-Quiz-Anwendung für Lehrveranstaltungen. Das Projekt ist ein einfacher Next.js-Monolith: UI, Serverlogik und API-Routen liegen in einem einzigen Repository.

## Funktionen

- Host erstellt eine temporäre Quiz-Session mit Spielcode und geheimem Admin-Link.
- Teilnehmer treten per Spielcode oder Link mit eindeutigem Alias-/Avatar-Namen bei.
- Host steuert Lobby, Fragen, Countdown, Auswertung, Zwischenranking und finale Rangliste.
- Teilnehmer sehen während aktiver Fragen keine richtige Antwort.
- Punkte werden ausschließlich serverseitig berechnet: richtig und schnell ergibt mehr Punkte.
- Realtime-Aktualisierung läuft bewusst einfach über Polling alle ca. 1000 ms.
- Sessiondaten werden nur temporär gehalten und per TTL gelöscht.

## Installation

```bash
npm install
```

Für lokale Entwicklung ist keine Redis-Konfiguration nötig. Optional eine `.env.local` erstellen:

```bash
ADMIN_CREATE_PASSWORD=change-me
SESSION_TTL_SECONDS=7200
SESSION_STORE=memory
```

Danach starten:

```bash
npm run dev
```

Die App läuft dann unter `http://localhost:3000`.

## Vercel Deployment

Das Projekt läuft ohne zusätzliche Konfiguration mit dem In-Memory-Store. Dadurch kann man es direkt lokal oder auf Vercel ausprobieren.

Für zuverlässigeren Livebetrieb sollte Redis/Vercel KV verwendet werden, weil In-Memory-Speicher auf mehreren Serverless-Instanzen nicht konsistent ist.

Erforderliche Environment Variables auf Vercel:

```bash
ADMIN_CREATE_PASSWORD=ein-sicheres-passwort
SESSION_TTL_SECONDS=7200
SESSION_STORE=memory
```

Optionale Redis-/KV-Variablen für robusteren Livebetrieb:

```bash
SESSION_STORE=redis
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

`KV_REST_API_URL` und `KV_REST_API_TOKEN` kommen aus Vercel KV bzw. Upstash Redis. Wenn `SESSION_STORE=redis` gesetzt ist, aber die Redis-Variablen fehlen, fällt die App automatisch auf den In-Memory-Store zurück. Die TTL sorgt dafür, dass Sessions automatisch ablaufen. Empfohlen ist für Lehrveranstaltungen ein Wert von 7200 Sekunden.

## Storage

Die Storage-Abstraktion liegt in `lib/session-store.ts`.

- `lib/session-store-memory.ts`: Standard ohne zusätzliche Konfiguration; geeignet für lokale Entwicklung, Demos und einfache Nutzung.
- `lib/session-store-redis.ts`: für Vercel und Livebetrieb über Vercel KV / Redis.

Wichtig: `SESSION_STORE=memory` ist am einfachsten, kann auf Vercel bei mehreren Serverless-Instanzen aber inkonsistent werden. Für möglichst zuverlässigen Livebetrieb mit ca. 30 Teilnehmern pro Session `SESSION_STORE=redis` nutzen.

## Performance und Livebetrieb

Die App ist auf einfache, stabile Nutzung in Lehrveranstaltungen ausgelegt. Bei ca. 30 Teilnehmern erzeugt das Polling im Sekundenrhythmus eine überschaubare Last. Teilnehmer-Responses sind bewusst kompakt und enthalten während aktiver Fragen keine korrekte Antwort. Schreibzugriffe entstehen vor allem beim Beitritt, beim Antworten und bei Host-Aktionen.

Für den Livebetrieb:

- Ohne zusätzliche Konfiguration funktioniert `SESSION_STORE=memory`.
- Für höhere Zuverlässigkeit Vercel KV / Upstash Redis mit TTL nutzen.
- Pro Session realistisch ca. 30 Teilnehmer einplanen; technisch ist ein kleiner Puffer vorhanden.
- Host sollte die Session nach Ende löschen oder auslaufen lassen.

## Admin-Erstellung

Neue Sessions werden unter `/admin/create` erstellt. Das Formular prüft `ADMIN_CREATE_PASSWORD`. Wenn lokal kein Passwort gesetzt ist oder es `change-me` lautet, ist die Erstellung bewusst offen, um die Demo schnell starten zu können. Für Vercel immer ein eigenes Passwort setzen.

Nach Erstellung zeigt die App:

- Spielcode
- Admin-Link mit geheimem Token
- Teilnehmer-Link
- optionales Teilnehmerpasswort

Der Admin-Token wird nicht im Klartext gespeichert, sondern als SHA-256-Hash in der Session gehalten.

## Fragen austauschen

Die Dummy-Spiele liegen in `lib/games.ts`. Dort können Spiele, Fragen, Optionen, korrekte Antworten und Zeitlimits angepasst werden. Jede Frage braucht eine eindeutige `id`, Optionen mit eindeutigen IDs und eine passende `correctOptionId`.

## Datenschutz

Die App nutzt keine externe Authentifizierung, keine Analytics, kein Tracking und keine dauerhaften Cookies. Teilnehmerdaten werden nicht dauerhaft gespeichert. Sessiondaten existieren nur temporär im Memory-Store oder in Redis bis zum manuellen Löschen bzw. Ablauf der TTL.

Teilnehmer sollen keine personenbezogenen Daten eingeben. Für den Namen im Quiz sind neutrale Alias- oder Avatar-Namen vorgesehen, zum Beispiel `Eule-17`, `Tafelstern`, `Gruppe Blau` oder `Team 04`. Nicht verwenden: Klarnamen, Matrikelnummern, E-Mail-Adressen, Telefonnummern oder sonstige identifizierende Angaben.

## Wichtige Routen

- `/`: Startseite
- `/admin/create`: Session erstellen
- `/host/[sessionCode]?token=...`: Host-Steuerung
- `/join`: Beitritt per Code
- `/join/[sessionCode]`: Beitritt mit vorausgefülltem Code
- `/play/[sessionCode]`: Teilnehmeransicht

## API

Alle API-Routen liegen im selben Next.js-Projekt:

- `POST /api/sessions/create`
- `GET /api/sessions/[code]/host`
- `GET /api/sessions/[code]/player`
- `POST /api/sessions/[code]/join`
- `POST /api/sessions/[code]/start`
- `POST /api/sessions/[code]/answer`
- `POST /api/sessions/[code]/close-question`
- `POST /api/sessions/[code]/show-results`
- `POST /api/sessions/[code]/next-question`
- `POST /api/sessions/[code]/finish`
- `DELETE /api/sessions/[code]`

# Questions

Eine webbasierte, Kahoot-ähnliche Live-Quiz-Anwendung für Lehrveranstaltungen. Das Projekt ist ein einfacher Next.js-Monolith: UI, Serverlogik und API-Routen liegen in einem einzigen Repository.

## Funktionen

- Host erstellt eine temporäre Quiz-Session mit Spielcode und geheimem Admin-Link.
- Teilnehmer treten per Spielcode oder Link mit eindeutigem Nickname bei.
- Host steuert Lobby, Fragen, Countdown, Auswertung, Zwischenranking und finale Rangliste.
- Teilnehmer sehen während aktiver Fragen keine richtige Antwort.
- Punkte werden ausschließlich serverseitig berechnet: richtig und schnell ergibt mehr Punkte.
- Realtime-Aktualisierung läuft bewusst einfach über Polling alle ca. 800 ms.
- Sessiondaten werden nur temporär gehalten und per TTL gelöscht.

## Installation

```bash
npm install
```

Für lokale Entwicklung ohne Redis eine `.env.local` erstellen:

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

Das Projekt ist für Vercel vorbereitet. Für Livebetrieb sollte Redis/Vercel KV verwendet werden, weil In-Memory-Speicher auf mehreren Serverless-Instanzen nicht konsistent ist.

Erforderliche Environment Variables auf Vercel:

```bash
ADMIN_CREATE_PASSWORD=ein-sicheres-passwort
SESSION_TTL_SECONDS=7200
SESSION_STORE=redis
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

`KV_REST_API_URL` und `KV_REST_API_TOKEN` kommen aus Vercel KV bzw. Upstash Redis. Die TTL sorgt dafür, dass Sessions automatisch ablaufen. Empfohlen ist für Lehrveranstaltungen ein Wert von 7200 Sekunden.

## Storage

Die Storage-Abstraktion liegt in `lib/session-store.ts`.

- `lib/session-store-memory.ts`: nur für lokale Entwicklung und Demos geeignet.
- `lib/session-store-redis.ts`: für Vercel und Livebetrieb über Vercel KV / Redis.

Wichtig: `SESSION_STORE=memory` funktioniert lokal, ist aber auf Vercel für parallele Serverless-Instanzen nicht zuverlässig. Für Livebetrieb mit ca. 30 Teilnehmern pro Session `SESSION_STORE=redis` nutzen.

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

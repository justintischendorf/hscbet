# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei festgehalten.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
und das Projekt folgt dem
[Semantic Versioning](https://semver.org/lang/de/spec/v2.0.0.html).

## [Unreleased]

### Hinzugefügt

- CI prüft bei jedem Pull Request nach `develop` und `main` zusätzlich die
  TypeScript-Typen (`bun run check-types`) und baut alle Apps
  (`bun run build`). Neues Script `bun run format:check`. ([#57])
- Release-PR-Workflow: Ein neuer PR nach `main` mit leerer Beschreibung wird
  automatisch mit `.github/release_pr_template.md` und der Liste der Commits
  seit dem letzten Release gefüllt. Die Version kommt aus dem PR-Titel
  (z. B. `v1.1.0`). ([#57])
- Dependabot öffnet jeden Montag PRs nach `develop` für Bun-Pakete,
  GitHub Actions, die Basis-Images der Dockerfiles und die Images in den
  Compose-Dateien. ([#58])
- `CHANGELOG.md` und `CONTRIBUTING.md` mit den Regeln für Branches, Commits,
  Pull Requests, CI und Releases. ([#59])
- Script `bun lint:fix`, das automatisch behebbare Lint-Fehler korrigiert.

### Geändert

- Datenbank-Indizes auf `session.userId`, `account.userId` und
  `verification.identifier`, wie von better-auth empfohlen. Das beschleunigt
  Login, Session-Abfragen und Bestätigungscodes. Die Migration läuft beim
  nächsten Start automatisch und ändert keine Daten.
- Das Systemdiagramm in `docs/architecture` zeigt jetzt auch das Rank Module.
  ([#60])
- oxlint nutzt zusätzlich die Plugins `unicorn`, `oxc` und `import`, und
  `bun lint:fix` entfernt ungenutzte Imports. oxfmt sortiert Imports in
  Gruppen (Node, Pakete, `@repo/` und `@/`, relative Pfade) mit Leerzeilen
  dazwischen.
- VS Code formatiert alle Dateien mit oxc statt TypeScript und JSON mit
  Prettier, so wie die CI prüft.
- Alle Abhängigkeiten auf den aktuellen Stand gebracht, u. a. TypeScript 7,
  Next.js 16.4, React 19.3, better-auth 1.7, Prisma 7.10, BullMQ 6,
  ioredis 6, dotenv 18 und Bun 1.4.4. Elysia bleibt bei 1.4 und damit
  `elysia-rate-limit` bei 4.6, Prisma 8 ist noch ein Release Candidate.

### Behoben

- Das Logo fehlte auf verschachtelten Seiten wie `/groups/[id]`, weil die
  Bildpfade relativ statt absolut waren.
- Auf der Kontoseite hatten die Passwortfelder zum Ändern des Passworts und
  zum Löschen des Accounts dieselbe ID, sodass ein Klick auf das Label das
  falsche Feld auswählen konnte.
- Die Warnungen der neuen React-Regeln von oxlint 1.93 behoben. Die
  ausgewählte Saison (Saison, Tipps, Gruppe) und der Dialog zur
  E-Mail-Bestätigung werden beim Rendern abgeleitet statt in einem Effect
  gesetzt. Die Bildvorschau beim Profil- und Gruppenbild entsteht direkt
  beim Auswählen der Datei.
- Der Dialog zur E-Mail-Bestätigung öffnet sich nach dem Schließen nicht
  mehr erneut, wenn die Session neu geladen wird.
- Eingaben im Passwort-Formular und in den Konto-Daten werden nicht mehr
  zurückgesetzt, wenn die Session neu geladen wird (z. B. beim Wechsel
  zurück in den Tab).
- Tipps auf der Tipp-Seite sperren sich beim Anpfiff jetzt auch ohne
  Neuladen der Seite (Prüfung alle 30 Sekunden).
- `bun run check-types` und `bun run build` warten auf
  `@repo/database#generate`. Vorher liefen Packages wie `worker` und
  `treaty` parallel dazu und fanden den generierten Prisma Client nicht,
  wenn er noch nicht existierte (z. B. in der CI). ([#57])

### Entfernt

- MIT-Lizenz (`LICENSE`) und der Lizenz-Abschnitt in der README. ([#57])
- Script `bun lint:turbo`, das wegen der zyklischen Abhängigkeit zwischen
  `@repo/api` und `@repo/auth` nie lief. Gelintet wird mit `bun lint`. ([#59])
- Prettier und `prettier-plugin-tailwindcss`. Formatiert wird nur noch mit
  oxfmt.

## [1.0.0] - 2026-10-30

Erstes Release der Tippspiel-Plattform für den HSC 2000 Coburg.

### Hinzugefügt

#### Accounts und Anmeldung

- Registrierung und Anmeldung mit E-Mail und Passwort über Better Auth,
  mit Logo und eigenem Theme auf den Auth-Seiten. ([#10])
- Freigabe neuer Accounts: Nach der Registrierung geht eine Review-Mail an
  `SIGNUP_REVIEW_MAIL_ADDRESS`. Ihre Links führen auf `/signup/review`, wo
  der Account per Klick freigegeben oder abgelehnt wird. Bis zur Freigabe
  ist keine Anmeldung möglich. ([#49])
- E-Mail-Bestätigung, „Passwort vergessen“ mit Einmalcode (OTP) und
  E-Mail-Versand über Resend. ([#33], [#37], [#49])
- Zwei-Faktor-Authentifizierung mit Authenticator-App, Backup-Codes zum
  Kopieren und Anmeldung mit einem Backup-Code. ([#15], [#16])
- Account-Einstellungen: Name, E-Mail und Passwort ändern (mit Anzeige der
  Passwortstärke), Profilbild hochladen und Account löschen. ([#14], [#17],
  [#44])

#### Saisons, Spiele und Tipps

- Saison-Seite mit der Tabelle aller Spiele einer Saison. ([#18], [#23])
- Tipp-Seite: Tipps für kommende Spiele abgeben und ändern, Diagramm mit
  den richtigen und falschen Tipps pro Saison. ([#19], [#24], [#27], [#36])
- Punktevergabe pro Spiel nach der Tordifferenz: 2 Punkte für die exakte
  Differenz (1 Punkt je Spieler, wenn mehrere sie treffen). Trifft niemand
  die Differenz, bekommt der nächste Tipp 1 Punkt (0,5 je Spieler bei
  Gleichstand). ([#29], [#49])
- Dashboard mit den eigenen Punkten und Ranglogos. ([#28], [#29])

#### Gruppen

- Gruppen erstellen, mit Gruppenbild, und verlassen. Eine Gruppe lässt sich
  als Favorit markieren. ([#20], [#24], [#25], [#30])
- Mitglieder einladen: Die Einladung erscheint im Posteingang der
  eingeladenen Person und kann dort angenommen werden. ([#40])
- Gruppen-Statistiken mit Platzierung, Punkten pro Spiel und Rang-Icons je
  Saison. Die aktuelle Saison ist vorausgewählt. ([#39])
- Der Gruppenleiter kann Name, Beschreibung und Bild der Gruppe bearbeiten.
  ([#46])

#### Admin

- Admin-Bereich: Saisons und Spiele anlegen, bearbeiten und löschen sowie
  Spielergebnisse eintragen und nachträglich korrigieren. Alle Nutzer
  bekommen dazu eine Benachrichtigung, und ihre Punkte werden neu
  berechnet. ([#26], [#48], [#50])
- Script `bun db:admin <email>` vergibt die Admin-Rolle, `--revoke` entzieht
  sie. ([#48])

#### Oberfläche

- Navigation mit Logo, Avatar und Anzeige der WebSocket-Verbindung. ([#8],
  [#13], [#17], [#21], [#22])
- Posteingang mit Benachrichtigungen in Echtzeit, z. B. für
  Gruppeneinladungen und geänderte Spiele. Alle lassen sich als gelesen
  markieren, gelesene lassen sich löschen. ([#34])
- Alle Seiten sind für Smartphone und Desktop ausgelegt. ([#38], [#43])
- Heller und dunkler Modus. ([#42])
- Neues Logo und Spielerbild. ([#47])

#### Technik und Betrieb

- Turborepo-Monorepo mit Bun: Next.js-Frontend (`apps/web`) und
  Elysia-API (`apps/api`). ([#2])
- Datenbank mit Prisma und SQLite (libSQL), inklusive Migrationen. ([#6],
  [#52])
- Typisierter API-Client mit Eden Treaty (`packages/treaty`) und ein
  gemeinsamer Logger (`packages/logger`). ([#9])
- WebSocket-Verbindung zwischen Frontend und API. ([#11])
- Dateispeicher über MinIO / S3 mit Presigned URLs (`packages/bucket`) und
  Rate Limiting der API (50 Anfragen pro Minute und IP). ([#12])
- Hintergrund-Jobs: Job-Queue über Redis (`packages/queue`), ein Worker
  (`packages/worker`) und Pub/Sub (`packages/pub-sub`), über das der
  Worker Ergebnisse per WebSocket an die Clients schickt. ([#32], [#34])
- API-Daten werden pro Route vorgeladen, Ladezustände laufen über TanStack
  Query Mutations. ([#31], [#35])
- Docker Compose für die Entwicklung (MinIO, Redis, Worker) und für
  Production (alle Services, Migrationen laufen beim Start automatisch).
  ([#13], [#38], [#55])
- Seed-Script `bun db:seed` mit Demo-Daten für die lokale Entwicklung.
  ([#42], [#48], [#49])
- Linting und Formatierung mit oxlint und oxfmt, CI für Pull Requests und
  `CODEOWNERS`. ([#2], [#3], [#4], [#39], [#51])
- Pakete kommen aus der öffentlichen npm-Registry. ([#45])
- README mit Anleitungen für Development und Production, Systemdiagramm und
  `.env.example`-Dateien. ([#8], [#53], [#55])

[Unreleased]: https://github.com/justintischendorf/hscbet/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/justintischendorf/hscbet/releases/tag/v1.0.0
[#2]: https://github.com/justintischendorf/hscbet/pull/2
[#3]: https://github.com/justintischendorf/hscbet/pull/3
[#4]: https://github.com/justintischendorf/hscbet/pull/4
[#6]: https://github.com/justintischendorf/hscbet/pull/6
[#8]: https://github.com/justintischendorf/hscbet/pull/8
[#9]: https://github.com/justintischendorf/hscbet/pull/9
[#10]: https://github.com/justintischendorf/hscbet/pull/10
[#11]: https://github.com/justintischendorf/hscbet/pull/11
[#12]: https://github.com/justintischendorf/hscbet/pull/12
[#13]: https://github.com/justintischendorf/hscbet/pull/13
[#14]: https://github.com/justintischendorf/hscbet/pull/14
[#15]: https://github.com/justintischendorf/hscbet/pull/15
[#16]: https://github.com/justintischendorf/hscbet/pull/16
[#17]: https://github.com/justintischendorf/hscbet/pull/17
[#18]: https://github.com/justintischendorf/hscbet/pull/18
[#19]: https://github.com/justintischendorf/hscbet/pull/19
[#20]: https://github.com/justintischendorf/hscbet/pull/20
[#21]: https://github.com/justintischendorf/hscbet/pull/21
[#22]: https://github.com/justintischendorf/hscbet/pull/22
[#23]: https://github.com/justintischendorf/hscbet/pull/23
[#24]: https://github.com/justintischendorf/hscbet/pull/24
[#25]: https://github.com/justintischendorf/hscbet/pull/25
[#26]: https://github.com/justintischendorf/hscbet/pull/26
[#27]: https://github.com/justintischendorf/hscbet/pull/27
[#28]: https://github.com/justintischendorf/hscbet/pull/28
[#29]: https://github.com/justintischendorf/hscbet/pull/29
[#30]: https://github.com/justintischendorf/hscbet/pull/30
[#31]: https://github.com/justintischendorf/hscbet/pull/31
[#32]: https://github.com/justintischendorf/hscbet/pull/32
[#33]: https://github.com/justintischendorf/hscbet/pull/33
[#34]: https://github.com/justintischendorf/hscbet/pull/34
[#35]: https://github.com/justintischendorf/hscbet/pull/35
[#36]: https://github.com/justintischendorf/hscbet/pull/36
[#37]: https://github.com/justintischendorf/hscbet/pull/37
[#38]: https://github.com/justintischendorf/hscbet/pull/38
[#39]: https://github.com/justintischendorf/hscbet/pull/39
[#40]: https://github.com/justintischendorf/hscbet/pull/40
[#42]: https://github.com/justintischendorf/hscbet/pull/42
[#43]: https://github.com/justintischendorf/hscbet/pull/43
[#44]: https://github.com/justintischendorf/hscbet/pull/44
[#45]: https://github.com/justintischendorf/hscbet/pull/45
[#46]: https://github.com/justintischendorf/hscbet/pull/46
[#47]: https://github.com/justintischendorf/hscbet/pull/47
[#48]: https://github.com/justintischendorf/hscbet/pull/48
[#49]: https://github.com/justintischendorf/hscbet/pull/49
[#50]: https://github.com/justintischendorf/hscbet/pull/50
[#51]: https://github.com/justintischendorf/hscbet/pull/51
[#52]: https://github.com/justintischendorf/hscbet/pull/52
[#53]: https://github.com/justintischendorf/hscbet/pull/53
[#55]: https://github.com/justintischendorf/hscbet/pull/55
[#57]: https://github.com/justintischendorf/hscbet/pull/57
[#58]: https://github.com/justintischendorf/hscbet/pull/58
[#59]: https://github.com/justintischendorf/hscbet/pull/59
[#60]: https://github.com/justintischendorf/hscbet/pull/60

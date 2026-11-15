# Mitwirken an HSCBet

Diese Datei beschreibt, wie Änderungen in das Projekt kommen: Branches,
Commits, Pull Requests, CI und Releases. Wie man das Projekt lokal aufsetzt,
steht in der [README](README.md#development).

## Überblick

```text
feat/…     ─┐
fix/…      ─┼─ PR (Squash) ─▶ develop ─ Release-PR (Merge-Commit) ─▶ main ─▶ Tag vX.Y.Z
refactor/… ─┘
```

- **`develop`** ist der Arbeitsbranch. Alle Änderungen kommen per Pull Request
  hierher.
- **`main`** enthält nur veröffentlichte Versionen. Hierher kommt nur
  `develop` über einen Release-PR.
- Direkte Pushes auf `main` und `develop` sind nicht möglich. Beide Branches
  sind durch Rulesets geschützt und können nicht gelöscht werden.

## Branches

Neue Branches immer von einem aktuellen `develop` abzweigen:

```sh
git switch develop
git pull
git switch -c feat/group-chat
```

Der Branch-Name orientiert sich am Commit bzw. PR-Titel:

```text
<typ>/<kurze-beschreibung>
```

- `<typ>` ist derselbe Typ wie im PR-Titel (siehe
  [Commits und PR-Titel](#commits-und-pr-titel)), also `feat`, `fix`,
  `refactor`, `style`, `docs`, `build`, `ci`, `chore` oder `revert`.
- `<kurze-beschreibung>` fasst den PR in zwei bis vier Wörtern zusammen:
  Englisch, Kleinbuchstaben, mit Bindestrichen, ohne Artikel.

| Branch                      | PR-Titel                                               |
| --------------------------- | ------------------------------------------------------ |
| `feat/group-invite`         | `feat: add the group invite workflow and popup`        |
| `fix/avatar-fallback`       | `fix: show the avatar loading state`                   |
| `refactor/tips-layout`      | `refactor: rework the tips layout`                     |
| `docs/changelog`            | `docs: add the changelog and the contributing guide`   |
| `build/production-build`    | `build: add the production build setup`                |
| `ci/dependabot`             | `ci: add the dependabot config`                        |
| `chore/update-dependencies` | `chore: update the dependencies`                       |
| `revert/animated-logo`      | `revert: replace the logo with an animated scoreboard` |

Branches von Dependabot heißen `dependabot/…` und werden automatisch angelegt.
Nach dem Merge löscht GitHub den Branch automatisch.

## Commits und PR-Titel

Commit-Nachrichten und PR-Titel folgen
[Conventional Commits](https://www.conventionalcommits.org/de/v1.0.0/):

```text
<typ>: <beschreibung>
```

- Englisch, alles kleingeschrieben, im Imperativ, ohne Punkt am Ende
- Die Beschreibung ist ein kurzer Satz, meist mit Artikel:
  `feat: add the group stats screen`, nicht `feat: group stats`

| Typ        | Wofür                                    | Beispiel                                               |
| ---------- | ---------------------------------------- | ------------------------------------------------------ |
| `feat`     | Neue Funktion oder sichtbare Erweiterung | `feat: let the group leader edit the group info`       |
| `fix`      | Fehlerbehebung                           | `fix: show the connection state on the avatar`         |
| `refactor` | Umbau ohne neue Funktion                 | `refactor: prefetch the api data per route`            |
| `style`    | Nur Formatierung, kein geänderter Code   | `style: format the api and web apps`                   |
| `docs`     | Nur Dokumentation                        | `docs: update the readme and the .env.example files`   |
| `build`    | Build, Docker, Abhängigkeiten            | `build: add the production build setup`                |
| `ci`       | GitHub Actions, Dependabot               | `ci: add the dependabot config`                        |
| `chore`    | Sonstiges, z. B. Tooling oder `bun.lock` | `chore: replace eslint with oxlint`                    |
| `revert`   | Macht einen früheren Commit rückgängig   | `revert: replace the logo with an animated scoreboard` |

Bei `revert` ist die Beschreibung die des rückgängig gemachten Commits.
Über den „Revert“-Button auf GitHub heißt der PR zunächst
`Revert "feat: …"`. Vor dem Mergen den Titel ins Format oben ändern.

Dependabot hält sich selbst daran (`chore(deps): …`, `ci: …`, `build: …`).

> [!IMPORTANT]
> Weil nach `develop` per Squash gemergt wird, landet der **PR-Titel** als
> Commit-Nachricht auf `develop` und später im Release. Er muss also dem
> Format oben entsprechen. Hat der PR nur einen Commit, nimmt GitHub stattdessen
> dessen Nachricht. Die einzelnen Commits auf dem Branch selbst sind sonst
> frei.

## Pull Requests

1. Branch pushen und einen PR nach **`develop`** öffnen.
2. Titel nach dem Format oben vergeben.
3. Bei Änderungen, die Nutzer oder Betreiber betreffen, einen Eintrag unter
   `## [Unreleased]` in der [CHANGELOG.md](CHANGELOG.md) ergänzen (siehe
   [Changelog](#changelog)).
4. Warten, bis die CI grün ist. Ohne grünen Check `ci` lässt sich nicht mergen.
5. Mit **„Squash and merge“** mergen. Andere Merge-Methoden sind für
   `develop` gesperrt.

Ein Review ist aktuell nicht vorgeschrieben. `CODEOWNERS` trägt den Owner
automatisch als Reviewer ein.

### Vor dem Push

Die CI prüft dasselbe wie diese Befehle, also am besten vorher lokal laufen
lassen:

```sh
bun run format:check   # Formatierung (oxfmt)
bun run lint           # Linting (oxlint)
bun run check-types    # TypeScript-Typen
bun run build          # Build aller Apps
```

Formatierungsfehler behebt `bun format`.

Bei Änderungen am Datenbankschema die neue Migration aus
`packages/database/prisma/migrations/` mit committen (siehe
[Schema ändern](README.md#changing-the-schema)).

## CI

Der Workflow [`ci.yml`](.github/workflows/ci.yml) läuft bei jedem PR nach
`develop` und `main` und prüft nacheinander:

1. Formatierung (`bun run format:check`)
2. Linting (`bun run lint`)
3. Typen (`bun run check-types`)
4. Build (`bun run build`)

Der Job heißt `ci` und ist in den Rulesets als Pflicht-Check eingetragen.
Wird er umbenannt, muss der Name auch im Ruleset „Protect main and develop“
angepasst werden, sonst lässt sich kein PR mehr mergen. Tests gibt es aktuell
keine.

## Changelog

Die [CHANGELOG.md](CHANGELOG.md) folgt
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/):

- Neue Einträge kommen unter `## [Unreleased]` in den passenden Abschnitt:
  `Hinzugefügt`, `Geändert`, `Veraltet`, `Entfernt`, `Behoben` oder
  `Sicherheit`.
- Beschrieben wird, was sich für Nutzer oder Betreiber ändert, nicht wie es
  umgesetzt ist.
- Am Ende des Eintrags steht die PR-Nummer, z. B. `([#58])`, und unten in der
  Datei der passende Link.
- Reine Interna ohne Auswirkung (Formatierung, Umbenennungen, `bun.lock`)
  brauchen keinen Eintrag.

## Releases

Versionen folgen [Semantic Versioning](https://semver.org/lang/de/):
`MAJOR.MINOR.PATCH`, z. B. `v1.1.0` für neue Funktionen oder `v1.0.1` für
reine Fehlerbehebungen.

1. **Changelog vorbereiten:** Auf einem Branch (z. B. `docs/release-v1.1.0`)
   in der `CHANGELOG.md` `## [Unreleased]` in `## [1.1.0] - JJJJ-MM-TT`
   umbenennen, darüber ein neues, leeres `## [Unreleased]` anlegen und die
   Links unten anpassen. Per PR nach `develop` mergen.
2. **Release-PR öffnen:** PR von `develop` nach `main` mit dem Titel
   `v1.1.0`. Die Beschreibung **leer lassen**: Der Workflow
   [`release-pr.yml`](.github/workflows/release-pr.yml) füllt sie aus der
   Vorlage [`release_pr_template.md`](.github/release_pr_template.md) mit allen
   Commits seit dem letzten Release. Danach nur noch die Zusammenfassung oben
   ergänzen.
3. **Mergen** mit **„Create a merge commit“**. Andere Merge-Methoden sind
   für `main` gesperrt.
4. **Tag und GitHub Release:** Auf GitHub unter **Releases → Draft a new
   release** den Tag `v1.1.0` auf `main` anlegen. Als Text den Abschnitt der
   Version aus der `CHANGELOG.md` übernehmen. Tags `v*` sind geschützt und
   können danach weder verschoben noch gelöscht werden.

## Abhängigkeiten

Dependabot öffnet jeden Montag PRs nach `develop` (Konfiguration in
[`dependabot.yml`](.github/dependabot.yml)):

- Bun-Pakete: Minor- und Patch-Updates gesammelt in einem PR, Major-Updates
  einzeln
- GitHub Actions in einem PR
- Docker-Images aus den Dockerfiles und den Compose-Dateien

Diese PRs werden wie alle anderen behandelt: CI abwarten, bei Major-Updates
lokal kurz testen, dann per Squash mergen.

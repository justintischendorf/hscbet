# Contributing to HSCBet

This file describes how changes make their way into the project: branches,
commits, pull requests, CI and releases. How to set up the project locally is
described in the [README](README.md#development).

## Overview

```text
feat/…     ─┐
fix/…      ─┼─ PR (squash) ─▶ develop ─ release PR (merge commit) ─▶ main ─▶ tag vX.Y.Z
refactor/… ─┘
```

- **`develop`** is the working branch. All changes land here via pull
  request.
- **`main`** only contains released versions. The only thing that lands here
  is `develop`, via a release PR.
- Direct pushes to `main` and `develop` are not possible. Both branches are
  protected by rulesets and cannot be deleted.

## Branches

Always branch off an up-to-date `develop`:

```sh
git switch develop
git pull
git switch -c feat/group-chat
```

The branch name follows the commit or PR title:

```text
<type>/<short-description>
```

- `<type>` is the same type as in the PR title (see
  [Commits and PR titles](#commits-and-pr-titles)), i.e. `feat`, `fix`,
  `refactor`, `style`, `docs`, `build`, `ci`, `chore` or `revert`.
- `<short-description>` sums up the PR in two to four words: English,
  lowercase, hyphenated, without articles.

| Branch                      | PR title                                               |
| --------------------------- | ------------------------------------------------------ |
| `feat/group-invite`         | `feat: add the group invite workflow and popup`        |
| `fix/avatar-fallback`       | `fix: show the avatar loading state`                   |
| `refactor/tips-layout`      | `refactor: rework the tips layout`                     |
| `docs/changelog`            | `docs: add the changelog and the contributing guide`   |
| `build/production-build`    | `build: add the production build setup`                |
| `ci/dependabot`             | `ci: add the dependabot config`                        |
| `chore/update-dependencies` | `chore: update the dependencies`                       |
| `revert/animated-logo`      | `revert: replace the logo with an animated scoreboard` |

Dependabot branches are named `dependabot/…` and are created automatically.
GitHub deletes the branch automatically after the merge.

## Commits and PR titles

Commit messages and PR titles follow
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>: <description>
```

- English, all lowercase, imperative mood, no trailing period
- The description is a short sentence, usually with an article:
  `feat: add the group stats screen`, not `feat: group stats`

| Type       | Used for                           | Example                                                |
| ---------- | ---------------------------------- | ------------------------------------------------------ |
| `feat`     | New feature or visible enhancement | `feat: let the group leader edit the group info`       |
| `fix`      | Bug fix                            | `fix: show the connection state on the avatar`         |
| `refactor` | Restructuring without new features | `refactor: prefetch the api data per route`            |
| `style`    | Formatting only, no code changes   | `style: format the api and web apps`                   |
| `docs`     | Documentation only                 | `docs: update the readme and the .env.example files`   |
| `build`    | Build, Docker, dependencies        | `build: add the production build setup`                |
| `ci`       | GitHub Actions, Dependabot         | `ci: add the dependabot config`                        |
| `chore`    | Misc, e.g. tooling or `bun.lock`   | `chore: replace eslint with oxlint`                    |
| `revert`   | Reverts an earlier commit          | `revert: replace the logo with an animated scoreboard` |

For `revert`, the description is the one of the reverted commit. When using
the "Revert" button on GitHub, the PR is initially titled
`Revert "feat: …"`. Change the title to the format above before merging.

Dependabot follows this format on its own (`chore(deps): …`, `ci: …`,
`build: …`).

> [!IMPORTANT]
> Because PRs to `develop` are squash-merged, the **PR title** becomes the
> commit message on `develop` and later in the release. So it must follow the
> format above. If the PR has only one commit, GitHub uses that commit's
> message instead. Otherwise, the individual commits on the branch itself
> can be named freely.

## Pull requests

1. Push the branch and open a PR to **`develop`**.
2. Give it a title in the format above.
3. For changes that affect users or operators, add an entry under
   `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md) (see
   [Changelog](#changelog)).
4. Wait for CI to pass. Without a green `ci` check, merging is blocked.
5. Merge with **"Squash and merge"**. Other merge methods are disabled for
   `develop`.

A review is currently not required. `CODEOWNERS` automatically adds the
owner as a reviewer.

### Before pushing

CI checks the same things as these commands, so it is best to run them
locally first:

```sh
bun run format:check   # formatting (oxfmt)
bun run lint           # linting (oxlint)
bun run check-types    # TypeScript types
bun run build          # build all apps
```

`bun format` fixes formatting errors.

When changing the database schema, commit the new migration from
`packages/database/prisma/migrations/` as well (see
[Changing the schema](README.md#changing-the-schema)).

## CI

The [`ci.yml`](.github/workflows/ci.yml) workflow runs on every PR to
`develop` and `main` and checks, in order:

1. Formatting (`bun run format:check`)
2. Linting (`bun run lint`)
3. Types (`bun run check-types`)
4. Build (`bun run build`)

The job is called `ci` and is configured as a required check in the
rulesets. If it is renamed, the name must also be updated in the
"Protect main and develop" ruleset, otherwise no PR can be merged. There are
currently no tests.

## Changelog

[CHANGELOG.md](CHANGELOG.md) follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/):

- New entries go under `## [Unreleased]` in the matching section: `Added`,
  `Changed`, `Deprecated`, `Removed`, `Fixed` or `Security`.
- Describe what changes for users or operators, not how it is implemented.
- Each entry ends with the PR number, e.g. `([#58])`, with the matching link
  at the bottom of the file.
- Purely internal changes without impact (formatting, renames, `bun.lock`)
  don't need an entry.

## Releases

Versions follow [Semantic Versioning](https://semver.org/):
`MAJOR.MINOR.PATCH`, e.g. `v1.1.0` for new features or `v1.0.1` for bug
fixes only.

1. **Prepare the changelog:** On a branch (e.g. `docs/release-v1.1.0`),
   rename `## [Unreleased]` in `CHANGELOG.md` to `## [1.1.0] - YYYY-MM-DD`,
   add a new, empty `## [Unreleased]` above it and update the links at the
   bottom. Merge it into `develop` via PR.
2. **Open the release PR:** Open a PR from `develop` to `main` titled
   `v1.1.0`. **Leave the description empty**: the
   [`release-pr.yml`](.github/workflows/release-pr.yml) workflow fills it
   from the [`release_pr_template.md`](.github/release_pr_template.md)
   template with all commits since the last release. Then just add the
   summary at the top.
3. **Merge** with **"Create a merge commit"**. Other merge methods are
   disabled for `main`.
4. **Tag and GitHub release:** On GitHub, go to **Releases → Draft a new
   release** and create the tag `v1.1.0` on `main`. Use the version's section
   from `CHANGELOG.md` as the release notes. `v*` tags are protected and
   cannot be moved or deleted afterwards.

## Dependencies

Every Monday, Dependabot opens PRs to `develop` (configured in
[`dependabot.yml`](.github/dependabot.yml)):

- Bun packages: minor and patch updates grouped in one PR, major updates
  individually
- GitHub Actions in one PR
- Docker images from the Dockerfiles and the Compose files

These PRs are handled like any other: wait for CI, briefly test major
updates locally, then squash-merge.

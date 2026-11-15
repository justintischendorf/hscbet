# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Redis now runs on version 8 (development and production). Existing data
  is migrated, but switching back to Redis 7 is no longer possible
  afterwards. ([#72])
- `CHANGELOG.md` and `CONTRIBUTING.md` are now in English.

## [1.1.0] - 2026-11-15

### Added

- On every pull request to `develop` and `main`, CI now also checks the
  TypeScript types (`bun run check-types`) and builds all apps
  (`bun run build`). New script `bun run format:check`. ([#57])
- Release PR workflow: a new PR to `main` with an empty description is
  automatically filled with `.github/release_pr_template.md` and the list of
  commits since the last release. The version is taken from the PR title
  (e.g. `v1.1.0`). ([#57])
- Every Monday, Dependabot opens PRs to `develop` for Bun packages,
  GitHub Actions, the Dockerfile base images and the images in the
  Compose files. ([#58])
- `CHANGELOG.md` and `CONTRIBUTING.md` with the rules for branches, commits,
  pull requests, CI and releases. ([#59])
- Script `bun lint:fix`, which fixes auto-fixable lint errors. ([#61])

### Changed

- `revert` has been added to `CONTRIBUTING.md` as a type for commits, PR
  titles and branch names.
- The README is now in English, much shorter and loosely modeled on
  ghostlyjs: a system diagram, a table of all `.env` variables for
  development and production, and compact guides for both environments.
  ([#67])
- New animated logo: a scoreboard in yellow and navy with a blinking colon.
  Users who have enabled "reduce motion" in their system settings see a
  static logo. The header now shows the logo with wordmark in both light and
  dark mode, and logos are displayed in their actual aspect ratio. ([#66])
- Database indexes on `session.userId`, `account.userId` and
  `verification.identifier`, as recommended by better-auth. This speeds up
  login, session lookups and verification codes. The migration runs
  automatically on the next start and does not change any data. ([#65])
- The system diagram in `docs/architecture` now also shows the rank module.
  ([#60])
- oxlint now also uses the `unicorn`, `oxc` and `import` plugins, and
  `bun lint:fix` removes unused imports. oxfmt sorts imports into groups
  (Node, packages, `@repo/` and `@/`, relative paths) separated by blank
  lines. ([#61])
- VS Code formats all files with oxc instead of formatting TypeScript and
  JSON with Prettier, matching what CI checks. ([#61])
- Updated all dependencies to their latest versions, including
  TypeScript 7, Next.js 16.4, React 19.3, better-auth 1.7, Prisma 7.10,
  BullMQ 6, ioredis 6, dotenv 18 and Bun 1.4.4. Elysia stays on 1.4 and
  therefore `elysia-rate-limit` on 4.6; Prisma 8 is still a release
  candidate. ([#62])

### Fixed

- The logo was missing on nested pages such as `/groups/[id]` because the
  image paths were relative instead of absolute. ([#64])
- On the account page, the password fields for changing the password and for
  deleting the account had the same ID, so clicking a label could focus the
  wrong field. ([#64])
- Fixed the warnings from the new React rules in oxlint 1.93. The selected
  season (season, tips, group) and the email verification dialog are now
  derived during render instead of being set in an effect. The image preview
  for profile and group pictures is created directly when the file is
  selected. ([#63])
- The email verification dialog no longer reopens after being closed when
  the session is reloaded. ([#63])
- Input in the password form and the account details is no longer reset
  when the session is reloaded (e.g. when switching back to the tab). ([#63])
- Tips on the tips page now lock at kick-off without reloading the page
  (checked every 30 seconds). ([#63])
- `bun run check-types` and `bun run build` wait for
  `@repo/database#generate`. Previously, packages such as `worker` and
  `treaty` ran in parallel and could not find the generated Prisma Client if
  it did not exist yet (e.g. in CI). ([#57])

### Removed

- MIT license (`LICENSE`) and the license section in the README. ([#57])
- Script `bun lint:turbo`, which never ran because of the circular
  dependency between `@repo/api` and `@repo/auth`. Linting is done with
  `bun lint`. ([#59])
- Prettier and `prettier-plugin-tailwindcss`. Formatting is done with oxfmt
  only. ([#61])

## [1.0.0] - 2026-10-30

First release of the prediction game platform for HSC 2000 Coburg.

### Added

#### Accounts and sign-in

- Sign-up and sign-in with email and password via Better Auth, with the
  logo and a custom theme on the auth pages. ([#10])
- Approval of new accounts: after sign-up, a review email is sent to
  `SIGNUP_REVIEW_MAIL_ADDRESS`. Its links lead to `/signup/review`, where
  the account can be approved or rejected with one click. Signing in is not
  possible until the account is approved. ([#49])
- Email verification, "forgot password" with a one-time code (OTP) and
  email delivery via Resend. ([#33], [#37], [#49])
- Two-factor authentication with an authenticator app, copyable backup
  codes and sign-in with a backup code. ([#15], [#16])
- Account settings: change name, email and password (with a password
  strength indicator), upload a profile picture and delete the account.
  ([#14], [#17], [#44])

#### Seasons, matches and tips

- Season page with a table of all matches in a season. ([#18], [#23])
- Tips page: submit and change tips for upcoming matches, with a chart of
  correct and incorrect tips per season. ([#19], [#24], [#27], [#36])
- Points per match based on the goal difference: 2 points for the exact
  difference (1 point each if several players get it). If nobody gets the
  difference, the closest tip gets 1 point (0.5 each in case of a tie).
  ([#29], [#49])
- Dashboard with your own points and rank logos. ([#28], [#29])

#### Groups

- Create groups with a group picture, and leave them. A group can be
  marked as a favorite. ([#20], [#24], [#25], [#30])
- Invite members: the invitation appears in the invited person's inbox and
  can be accepted there. ([#40])
- Group statistics with ranking, points per match and rank icons per
  season. The current season is preselected. ([#39])
- The group leader can edit the group's name, description and picture.
  ([#46])

#### Admin

- Admin area: create, edit and delete seasons and matches, and enter and
  later correct match results. All users get a notification, and their
  points are recalculated. ([#26], [#48], [#50])
- Script `bun db:admin <email>` grants the admin role, `--revoke` revokes
  it. ([#48])

#### Interface

- Navigation with logo, avatar and WebSocket connection indicator. ([#8],
  [#13], [#17], [#21], [#22])
- Inbox with real-time notifications, e.g. for group invitations and
  changed matches. All can be marked as read, and read ones can be deleted.
  ([#34])
- All pages are designed for smartphone and desktop. ([#38], [#43])
- Light and dark mode. ([#42])
- New logo and player image. ([#47])

#### Technology and operations

- Turborepo monorepo with Bun: Next.js frontend (`apps/web`) and
  Elysia API (`apps/api`). ([#2])
- Database with Prisma and SQLite (libSQL), including migrations. ([#6],
  [#52])
- Typed API client with Eden Treaty (`packages/treaty`) and a shared
  logger (`packages/logger`). ([#9])
- WebSocket connection between frontend and API. ([#11])
- File storage via MinIO / S3 with presigned URLs (`packages/bucket`) and
  API rate limiting (50 requests per minute per IP). ([#12])
- Background jobs: job queue via Redis (`packages/queue`), a worker
  (`packages/worker`) and pub/sub (`packages/pub-sub`), through which the
  worker sends results to clients over WebSocket. ([#32], [#34])
- API data is prefetched per route, and loading states use TanStack Query
  mutations. ([#31], [#35])
- Docker Compose for development (MinIO, Redis, worker) and for production
  (all services, migrations run automatically on start). ([#13], [#38],
  [#55])
- Seed script `bun db:seed` with demo data for local development. ([#42],
  [#48], [#49])
- Linting and formatting with oxlint and oxfmt, CI for pull requests and
  `CODEOWNERS`. ([#2], [#3], [#4], [#39], [#51])
- Packages come from the public npm registry. ([#45])
- README with guides for development and production, a system diagram and
  `.env.example` files. ([#8], [#53], [#55])

[Unreleased]: https://github.com/justintischendorf/hscbet/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/justintischendorf/hscbet/compare/v1.0.0...v1.1.0
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
[#61]: https://github.com/justintischendorf/hscbet/pull/61
[#62]: https://github.com/justintischendorf/hscbet/pull/62
[#63]: https://github.com/justintischendorf/hscbet/pull/63
[#64]: https://github.com/justintischendorf/hscbet/pull/64
[#65]: https://github.com/justintischendorf/hscbet/pull/65
[#66]: https://github.com/justintischendorf/hscbet/pull/66
[#67]: https://github.com/justintischendorf/hscbet/pull/67
[#72]: https://github.com/justintischendorf/hscbet/pull/72

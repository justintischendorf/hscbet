import cron, { Patterns } from "@elysia/cron";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { DefaultContext, rateLimit } from "elysia-rate-limit";

import { createLogger } from "@repo/logger";

import { contextPlugin } from "./context";
import { errorPlugin } from "./errors";
import { S3Service } from "./global/services/s3-service";
import { admin } from "./modules/admin";
import { authPlugin } from "./modules/auth";
import { group } from "./modules/group";
import { mail } from "./modules/mail";
import { media } from "./modules/media";
import { notification } from "./modules/notification";
import { rank } from "./modules/rank";
import { season } from "./modules/season";
import { socket } from "./modules/socket";
import { tip } from "./modules/tip";

const logger = createLogger("api");

const app = new Elysia({ prefix: "/api" })
  .use(contextPlugin)
  .use(
    cors({
      origin: process.env.WEB_SERVER_URL?.replace(/\/$/, ""),
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  )
  .use(
    rateLimit({
      duration: 60_000,
      max: 300,
      context: new (class extends DefaultContext {
        private blocked = new WeakSet<object>();
        override async increment(
          key: string,
          duration?: number,
          requestTime?: number,
        ) {
          const item = await super.increment(key, duration, requestTime);
          if (item.count > 300 && !this.blocked.has(item)) {
            this.blocked.add(item);
            item.nextReset = new Date((requestTime ?? Date.now()) + 2 * 60_000);
          }
          return item;
        }
      })(),
      countFailedRequest: true,
      generator: (request, server) => {
        const forwardedFor = request.headers.get("x-forwarded-for");
        if (forwardedFor) {
          return forwardedFor.split(",").pop()?.trim() || "unknown";
        }
        const ip = server?.requestIP(request)?.address;
        return ip || "unknown";
      },
      errorResponse: new Response(
        JSON.stringify({
          success: false,
          message: "Zu viele Anfragen, bitte warte einen Moment.",
          error: "RATE_LIMITED",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      ),
    }),
  )
  .derive({ as: "global" }, () => ({
    requestStart: Date.now(),
  }))
  .onAfterResponse(({ request, set, requestStart, responseValue }) => {
    const url = new URL(request.url);
    const path = `${url.pathname}${url.search}`;
    const duration = requestStart
      ? ` duration=${Date.now() - requestStart}ms`
      : "";
    const status =
      responseValue instanceof Response ? responseValue.status : set.status;
    logger.info(`${request.method} ${path} status=${status ?? 200}${duration}`);
  })
  .use(
    cron({
      name: "s3-cleanup",
      pattern: Patterns.EVERY_10_MINUTES,
      async run() {
        const { s3Manager } = app.store;
        await S3Service.cleanup({ s3Manager });
      },
    }),
  )
  .use(errorPlugin)
  .use(authPlugin)
  .use(admin)
  .use(socket)
  .use(media)
  .use(rank)
  .use(tip)
  .use(mail)
  .use(group)
  .use(season)
  .use(notification)

  .listen(process.env.API_SERVER_PORT || 3001);

logger.info(`🦊 Elysia läuft auf http://localhost:${app.server?.port}`);

export type App = typeof app;

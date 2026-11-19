import Elysia from "elysia";

import { createLogger } from "@repo/logger";

const logger = createLogger("error");

export const errorPlugin = new Elysia({ name: "error" }).onError(
  { as: "global" },
  ({ code, error, set }) => {
    if (error instanceof Error && error.message === "DUPLICATE_TIP") {
      set.status = 409;
      logger.warn("DUPLICATE_TIP: Spieler hat bereits einen Tipp abgegeben");
      return {
        success: false,
        message: "Du hast für dieses Spiel bereits einen Tipp abgegeben",
        error: "DUPLICATE_TIP",
      };
    }

    if (error instanceof Error && error.message === "GAME_ALREADY_STARTED") {
      set.status = 409;
      logger.warn(
        "GAME_ALREADY_STARTED: Spieler versucht Tipp nach Spielbeginn abzugeben",
      );
      return {
        success: false,
        message:
          "Das Spiel hat bereits begonnen, dein Tipp kann nicht mehr geändert werden.",
        error: "GAME_ALREADY_STARTED",
      };
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      set.status = 401;
      logger.warn("UNAUTHORIZED: Spieler nicht autorisiert");
      return {
        success: false,
        message: "Nicht autorisiert",
        error: "UNAUTHORIZED",
      };
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      set.status = 403;
      logger.warn("FORBIDDEN: Spieler hat keine Berechtigung für diese Aktion");
      return {
        success: false,
        message: "Du hast keine Berechtigung für diese Aktion",
        error: "FORBIDDEN",
      };
    }

    if (error instanceof Error && error.message === "INVALID_SEASON_RANGE") {
      set.status = 422;
      logger.warn("INVALID_SEASON_RANGE: Ungültiger Saisonzeitraum");
      return {
        success: false,
        message: "Das Startdatum muss vor dem Enddatum liegen",
        error: "INVALID_SEASON_RANGE",
      };
    }

    if (error instanceof Error && error.message === "SEASON_NOT_FOUND") {
      set.status = 404;
      logger.warn("SEASON_NOT_FOUND: Saison nicht gefunden");
      return {
        success: false,
        message: "Saison nicht gefunden",
        error: "SEASON_NOT_FOUND",
      };
    }

    if (error instanceof Error && error.message === "SEASON_EXCLUDES_GAMES") {
      set.status = 422;
      logger.warn(
        "SEASON_EXCLUDES_GAMES: Saisonzeitraum schließt bestehende Spiele aus",
      );
      return {
        success: false,
        message:
          "Der Zeitraum muss alle Spiele der Saison enthalten. Verschiebe oder lösche diese Spiele zuerst.",
        error: "SEASON_EXCLUDES_GAMES",
      };
    }

    if (error instanceof Error && error.message === "GAME_NOT_FOUND") {
      set.status = 404;
      logger.warn("GAME_NOT_FOUND: Spiel nicht gefunden");
      return {
        success: false,
        message: "Spiel nicht gefunden",
        error: "GAME_NOT_FOUND",
      };
    }

    if (error instanceof Error && error.message === "GAME_OUTSIDE_SEASON") {
      set.status = 422;
      logger.warn(
        "GAME_OUTSIDE_SEASON: Spiel liegt außerhalb des Saisonzeitraums",
      );
      return {
        success: false,
        message: "Das Spiel muss innerhalb des Saisonzeitraums liegen",
        error: "GAME_OUTSIDE_SEASON",
      };
    }

    if (error instanceof Error && error.message === "INCOMPLETE_GAME_RESULT") {
      set.status = 422;
      logger.warn("INCOMPLETE_GAME_RESULT: Spielergebnis unvollständig");
      return {
        success: false,
        message: "Bitte trage die Tore beider Mannschaften ein",
        error: "INCOMPLETE_GAME_RESULT",
      };
    }

    if (error instanceof Error && error.message === "GROUP_NOT_FOUND") {
      set.status = 404;
      logger.warn("GROUP_NOT_FOUND: Gruppe nicht gefunden");
      return {
        success: false,
        message: "Gruppe nicht gefunden",
        error: "GROUP_NOT_FOUND",
      };
    }

    if (error instanceof Error && error.message === "NOT_GROUP_LEADER") {
      set.status = 403;
      logger.warn("NOT_GROUP_LEADER: Spieler ist kein Gruppenleiter");
      return {
        success: false,
        message: "Nur der Gruppenleiter kann diese Aktion ausführen",
        error: "NOT_GROUP_LEADER",
      };
    }

    if (error instanceof Error && error.message === "FILE_NOT_FOUND") {
      set.status = 404;
      logger.warn("FILE_NOT_FOUND: Datei nicht gefunden");
      return {
        success: false,
        message: "Bild nicht gefunden",
        error: "FILE_NOT_FOUND",
      };
    }

    if (error instanceof Error && error.message === "CANNOT_INVITE_SELF") {
      set.status = 422;
      logger.warn(
        "CANNOT_INVITE_SELF: Spieler versucht sich selbst einzuladen",
      );
      return {
        success: false,
        message: "Du kannst dich nicht selbst einladen",
        error: "CANNOT_INVITE_SELF",
      };
    }

    if (error instanceof Error && error.message === "ALREADY_GROUP_MEMBER") {
      set.status = 409;
      logger.warn(
        "ALREADY_GROUP_MEMBER: Spieler ist bereits Mitglied der Gruppe",
      );
      return {
        success: false,
        message: "Spieler ist bereits Mitglied der Gruppe",
        error: "ALREADY_GROUP_MEMBER",
      };
    }

    if (error instanceof Error && error.message === "GROUP_FULL") {
      set.status = 409;
      logger.warn("GROUP_FULL: Gruppe ist voll");
      return {
        success: false,
        message: "Die Gruppe hat die maximale Mitgliederzahl erreicht",
        error: "GROUP_FULL",
      };
    }

    if (error instanceof Error && error.message === "PLAYER_NOT_FOUND") {
      set.status = 404;
      logger.warn("PLAYER_NOT_FOUND: Spieler nicht gefunden");
      return {
        success: false,
        message: "Spieler nicht gefunden",
        error: "PLAYER_NOT_FOUND",
      };
    }

    if (error instanceof Error && error.message === "INVITE_NOT_FOUND") {
      set.status = 404;
      logger.warn("INVITE_NOT_FOUND: Einladung nicht gefunden");
      return {
        success: false,
        message: "Einladung nicht gefunden",
        error: "INVITE_NOT_FOUND",
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      logger.warn("NOT_FOUND: Ressource nicht gefunden");
      return {
        success: false,
        message: "Nicht gefunden",
        error: "NOT_FOUND",
      };
    }

    if (code === "PARSE") {
      set.status = 400;
      logger.warn("PARSE: Anfrage konnte nicht gelesen werden");
      return {
        success: false,
        message: "Die Anfrage konnte nicht gelesen werden",
        error: "PARSE_ERROR",
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      logger.warn("VALIDATION: Validierungsfehler in der Anfrage");
      return {
        success: false,
        message: "Validierungsfehler",
        error: "VALIDATION_ERROR",
      };
    }

    set.status = 500;
    logger.error(
      "INTERNAL_SERVER_ERROR: Ein unerwarteter Fehler ist aufgetreten",
      error,
    );
    return {
      success: false,
      message: "Ein Fehler ist aufgetreten",
      error: "INTERNAL_SERVER_ERROR",
    };
  },
);

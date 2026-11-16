"use client";

import { Ghost } from "ghostlyjs";
import { Fragment, useState } from "react";

import { CLUB, NewGamePopup } from "@/components/new-game-popup";
import { NewSeasonPopup } from "@/components/new-season-popup";
import {
  GameAdminActions,
  SeasonAdminActions,
} from "@/components/season-admin-actions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useSeasons } from "@/hooks/use-seasons";

export default function SeasonScreen() {
  const { data: seasonsResponse, isPending: isSeasonsPending } = useSeasons();
  const seasonsData = seasonsResponse?.data?.season;
  const seasonsList = seasonsData ?? [];
  const [pickedSeasonId, setPickedSeasonId] = useState<string>("");
  const isAdmin = useIsAdmin();

  const selectedSeasonId = seasonsList.some((s) => s.id === pickedSeasonId)
    ? pickedSeasonId
    : (seasonsList[0]?.id ?? "");

  const currentSeason = seasonsList.find((s) => s.id === selectedSeasonId);
  const selectedSeasonTitle = currentSeason?.title || "";
  const games = currentSeason?.game ?? [];

  return (
    <main className="w-full sm:py-16 py-8 px-4 md:px-12 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:gap-1">
          <Ghost name="season-league" isLoading={isSeasonsPending}>
            <span className="text-lg">{currentSeason?.league}</span>
          </Ghost>
          <div className="flex sm:flex-row flex-col sm:gap-2 gap-0 items-baseline">
            <Ghost name="season-title" isLoading={isSeasonsPending}>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentSeason?.title}
              </h1>
            </Ghost>
            <Ghost name="season-current" isLoading={isSeasonsPending}>
              <span className="text-muted-foreground sm:text-sm text-xs">
                {currentSeason
                  ? `${new Date(currentSeason.from).toLocaleDateString(
                      "de-DE",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )} - ${new Date(currentSeason.to).toLocaleDateString(
                      "de-DE",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}`
                  : ""}
              </span>
            </Ghost>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col items-end justify-between gap-4">
          <p className="text-base flex-1 min-w-0">
            Hier finden Sie Informationen zur aktuellen Saison wie auch zu
            vergangenen Saisons, einschließlich Spielpläne und Ergebnissen.
          </p>
          <div className="shrink-0 sm:w-auto w-full flex sm:flex-row flex-col gap-2">
            <NewGamePopup season={currentSeason} />
            <NewSeasonPopup />
          </div>
        </div>
        <Separator className="sm:my-8 my-6" />
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <Combobox
              items={seasonsList}
              disabled={isSeasonsPending}
              value={selectedSeasonId}
              onValueChange={(val) => setPickedSeasonId(val ?? "")}
            >
              <ComboboxInput
                className="flex-1"
                placeholder="Wähle eine Saison"
                value={isSeasonsPending ? "Laden..." : selectedSeasonTitle}
              />
              <ComboboxContent>
                <ComboboxEmpty>Keine Saison gefunden.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id}>
                      {item.title}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {isAdmin && currentSeason && (
              <SeasonAdminActions season={currentSeason} />
            )}
          </div>

          <div className="w-full">
            <Ghost name="season-table" isLoading={isSeasonsPending}>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell md:w-24 lg:w-30">
                      Spielzeit
                    </TableHead>
                    <TableHead className="text-right">Heimteam</TableHead>
                    <TableHead className="w-20 sm:w-24 text-center">
                      Ergebnis
                    </TableHead>
                    <TableHead className="text-left">Gastteam</TableHead>
                    {isAdmin && <TableHead className="w-10" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => {
                    const dateObj = new Date(game.date);
                    const dateStr = dateObj.toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                    const timeOnly =
                      dateObj.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) + " Uhr";

                    const isCoburgHome = game.host === CLUB;
                    const isCoburgAway = game.guest === CLUB;

                    const hasPlayed =
                      game.hostPoints !== null && game.guestPoints !== null;

                    return (
                      <Fragment key={game.id}>
                        <TableRow className="border-none hover:bg-transparent md:hidden">
                          <TableCell
                            colSpan={isAdmin ? 4 : 3}
                            className="pt-3 pb-0 text-center text-xs text-muted-foreground"
                          >
                            {dateStr} · {timeOnly}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="hidden md:table-cell py-3">
                            <div className="text-sm font-medium">{dateStr}</div>
                            <div className="text-xs text-muted-foreground">
                              {timeOnly}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`truncate text-right py-3 text-xs sm:text-sm ${
                              isCoburgHome
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {game.host}
                          </TableCell>
                          <TableCell className="text-center font-bold tracking-wider py-3 px-1 sm:px-2 text-sm sm:text-base">
                            {hasPlayed
                              ? `${game.hostPoints} : ${game.guestPoints}`
                              : "- : -"}
                          </TableCell>
                          <TableCell
                            className={`truncate text-left py-3 text-xs sm:text-sm ${
                              isCoburgAway
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {game.guest}
                          </TableCell>
                          {isAdmin && currentSeason && (
                            <TableCell className="py-3 px-0 text-right">
                              <GameAdminActions
                                season={currentSeason}
                                game={game}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </Ghost>
          </div>
        </div>
      </div>
    </main>
  );
}

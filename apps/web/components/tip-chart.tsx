"use client";

import { Ghost } from "ghostlyjs";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useSeasonStats } from "@/hooks/use-season-stats";

const chartConfig = {
  correct: {
    label: "Richtig getippt",
    color: "#ffed00",
  },
  incorrect: {
    label: "Falsch getippt",
    color: "#d2e1e6",
  },
} satisfies ChartConfig;

export function TipChart() {
  const { data: statsResponse, isPending: isStatsPending } = useSeasonStats();

  useEffect(() => {
    if (statsResponse?.error) {
      toast.error(
        `${statsResponse.error.status}: ${statsResponse.error.value}`,
      );
    }
  }, [statsResponse?.error]);

  const NEWEST_SEASONS_TO_SHOW = 4;
  const chartData = (statsResponse?.data?.stats ?? []).slice(
    0,
    NEWEST_SEASONS_TO_SHOW,
  );

  function getSeasonTitle(seasonId: unknown): string {
    return (
      chartData.find((item) => item.seasonId === seasonId)?.title ??
      String(seasonId)
    );
  }

  return (
    <Ghost name="tip-chart" isLoading={isStatsPending}>
      <div className="flex flex-col gap-4 border border-border rounded-xl bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Tipp-Statistik</h2>
        <ChartContainer config={chartConfig} className="min-h-50 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="seasonId"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => getSeasonTitle(value).slice(7, 16)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => getSeasonTitle(value)}
                />
              }
            />
            <Bar dataKey="correct" fill="var(--color-correct)" radius={4} />
            <Bar dataKey="incorrect" fill="var(--color-incorrect)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </Ghost>
  );
}

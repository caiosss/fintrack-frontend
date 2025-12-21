"use client";

import { useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction } from "./TransactionsTable";

type CategoryTotalsInput = {
  name: string;
  type?: string;
  transactions?: Transaction[];
};

type ExpenseComparison = {
  currentTotal?: number;
  previousMonthTotal?: number;
  previousMonthChangePercent?: number | null;
  previousYearTotal?: number;
  previousYearChangePercent?: number | null;
};

interface ChartProps {
  title?: string;
  className?: string;
  categories?: CategoryTotalsInput[];
  month?: string;
  year?: string;
  expenseComparison?: ExpenseComparison | null;
}

const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfigBase = {
  value: {
    label: "Gastos (R$)",
  },
} satisfies ChartConfig;

export function Chart({ 
  title = "Gastos por categoria", 
  className = "",
  categories = [],
  month = "",
  year = "",
  expenseComparison = null,
}: ChartProps) {
  const chartData = useMemo(() => {
    return categories
      .filter((category) => {
        const normalizedType = category.type?.toUpperCase();
        return normalizedType === "EXPENSE" || normalizedType === "INVESTMENT" || normalizedType === "INVESTIMENT";
      })
      .map((category, index) => {
        const total = (category.transactions ?? []).reduce((sum, transaction) => {
          const amount = Number(transaction.amount);
          return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        return {
          category: category.name,
          value: total,
          fill: chartPalette[index % chartPalette.length],
        };
      })
      .filter((item) => item.value !== 0);
  }, [categories]);

  const chartConfig = useMemo(
    () =>
      chartData.reduce<ChartConfig>(
        (acc, item) => {
          acc[item.category] = { label: item.category };
          return acc;
        },
        { ...chartConfigBase }
      ),
    [chartData]
  );

  const totalGastos = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const comparison = expenseComparison ?? {};
  const previousMonthTotal = Number(comparison.previousMonthTotal ?? 0);
  const previousYearTotal = Number(comparison.previousYearTotal ?? 0);
  const monthChangePercent = comparison.previousMonthChangePercent;
  const yearChangePercent = comparison.previousYearChangePercent;
  const hasMonthChange = typeof monthChangePercent === "number";
  const hasYearChange = typeof yearChangePercent === "number";
  const MonthTrendIcon = hasMonthChange
    ? monthChangePercent >= 0
      ? TrendingUp
      : TrendingDown
    : null;
  const monthChangeSign = hasMonthChange && monthChangePercent >= 0 ? "+" : "";
  const yearChangeSign = hasYearChange && yearChangePercent >= 0 ? "+" : "";

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatPercent = (value: number) =>
    `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;

  const monthComparisonText = hasMonthChange
    ? `Mês anterior: ${formatCurrency(previousMonthTotal)} (${monthChangeSign}${formatPercent(monthChangePercent)})`
    : `Mês anterior: ${formatCurrency(previousMonthTotal)}`;
  const yearComparisonText = hasYearChange
    ? `Ano anterior: ${formatCurrency(previousYearTotal)} (${yearChangeSign}${formatPercent(yearChangePercent)})`
    : `Ano anterior: ${formatCurrency(previousYearTotal)}`;
  
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribuição de gastos - {month} {year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend content={<ChartLegendContent nameKey="category" />} />
          </PieChart>
        </ChartContainer>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              R$ {totalGastos.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-muted-foreground">
              Total
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {monthComparisonText}
          {MonthTrendIcon ? <MonthTrendIcon className="h-4 w-4" /> : null}
        </div>
        <div className="text-muted-foreground leading-none">
          {yearComparisonText}
        </div>
      </CardFooter>
    </Card>
  );
}



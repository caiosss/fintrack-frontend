"use client";

import { TrendingUp } from "lucide-react";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartProps {
  title?: string;
  className?: string;
}

const chartData = [
  { category: "alimentacao", value: 1250, fill: "var(--color-alimentacao)" },
  { category: "transporte", value: 800, fill: "var(--color-transporte)" },
  { category: "moradia", value: 2100, fill: "var(--color-moradia)" },
  { category: "lazer", value: 650, fill: "var(--color-lazer)" },
  { category: "saude", value: 430, fill: "var(--color-saude)" },
  { category: "educacao", value: 350, fill: "var(--color-educacao)" },
];

const chartConfig = {
  value: {
    label: "Gastos (R$)",
  },
  alimentacao: {
    label: "Alimentação",
    color: "blue",
  },
  transporte: {
    label: "Transporte",
    color: "purple",
  },
  moradia: {
    label: "Moradia",
    color: "green",
  },
  lazer: {
    label: "Lazer",
    color: "orange",
  },
  saude: {
    label: "Saúde",
    color: "red",
  },
  educacao: {
    label: "Educação",
    color: "yellow",
  },
} satisfies ChartConfig;

export function Chart({ 
  title = "Gastos por Categoria", 
  className = "" 
}: ChartProps) {
  const totalGastos = chartData.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribuição de gastos - Novembro 2025</CardDescription>
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
          Gastos aumentaram 8.5% este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando gastos das principais categorias
        </div>
      </CardFooter>
    </Card>
  );
}
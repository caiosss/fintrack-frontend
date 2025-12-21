"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "./TransactionsTable";

type CategorySummaryInput = {
  type?: string;
  transactions?: Transaction[];
};

interface FinancialSummaryProps {
  salary?: number;
  categories?: CategorySummaryInput[];
  className?: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const sumTransactions = (transactions?: Transaction[]) =>
  (transactions ?? []).reduce((sum, transaction) => {
    const amount = Number(transaction.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

const normalizeType = (type?: string) => type?.toUpperCase();

const isExpenseType = (type?: string) => {
  const normalized = normalizeType(type);
  return normalized === "EXPENSE" || normalized === "INVESTMENT" || normalized === "INVESTIMENT";
};

const isIncomeType = (type?: string) => normalizeType(type) === "INCOME";

export function FinancialSummary({
  salary = 0,
  categories = [],
  className = "",
}: FinancialSummaryProps) {
  const baseSalary = Number.isFinite(salary) ? salary : 0;
  let expenseTotal = 0;
  let incomeTotal = 0;

  categories.forEach((category) => {
    const total = sumTransactions(category.transactions);

    if (isIncomeType(category.type)) {
      incomeTotal += total;
      return;
    }

    if (isExpenseType(category.type)) {
      expenseTotal += total;
    }
  });

  const netTotal = baseSalary + incomeTotal - expenseTotal;
  const netClassName = netTotal >= 0 ? "text-emerald-600" : "text-red-500";

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Resumo financeiro</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            Salario
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(baseSalary)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            Receitas
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(incomeTotal)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            Gastos
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(expenseTotal)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            Saldo
          </p>
          <p className={`text-lg font-semibold ${netClassName}`}>
            {formatCurrency(netTotal)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

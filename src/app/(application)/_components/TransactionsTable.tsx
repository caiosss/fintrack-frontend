"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type ColumnDef<T> = {
  accessorKey: keyof T | string;
  header: string;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
};

export type Transaction = {
  id?: string | number;
  amount: number;
  description?: string | null;
  date: string;
  createdAt?: string;
  categoryId?: string | number;
  userId?: string | number;
};

export type NewTransactionInput = {
  description?: string;
  amount: number;
  date: string;
};

type TransactionFormState = Omit<NewTransactionInput, "amount"> & {
  amount: string;
};

const getTodayDateValue = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Modelo de pagamento",
    cell: ({ row }) => {
      const { description } = row.original;
      return (
        <div className="text-sm font-medium">
          {description?.trim() || "Sem modelo de pagamento"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const { amount } = row.original;
      const formatted = typeof amount === "number"
        ? amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "R$ 0,00";

      return (
        <span className={amount >= 0 ? "text-emerald-600" : "text-red-500"}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const { date } = row.original;
      const formatted = date
        ? new Date(date).toLocaleDateString("pt-BR")
        : "-";

      return <span className="text-sm">{formatted}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const formatted = createdAt
        ? new Date(createdAt).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "-";

      return <span className="text-xs text-muted-foreground">{formatted}</span>;
    },
  },
];

type TransactionsTableProps = {
  transactions?: Transaction[];
  columns?: ColumnDef<Transaction>[];
  onAddTransaction?: (payload: NewTransactionInput) => Promise<void> | void;
};

export function TransactionsTable({
  transactions = [],
  columns = transactionColumns,
  onAddTransaction,
}: TransactionsTableProps) {
  const [form, setForm] = useState<TransactionFormState>({
    description: "",
    amount: "",
    date: getTodayDateValue(),
  });
  const [submitting, setSubmitting] = useState(false);

  const rows = useMemo(() => transactions ?? [], [transactions]);
  const total = useMemo(
    () =>
      rows.reduce((sum, transaction) => {
        const value = Number(transaction.amount);
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0),
    [rows]
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const tableCellClass = "whitespace-normal sm:whitespace-nowrap";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onAddTransaction) return;

    setSubmitting(true);
    try {
      await onAddTransaction({
        description: form.description?.trim(),
        amount: Number(form.amount) || 0,
        date: form.date,
      });

      setForm((prev) => ({
        ...prev,
        description: "",
        amount: "",
      }));
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {onAddTransaction && (
        <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Débito, Crédito, Pix..."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="sm:col-span-2 lg:col-span-2"
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
          <Button type="submit" disabled={submitting} className="sm:col-span-2 lg:col-span-4">
            {submitting ? "Salvando..." : "Adicionar transação"}
          </Button>
        </form>
      )}

      <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-lg overflow-hidden bg-slate-50/80 dark:bg-slate-950/60 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)} className={tableCellClass}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className={`${tableCellClass} text-center text-sm text-muted-foreground`}>
                  Nenhuma transação cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((transaction) => (
                <TableRow key={transaction.id ?? `${transaction.date}-${transaction.amount}`}>
                  {columns.map((column) => {
                    const value = (transaction as Record<string, unknown>)[
                      column.accessorKey as string
                    ];

                    return (
                      <TableCell key={String(column.accessorKey)} className={tableCellClass}>
                        {(column.cell
                          ? column.cell({ row: { original: transaction } })
                          : (value ?? "-")) as React.ReactNode}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length - 1} className={`${tableCellClass} text-right font-semibold text-sm`}>
                Total
              </TableCell>
              <TableCell className={`${tableCellClass} font-semibold text-emerald-600`}>
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
          <TableCaption>Transações da categoria</TableCaption>
        </Table>
      </div>
    </div>
  );
}

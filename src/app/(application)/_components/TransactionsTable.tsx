"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import api from "@/lib/api";

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

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("pt-BR") : "-";

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "-";

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
      const numericAmount = typeof amount === "number" ? amount : Number(amount) || 0;
      const formatted = formatCurrency(numericAmount);

      return (
        <span className={numericAmount >= 0 ? "text-emerald-600" : "text-red-500"}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const formatted = formatDate(row.original.date);
      return <span className="text-sm">{formatted}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const formatted = formatDateTime(row.original.createdAt);
      return <span className="text-xs text-muted-foreground">{formatted}</span>;
    },
  },
];

type TransactionsTableProps = {
  transactions?: Transaction[];
  columns?: ColumnDef<Transaction>[];
  onAddTransaction?: (payload: NewTransactionInput) => Promise<void> | void;
  onDeleteTransaction?: (transactionId: string | number) => void;
};

export function TransactionsTable({
  transactions = [],
  columns = transactionColumns,
  onAddTransaction,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const [form, setForm] = useState<TransactionFormState>({
    description: "",
    amount: "",
    date: getTodayDateValue(),
  });
  const [submitting, setSubmitting] = useState(false);

  const [localRows, setLocalRows] = useState<Transaction[]>(transactions ?? []);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    setLocalRows(transactions ?? []);
  }, [transactions]);

  const rows = localRows;
  const total = useMemo(
    () =>
      rows.reduce((sum, transaction) => {
        const value = Number(transaction.amount);
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0),
    [rows]
  );

  const tableCellClass = "whitespace-normal sm:whitespace-nowrap";
  const hasRows = rows.length > 0;
  const showActions = Boolean(onDeleteTransaction);
  const columnCount = columns.length + (showActions ? 1 : 0);

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

  const handleDeleteTransaction = async (transactionId?: string | number) => {
    if (!transactionId) return;
    setDeletingId(transactionId);
    try {
      await api.delete(`/transaction/${transactionId}`);
      setLocalRows((prev) => prev.filter((transaction) => transaction.id !== transactionId));
      onDeleteTransaction?.(transactionId);
    } catch (error) {
      console.error("Erro ao deletar transaÇõÇœo:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {onAddTransaction && (
        <form className="grid gap-3 min-w-0 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
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
            className="min-w-0"
          />
          <Button type="submit" disabled={submitting} className="sm:col-span-2 lg:col-span-4">
            {submitting ? "Salvando..." : "Adicionar transação"}
          </Button>
        </form>
      )}

      <div className="space-y-3 sm:hidden">
        {hasRows ? (
          rows.map((transaction) => {
            const amount = Number(transaction.amount) || 0;
            const amountClass = amount >= 0 ? "text-emerald-600" : "text-red-500";
            const description = transaction.description?.trim() || "Sem modelo de pagamento";

            return (
              <div
                key={transaction.id ?? `${transaction.date}-${transaction.amount}`}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Modelo de pagamento</p>
                    <p className="text-sm font-semibold text-foreground">{description}</p>
                  </div>
                  <span className={`text-base font-semibold ${amountClass}`}>
                    {formatCurrency(amount)}
                  </span>
                </div>
                <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-medium text-foreground">Data</dt>
                    <dd>{formatDate(transaction.date)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-medium text-foreground">Criado em</dt>
                    <dd>{formatDateTime(transaction.createdAt)}</dd>
                  </div>
                </dl>
                {showActions ? (
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      disabled={!transaction.id || deletingId === transaction.id}
                      data-card-action="true"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === transaction.id ? "Deletando..." : "Deletar"}
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300/70 p-4 text-center text-sm text-muted-foreground">
            Nenhuma transação cadastrada.
          </div>
        )}
        <p className="text-center text-xs text-muted-foreground">Transações da categoria</p>
      </div>

      <div className="hidden sm:block">
        <div className="overflow-x-auto rounded-lg border border-slate-200/80 bg-slate-50/80 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/60">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.accessorKey)} className={tableCellClass}>
                    {column.header}
                  </TableHead>
                ))}
                {showActions ? (
                  <TableHead className={`${tableCellClass} text-right`}>Acoes</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnCount} className={`${tableCellClass} text-center text-sm text-muted-foreground`}>
                    Nenhuma transação cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((transaction) => {
                  const isDeleting = deletingId === transaction.id;

                  return (
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
                      {showActions ? (
                        <TableCell className={`${tableCellClass} text-right`}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            disabled={!transaction.id || isDeleting}
                            aria-label="Deletar transacao"
                            data-card-action="true"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })
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
                {showActions ? <TableCell className={tableCellClass} /> : null}
              </TableRow>
            </TableFooter>
            <TableCaption>Transações da categoria</TableCaption>
          </Table>
        </div>
      </div>
    </div>
  );
}

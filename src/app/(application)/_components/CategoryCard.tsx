"use client";

import type { MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { NewTransactionInput, Transaction, TransactionsTable, transactionColumns } from "./TransactionsTable";

interface CategoryCardProps {
  title?: string;
  isAddCard?: boolean;
  onClick?: () => void;
  categoryId?: string | number;
  transactions?: Transaction[];
  onAddTransaction?: (categoryId: string | number, payload: NewTransactionInput) => Promise<void> | void;
}

export function CategoryCard({ 
  title, 
  isAddCard = false, 
  onClick,
  categoryId,
  transactions = [],
  onAddTransaction,
}: CategoryCardProps) {
  if (isAddCard) {
    return (
      <Card 
        className="
          min-h-[120px] 
          border-2 
          border-dashed 
          border-gray-300 
          dark:border-gray-600 
          bg-transparent 
          hover:border-blue-400 
          dark:hover:border-blue-400 
          hover:shadow-lg 
          hover:shadow-blue-400/25 
          dark:hover:shadow-blue-400/25 
          transition-all 
          duration-300 
          cursor-pointer 
          group 
          flex 
          items-center 
          justify-center
        "
        onClick={onClick}
      >
        <div className="text-center">
          <Plus 
            className="
              w-8 
              h-8 
              mx-auto 
              mb-2 
              text-gray-400 
              group-hover:text-blue-400 
              transition-colors 
              duration-300
            " 
          />
          <span 
            className="
              text-sm 
              font-medium 
              text-gray-500 
              group-hover:text-blue-400 
              transition-colors 
              duration-300
            "
          >
            Criar categoria
          </span>
        </div>
      </Card>
    );
  }

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("form")) return;
    onClick?.();
  };

  const handleAddTransaction = async (payload: NewTransactionInput) => {
    if (!categoryId || !onAddTransaction) return;
    await onAddTransaction(categoryId, payload);
  };

  return (
    <Card 
      className="
        min-h-[220px]
        sm:min-h-[260px]
        border 
        border-slate-200/80 
        dark:border-slate-800 
        bg-gradient-to-b 
        from-white 
        via-slate-50 
        to-slate-100 
        dark:from-slate-900 
        dark:via-slate-950 
        dark:to-slate-950 
        shadow-sm 
        hover:shadow-md 
        transition-all 
        duration-200 
        cursor-pointer 
        group 
        flex 
        items-stretch 
      "
      onClick={handleCardClick}
    >
      <div className="p-4 sm:p-5 space-y-4 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Categoria</p>
            <h3 
              className="
                text-lg 
                sm:text-xl 
                font-semibold 
                text-slate-900 
                dark:text-slate-100 
                group-hover:text-blue-600 
                dark:group-hover:text-blue-400 
                transition-colors 
                duration-200
              "
            >
              {title}
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1 self-start sm:self-auto">
            {transactions.length} transações
          </span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <TransactionsTable
          transactions={transactions}
          columns={transactionColumns}
          onAddTransaction={handleAddTransaction}
        />
        </div>
      </div>
    </Card>
  );
}

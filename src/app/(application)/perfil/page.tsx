"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useAuth from "@/app/hooks/useAuth";
import { CategoryCard } from "../_components/CategoryCard";
import { Chart } from "../_components/Chart";
import { FinancialSummary } from "../_components/FinancialSummary";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CreateCategoryModal from "@/components/actions/create-category";
import EditCategoryModal from "@/components/actions/edit-category";
import api from "@/lib/api";
import { NewTransactionInput, Transaction } from "../_components/TransactionsTable";
import { useQueryClient } from "@tanstack/react-query";

type CategoryType = "INCOME" | "EXPENSE" | "INVESTMENT" | "INVESTIMENT";

type ExpenseComparison = {
    currentTotal?: number;
    previousMonthTotal?: number;
    previousMonthChangePercent?: number | null;
    previousYearTotal?: number;
    previousYearChangePercent?: number | null;
};

type Category = {
    id: string | number;
    name: string;
    type?: CategoryType;
    userId?: string | number;
    transactions?: Transaction[];
};

export default function PerfilPage() {
    const { user, loading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenseComparison, setExpenseComparison] = useState<ExpenseComparison | null>(null);
    const [salary, setSalary] = useState<number>();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const queryClient = useQueryClient();

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [openCategoryModal, setOpenCategoryModal] = useState(false);

    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const handleCreateCategory = () => {
        setOpenCategoryModal(true);
    };

    const handleCategoryClick = (category: Category) => {
        setEditingCategory(category);
        setOpenEditCategoryModal(true);
    };

    const handleEditCategoryClose = () => {
        setOpenEditCategoryModal(false);
        setEditingCategory(null);
    };

    const handleCategoryUpdated = (updatedCategory: Category) => {
        setCategories((prev) =>
            prev.map((category) => {
                if (category.id !== updatedCategory.id) {
                    return category;
                }
                return {
                    ...category,
                    ...updatedCategory,
                    transactions: updatedCategory.transactions ?? category.transactions,
                };
            })
        );
    };

    const handleFilterDate = (month: number, year: number) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const handleAddTransaction = async (categoryId: string | number, payload: NewTransactionInput) => {
        if (!user?.sub) return;

        try {
            const dto = {
                ...payload,
            };

            const response = await api.post(`/transaction/${user?.sub}/${categoryId}`, dto);
            const created = response.data;

            setCategories((prev) =>
                prev.map((category) =>
                    category.id === categoryId
                        ? {
                            ...category,
                            transactions: [...(category.transactions ?? []), created],
                          }
                        : category
                )
            );
        } catch (error) {
            console.error("Erro ao criar transação:", error);
        }
    };

    useEffect(() => {
        if (loading || !user?.sub) return;

        const fetchCategories = async () => {
            try {
                const data = await queryClient.fetchQuery<{
                    categories: Category[];
                    expenseComparison?: ExpenseComparison | null;
                }>({
                    queryKey: ["categories-filter", user.sub, selectedMonth, selectedYear],
                    queryFn: async () => {
                        const response = await api.get(
                            `/category/filter/${user.sub}/${selectedMonth}/${selectedYear}`
                        );
                        const payload = response.data;
                        if (Array.isArray(payload)) {
                            return { categories: payload };
                        }
                        if (Array.isArray(payload?.categories)) {
                            return {
                                categories: payload.categories,
                                expenseComparison: payload.expenseComparison ?? null,
                            };
                        }
                        if (Array.isArray(payload?.data)) {
                            return { categories: payload.data };
                        }
                        return { categories: [] };
                    },
                });

                setCategories(data.categories);
                setExpenseComparison(data.expenseComparison ?? null);
            } catch (error) {
                console.error("Erro ao filtrar categorias:", error);
            }
        };

        void fetchCategories();
    }, [loading, queryClient, user?.sub, selectedMonth, selectedYear]);

    return (
        <main className="p-6 space-y-6">
            <div className="flex gap-6 flex-1">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-4xl">
                            Boas vindas, {user?.name}!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="salary-input">Salário</Label>
                            <Input id="salary-input" type="number" placeholder="Seu salário atual" onChange={(e) => setSalary(Number(e.target.value))} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>
                            Filtro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="month-select" className="text-sm font-medium mb-2 block">
                                    Mês
                                </Label>
                                <Select
                                    value={selectedMonth.toString()}
                                    onValueChange={(value) => handleFilterDate(Number(value), selectedYear)}
                                >
                                    <SelectTrigger id="month-select" className="w-full">
                                        <SelectValue placeholder="Selecione o mês" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month.value} value={month.value.toString()}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1">
                                <Label htmlFor="year-select" className="text-sm font-medium mb-2 block">
                                    Ano
                                </Label>
                                <Select
                                    value={selectedYear.toString()}
                                    onValueChange={(value) => handleFilterDate(selectedMonth, Number(value))}
                                >
                                    <SelectTrigger id="year-select" className="w-full">
                                        <SelectValue placeholder="Selecione o ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialSummary salary={salary} categories={categories} />
                <Chart className="lg:col-span-1" categories={categories} expenseComparison={expenseComparison} month={months.find(m => m.value === selectedMonth)?.label} year={selectedYear.toString()} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Categorias
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id ?? category.name}
                            title={category.name}
                            categoryId={category.id}
                            transactions={category.transactions ?? []}
                            onAddTransaction={handleAddTransaction}
                            onClick={() => handleCategoryClick(category)}
                        />
                    ))}

                    <CategoryCard
                        isAddCard={true}
                        onClick={handleCreateCategory}
                    />

                    <CreateCategoryModal
                        open={openCategoryModal}
                        onOpenChange={setOpenCategoryModal}
                        onClose={() => setOpenCategoryModal(false)}
                    />

                    <EditCategoryModal
                        open={openEditCategoryModal}
                        onOpenChange={setOpenEditCategoryModal}
                        onClose={handleEditCategoryClose}
                        category={editingCategory}
                        onUpdated={handleCategoryUpdated}
                    />
                </div>
            </div>
        </main>
    );
}

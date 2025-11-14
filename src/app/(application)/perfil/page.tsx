"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useAuth from "@/app/hooks/useAuth";
import { CategoryCard } from "../_components/CategoryCard";
import { Chart } from "../_components/Chart";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PerfilPage() {
    const { user } = useAuth();
    const [categories] = useState<string[]>([
        // Exemplo de categorias existentes - pode ser removido quando conectar com API
    ]);
    const [salary, setSalary] = useState<number>();

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

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
        // TODO: Abrir modal para criar nova categoria
        console.log("Abrir modal para criar categoria");
    };

    const handleCategoryClick = (categoryName: string) => {
        // TODO: Abrir modal para editar categoria
        console.log("Editar categoria:", categoryName);
    };

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
        console.log("Filtrar por mês:", month);
        // TODO: Implementar filtro por mês
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        console.log("Filtrar por ano:", year);
        // TODO: Implementar filtro por ano
    };

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
                                    onValueChange={(value) => handleMonthChange(Number(value))}
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
                                    onValueChange={(value) => handleYearChange(Number(value))}
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

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Chart className="lg:row-span-2" />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Categorias
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={index}
                            title={category}
                            onClick={() => handleCategoryClick(category)}
                        />
                    ))}

                    <CategoryCard
                        isAddCard={true}
                        onClick={handleCreateCategory}
                    />
                    <CategoryCard
                        isAddCard={true}
                        onClick={handleCreateCategory}
                    />
                    <CategoryCard
                        isAddCard={true}
                        onClick={handleCreateCategory}
                    />
                    <CategoryCard
                        isAddCard={true}
                        onClick={handleCreateCategory}
                    />
                </div>
            </div>
        </main>
    );
}


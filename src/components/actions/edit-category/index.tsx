"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

type CategoryType = "INCOME" | "EXPENSE" | "INVESTMENT" | "INVESTIMENT";

type CategoryInput = {
  id: string | number;
  name: string;
  type?: CategoryType;
};

interface EditCategoryModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  category?: CategoryInput | null;
  onUpdated?: (category: CategoryInput) => void;
}

const editCategorySchema = z.object({
  name: z.string().min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  type: z.enum(["INCOME", "EXPENSE", "INVESTMENT"]),
});

type EditCategoryData = z.infer<typeof editCategorySchema>;

const categoryTypeOptions = [
  { value: "INCOME", label: "Receita" },
  { value: "EXPENSE", label: "Despesa" },
  { value: "INVESTMENT", label: "Investimento" },
];

const normalizeCategoryType = (type?: CategoryType): EditCategoryData["type"] => {
  if (type === "INVESTIMENT") return "INVESTMENT";
  if (type === "INCOME" || type === "EXPENSE" || type === "INVESTMENT") {
    return type;
  }
  return "EXPENSE";
};

export default function EditCategoryModal({
  open,
  onOpenChange,
  onClose,
  category,
  onUpdated,
}: EditCategoryModalProps) {
  const form = useForm<EditCategoryData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: category?.name ?? "",
      type: normalizeCategoryType(category?.type),
    });
  }, [category, form, open]);

  const onSubmit = async (data: EditCategoryData) => {
    if (!category?.id) return;

    try {
      const response = await api.patch(`/category/${category.id}`, {
        name: data.name,
        type: data.type,
      });
      const updated = response.data ?? { ...category, ...data };
      onUpdated?.(updated);
      onOpenChange?.(false);
      onClose?.();
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentacao" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                Voltar
              </Button>
              <Button type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

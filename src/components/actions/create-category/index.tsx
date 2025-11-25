import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"
import useAuth from "@/app/hooks/useAuth"

interface CreateCategoryModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const createCategorySchema = z.object({
  name: z.string().min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  type: z.enum(["INCOME", "EXPENSE", "INVESTMENT"]),
})

type CreateCategoryData = z.infer<typeof createCategorySchema>;

export default function CreateCategoryModal({ open, onOpenChange, onClose }: CreateCategoryModalProps) {

  const categoryTypeOptions = [
    { value: "INCOME", label: "Receita" },
    { value: "EXPENSE", label: "Despesa" },
    { value: "INVESTMENT", label: "Investimento" },
  ]

  const { user } = useAuth();

  const form = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE"
    }
  })

  const onSubmit = async (data: CreateCategoryData) => {
    try {
        const dto = {
            name: data.name,
            type: data.type
        }
        
        const response = await api.post(`/category/${user?.sub}`, dto);

        if (response.status === 201) {
            setTimeout(() => {
                form.reset();
                onClose?.();
        }, 1000)    
        }

    } catch (error) {
        console.error("Erro ao criar categoria:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar categoria</DialogTitle>
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
                    <Input placeholder="Ex: Alimentação" {...field} />
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
              <Button variant="outline" type="button" onClick={onClose}>
                Voltar
              </Button>

              <Button type="submit">
                Criar
              </Button>
            </DialogFooter>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

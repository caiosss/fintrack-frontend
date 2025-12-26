"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const cadastroSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    userName: z.string().min(1, "O nome de usuário é obrigatório"),
})

type CadastroData = z.infer<typeof cadastroSchema>

export default function RegisterPage() {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<CadastroData>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: { email: "", password: "", userName: "" },
    })

    function onSubmit(data: CadastroData) {
        setLoading(true);
        
        const dto = {
            email: data.email,
            password: data.password,
            name: data.userName,
        }

        api.post("/user", dto)

        setTimeout(() => {
            window.location.href = "/login"
        }, 1000);
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">

            <Card className="w-full max-w-md bg-white/90 dark:bg-black/10 backdrop-blur-xl border border-gray-200/40 dark:border-input/40">
                <CardHeader>
                    <CardTitle>Criar Conta</CardTitle>
                    <CardDescription>
                        Crie uma nova conta para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="seu@exemplo.com"
                                                {...field}
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome de Usuário</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="@seunome"
                                                {...field}
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                    aria-busy={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                            Carregando...
                                        </span>
                                    ) : (
                                        "Cadastrar"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground px-6">
                    Já tem uma conta? <Link href="/login" className="text-primary underline ml-2">Entrar</Link>
                </CardFooter>
            </Card>
        </main>
    );
}
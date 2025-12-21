"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import api from "@/lib/api"
import { useState } from "react"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
})

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(data: LoginData) {
        const dto = {
            email: data.email,
            password: data.password,
        }
        try {
            setLoading(true);
            const response = await api.post("/auth/login", dto);

            console.log("Login response:", response);
            setTimeout(() => {
                router.push("/perfil");
            }, 1000);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-white/90 dark:bg-black/10 backdrop-blur-xl border border-gray-200/40 dark:border-input/40">
                <CardHeader>
                    <CardTitle>Entrar</CardTitle>
                    <CardDescription>
                        Faça login na sua conta para continuar.
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
                                    disabled={loading}
                                    type="submit"
                                    className="w-full"
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
                                        "Entrar"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground px-6">
                    Novo por aqui? <Link href="/cadastrar" className="text-primary underline ml-2">Criar conta</Link>
                </CardFooter>
            </Card>
        </main>
    )
}

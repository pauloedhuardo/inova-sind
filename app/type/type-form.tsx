"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { createTypeAction } from "@/app/actions/create-type"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["PRODUCT", "SERVICE"], { message: "Tipo é obrigatório" }),
})

type FormValues = z.infer<typeof formSchema>

const typeOptions = [
  { label: "Produto", value: "PRODUCT" },
  { label: "Serviço", value: "SERVICE" },
] as const

export function TypeForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", type: undefined },
  })

  async function onSubmit(values: FormValues) {
    const result = await createTypeAction(values)
    if (result?.error) {
      form.setError("root", { message: result.error })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Tipo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do tipo" {...field} />
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
                  <FormLabel>Tipo *</FormLabel>
                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo">
                          {(value: string | null) =>
                            value ? (typeOptions.find((o) => o.value === value)?.label ?? value) : null
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-destructive text-sm font-medium">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
            <Link href="/">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

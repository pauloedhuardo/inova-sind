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
import type { GetTypeProductService200Item } from "@/app/_lib/api/fetch-generated"

import { createAndLinkServiceAction } from "@/app/actions/link-organization"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  typeId: z.string().min(1, "Tipo é obrigatório"),
})

type FormValues = z.infer<typeof formSchema>

interface ServiceLinkFormProps {
  organizationId: string
  types: GetTypeProductService200Item[]
}

export function ServiceLinkForm({ organizationId, types }: ServiceLinkFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", typeId: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await createAndLinkServiceAction(organizationId, values)
    if (result?.error) {
      form.setError("root", { message: result.error })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo serviço</CardTitle>
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
                    <Input placeholder="Nome do serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Descreva o serviço"
                      rows={4}
                      className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tipo">
                          {(value: string | null) =>
                            value ? (types.find((t) => t.id === value)?.name ?? value) : null
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id} label={type.name}>
                          {type.name}
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
              {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar e vincular"}
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

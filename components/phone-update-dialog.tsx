"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { updateUserPhoneAction } from "@/app/actions/update-user-phone"

const formSchema = z.object({
  phone: z.string().refine(
    (v) => v.replace(/\D/g, "").length === 11,
    "Telefone deve ter 11 dígitos",
  ),
})

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

type FormValues = z.infer<typeof formSchema>

interface PhoneUpdateDialogProps {
  userId: string
  phoneVerified: boolean
}

export function PhoneUpdateDialog({ userId, phoneVerified }: PhoneUpdateDialogProps) {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await updateUserPhoneAction(userId, values.phone.replace(/\D/g, ""))
    if (result?.error) {
      form.setError("root", { message: result.error })
      return
    }
    router.refresh()
  }

  return (
    <Dialog open={!phoneVerified} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Atualizar telefone</DialogTitle>
          <DialogDescription>
            Informe seu telefone para continuar
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Atualizar telefone</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone para contato</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={field.value}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
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
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useRef, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Slider } from "@/components/ui/slider"
import type { GetOrganizations200Item } from "@/app/_lib/api/fetch-generated"

import { createAssessmentAction } from "@/app/_lib/actions/create-assessment"

const formSchema = z.object({
  organizationId: z.string().min(1, "Selecione uma organização"),
  assessmentScore: z.number().min(1).max(10),
  assessmentComments: z.string().min(1, "Comentário é obrigatório"),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  organizations: GetOrganizations200Item[]
  organizationId?: string
}

export function AssessmentForm({ organizations, organizationId }: Props) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<GetOrganizations200Item | null>(null)
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: organizationId ?? "",
      assessmentScore: 5,
      assessmentComments: "",
    },
  })

  const watchedScore = form.watch("assessmentScore")
  const watchedOrgId = form.watch("organizationId")

  const filtered = query
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(query.toLowerCase()),
      )
    : organizations

  function handleSelect(org: GetOrganizations200Item) {
    form.setValue("organizationId", org.id, { shouldValidate: true })
    setQuery(org.name)
    setSelectedOrg(org)
    setOpen(false)
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await createAssessmentAction(values.organizationId, {
        assessmentScore: values.assessmentScore,
        assessmentComments: values.assessmentComments,
      })
      if (result?.error) {
        form.setError("root", { message: result.error })
      }
    })
  }

  return (
    <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!organizationId && (
                <>
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={() => (
                      <FormItem>
                        <FormLabel>Organização</FormLabel>
                        <FormControl>
                          <div className="relative" ref={containerRef}>
                            <Input
                              placeholder="Buscar organização..."
                              value={query}
                              onChange={(e) => {
                                setQuery(e.target.value)
                                form.setValue("organizationId", "")
                                setSelectedOrg(null)
                                setOpen(true)
                              }}
                              onFocus={() => setOpen(true)}
                              onBlur={() => setOpen(false)}
                              autoComplete="off"
                            />
                            {open && (
                              <ul
                                className="bg-popover text-popover-foreground ring-border absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md py-1 text-sm ring-1 shadow-md"
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                {filtered.length > 0 ? (
                                  filtered.map((org) => (
                                    <li
                                      key={org.id}
                                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2"
                                      onClick={() => handleSelect(org)}
                                    >
                                      {org.name}
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted-foreground px-3 py-2">
                                    Nenhuma organização encontrada
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedOrg && (
                    <div className="space-y-1 text-sm">
                      <div className="flex flex-row">
                        <span className="text-muted-foreground font-semibold">
                          Empresa/prestador:
                        </span>
                        <span className="pl-1 font-semibold">{selectedOrg.name}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {(organizationId || watchedOrgId) && (
                <>
                  <FormField
                    control={form.control}
                    name="assessmentScore"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Avaliação</FormLabel>
                          <span className="text-muted-foreground text-sm font-medium">
                            {watchedScore}/10
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            value={[field.value]}
                            onValueChange={(values) =>
                              field.onChange(Array.isArray(values) ? values[0] : values)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assessmentComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentário</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={3}
                            placeholder="Descreva sua avaliação..."
                            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="w-full bg-primary text-primary-foreground"
                    disabled={isPending}
                  >
                    {isPending ? "Enviando..." : "Enviar avaliação"}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
  </Card>
  )
}

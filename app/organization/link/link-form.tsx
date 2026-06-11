"use client"

import { useRef, useState, useTransition } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { linkProductAction, linkServiceAction } from "@/app/actions/link-organization"

interface Item {
  id: string
  name: string
}

interface LinkFormProps {
  products: Item[]
  services: Item[]
  organizationId: string
}

export function LinkForm({ products, services, organizationId }: LinkFormProps) {
  const [selectedType, setSelectedType] = useState<"product" | "service" | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const items = selectedType === "product" ? products : services
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  )

  const createHref = `/organization/link?organizationId=${organizationId}&type=${selectedType}&mode=create`

  function handleTypeChange(value: string) {
    setSelectedType(value as "product" | "service")
    setSelectedId(null)
    setQuery("")
    setOpen(false)
    setError(null)
  }

  function handleSelect(item: Item) {
    setSelectedId(item.id)
    setQuery(item.name)
    setOpen(false)
  }

  function handleLink() {
    if (!selectedId || !selectedType) return
    setError(null)
    startTransition(async () => {
      const result =
        selectedType === "product"
          ? await linkProductAction(organizationId, selectedId)
          : await linkServiceAction(organizationId, selectedId)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Vincular produto ou serviço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedType ?? ""} onValueChange={handleTypeChange}>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="product" />
              Produto
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="service" />
              Serviço
            </label>
          </div>
        </RadioGroup>

        {selectedType && (
          <div className="space-y-3">
            <div className="relative" ref={containerRef}>
              <Input
                placeholder={`Buscar ${selectedType === "product" ? "produto" : "serviço"}...`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedId(null)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                autoComplete="off"
              />
              {open && filtered.length > 0 && (
                <ul className="bg-popover text-popover-foreground ring-border absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md py-1 text-sm ring-1 shadow-md">
                  {filtered.map((item) => (
                    <li
                      key={item.id}
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelect(item)
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href={createHref}>
              <Button type="button" variant="outline" className="w-full">
                Cadastrar novo {selectedType === "product" ? "produto" : "serviço"}
              </Button>
            </Link>

            {selectedId && (
              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground"
                disabled={isPending}
                onClick={handleLink}
              >
                {isPending ? "Vinculando..." : "Vincular"}
              </Button>
            )}

            {error && (
              <p className="text-destructive text-sm font-medium">{error}</p>
            )}
          </div>
        )}
        <Link href="/">
          <Button type="button" variant="outline" className="w-full">
            Cancelar
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

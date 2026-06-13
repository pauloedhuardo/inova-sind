"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button, buttonVariants } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { cn } from "@/lib/utils"
import { handleLogout } from "@/app/_lib/auth-client"

export interface NavLink {
  href: string
  label: string
}

export function HeaderClient({ links }: { links: NavLink[] }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <Card>
        <CardContent className="flex items-center justify-between px-4 py-2 md:justify-center">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Image
              src="/logo.png"
              alt="Inova Sind"
              width={80}
              height={28}
              className="object-contain shrink-0"
            />
            <div className="min-w-0">
              <h1 className="truncate font-bold text-xl leading-tight">Inova Sind</h1>
              <p className="text-xs text-muted-foreground font-bold">
                Informações para síndicos
              </p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </CardContent>
      </Card>

      {menuOpen && (
        <nav className="mt-2 mb-4 flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(buttonVariants({ variant: "default" }), "w-full justify-start")}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
            Sair
          </Button>
        </nav>
      )}

      <nav className="mt-4 mb-6 hidden flex-wrap justify-center gap-2 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={buttonVariants({ variant: "default" })}
          >
            {link.label}
          </Link>
        ))}
        <Button variant="destructive" onClick={handleLogout}>
          Sair
        </Button>
      </nav>
    </header>
  )
}

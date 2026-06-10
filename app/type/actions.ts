"use server"

import { redirect } from "next/navigation"

import { createTypeProductService } from "@/app/_lib/api/fetch-generated"

type CreateTypeBody = {
  name: string
  type: "PRODUCT" | "SERVICE"
}

export async function createTypeAction(data: CreateTypeBody) {
  const response = await createTypeProductService(
    data as Parameters<typeof createTypeProductService>[0],
  )

  if (response.status === 201) {
    redirect("/")
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar tipo" }
}

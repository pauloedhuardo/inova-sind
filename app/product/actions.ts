"use server"

import { redirect } from "next/navigation"

import {
  createProduct,
  type CreateProductBody,
} from "@/app/_lib/api/fetch-generated"

export async function createProductAction(data: CreateProductBody) {
  const date = new Date().toISOString().split("T")[0]
  const response = await createProduct(date, data)

  if (response.status === 200) {
    redirect("/")
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar produto" }
}

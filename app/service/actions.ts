"use server"

import { redirect } from "next/navigation"

import {
  createService,
  type CreateServiceBody,
} from "@/app/_lib/api/fetch-generated"

export async function createServiceAction(data: CreateServiceBody) {
  const response = await createService(data)

  if (response.status === 201) {
    redirect("/")
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar serviço" }
}

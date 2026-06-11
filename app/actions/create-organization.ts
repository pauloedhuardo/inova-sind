"use server"

import { redirect } from "next/navigation"

import {
  createOrganization,
  type CreateOrganizationBody,
} from "@/app/_lib/api/fetch-generated"

export async function createOrganizationAction(data: CreateOrganizationBody) {
  const response = await createOrganization(data)

  if (response.status === 201) {
    redirect(`/organization/link?organizationId=${response.data.id}`)
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar organização" }
}

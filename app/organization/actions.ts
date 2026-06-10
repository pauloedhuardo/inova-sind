"use server"

import { redirect } from "next/navigation"

import {
  createOrganization,
  type CreateOrganizationBody,
} from "@/app/_lib/api/fetch-generated"

export async function createOrganizationAction(data: CreateOrganizationBody) {
  const response = await createOrganization(data)

  if (response.status === 201) {
    const org = response.data
    const params = new URLSearchParams({
      organizationId: org.id,
      name: org.name,
      phone: org.phone,
    })
    if (org.cnpj) params.set("cnpj", org.cnpj)
    if (org.address) params.set("address", org.address)
    if (org.email) params.set("email", org.email)
    if (org.contact) params.set("contact", org.contact)
    redirect(`/organization/link?${params.toString()}`)
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar organização" }
}

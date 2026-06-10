"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { authClient } from "@/app/_lib/auth-client"
import {
  createOrganizationProduct,
  createOrganizationService,
  createProduct,
  createService,
  type CreateProductBody,
  type CreateServiceBody,
} from "@/app/_lib/api/fetch-generated"

async function getUser() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  })
  return session.data?.user?.id ?? ""
}

export async function linkProductAction(organizationId: string, productId: string) {
  const user = await getUser()
  const response = await createOrganizationProduct({ organizationId, productId, user })

  if (response.status === 201) {
    redirect(`/assessment?id=${organizationId}`)
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao vincular produto" }
}

export async function linkServiceAction(organizationId: string, serviceId: string) {
  const user = await getUser()
  const response = await createOrganizationService({ organizationId, serviceId, user })

  if (response.status === 201) {
    redirect(`/assessment?id=${organizationId}`)
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao vincular serviço" }
}

export async function createAndLinkProductAction(
  organizationId: string,
  data: CreateProductBody,
) {
  const user = await getUser()
  const date = new Date().toISOString().split("T")[0]
  const productResponse = await createProduct(date, data)

  if (productResponse.status !== 200) {
    const errorData = productResponse.data as { error: string }
    return { error: errorData.error ?? "Erro ao cadastrar produto" }
  }

  const linkResponse = await createOrganizationProduct({
    organizationId,
    productId: productResponse.data.id,
    user,
  })

  if (linkResponse.status === 201) {
    redirect(`/assessment?id=${organizationId}`)
  }

  const errorData = linkResponse.data as { error: string }
  return { error: errorData.error ?? "Erro ao vincular produto" }
}

export async function createAndLinkServiceAction(
  organizationId: string,
  data: CreateServiceBody,
) {
  const user = await getUser()
  const serviceResponse = await createService(data)

  if (serviceResponse.status !== 201) {
    const errorData = serviceResponse.data as { error: string }
    return { error: errorData.error ?? "Erro ao cadastrar serviço" }
  }

  const linkResponse = await createOrganizationService({
    organizationId,
    serviceId: serviceResponse.data.id,
    user,
  })

  if (linkResponse.status === 201) {
    redirect(`/assessment?id=${organizationId}`)
  }

  const errorData = linkResponse.data as { error: string }
  return { error: errorData.error ?? "Erro ao vincular serviço" }
}

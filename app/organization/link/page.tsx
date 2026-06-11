import { redirect } from "next/navigation"

import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getOrganization,
  getProducts,
  getServices,
  getTypeProductService,
  type GetProducts200Item,
  type GetServices200Item,
  type GetTypeProductService200Item,
} from "@/app/_lib/api/fetch-generated"

import { LinkForm } from "./link-form"
import { ProductLinkForm } from "./product-link-form"
import { ServiceLinkForm } from "./service-link-form"

interface SearchParams {
  organizationId?: string
  type?: string
  mode?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function OrganizationLinkPage({ searchParams }: PageProps) {
  const { organizationId = "", type, mode } = await searchParams

  if (!organizationId) redirect("/")

  const date = new Date().toISOString().split("T")[0]
  const [orgResponse, productsResponse, servicesResponse, typesResponse] = await Promise.all([
    getOrganization(organizationId),
    getProducts(),
    getServices(date),
    getTypeProductService(),
  ])

  if (orgResponse.status !== 200) redirect("/")
  const org = orgResponse.data

  const products: GetProducts200Item[] =
    productsResponse.status === 200 ? productsResponse.data : []
  const services: GetServices200Item[] =
    servicesResponse.status === 200 ? servicesResponse.data : []
  const types: GetTypeProductService200Item[] =
    typesResponse.status === 200 ? typesResponse.data : []

  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="mx-auto w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa/Prestador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex flex-row">
              <span className="text-muted-foreground font-semibold">Empresa/prestador:</span>
              <span className="font-semibold pl-1">{org.name}</span>
            </div>
            {org.cnpj && (
              <div className="flex flex-row">
                <span className="text-muted-foreground font-semibold">CNPJ:</span>
                <span className="font-semibold pl-1">{org.cnpj}</span>
              </div>
            )}
            {org.address && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Endereço:</span>
                <span className="font-semibold pl-1">{org.address}</span>
              </div>
            )}
            {org.phone && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Telefone:</span>
                <span className="font-semibold pl-1">{org.phone}</span>
              </div>
            )}
            {org.email && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold pl-1">{org.email}</span>
              </div>
            )}
            {org.contact && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Contato:</span>
                <span className="font-semibold pl-1">{org.contact}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {mode === "create" && type === "product" ? (
          <ProductLinkForm organizationId={organizationId} types={types} />
        ) : mode === "create" && type === "service" ? (
          <ServiceLinkForm organizationId={organizationId} types={types} />
        ) : (
          <LinkForm products={products} services={services} organizationId={organizationId} />
        )}
      </div>
    </div>
  )
}

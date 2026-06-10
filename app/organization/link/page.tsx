import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
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
  name?: string
  cnpj?: string
  address?: string
  phone?: string
  email?: string
  contact?: string
  type?: string
  mode?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function OrganizationLinkPage({ searchParams }: PageProps) {
  const params = await searchParams
  const {
    organizationId = "",
    name = "",
    cnpj,
    address,
    phone = "",
    email = "",
    contact,
    type,
    mode,
  } = params

  const date = new Date().toISOString().split("T")[0]
  const [productsResponse, servicesResponse, typesResponse] = await Promise.all([
    getProducts(),
    getServices(date),
    getTypeProductService(),
  ])

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
              <span className="text-muted-foreground font-semibold">Empresa/prestador:</span>{" "}
              <h1 className="font-semibold pl-1">{name}</h1>
            </div>
            {cnpj && (
              <div className="flex flex-row">
                <span className="text-muted-foreground font-semibold">CNPJ:</span>
                <h1 className="font-semibold pl-1">{cnpj}</h1>
              </div>
            )}
            {address && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Endereço:</span>
                <h1 className="font-semibold pl-1">{address}</h1>
              </div>
            )}
            {phone && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Telefone:</span>
                <h1 className="font-semibold pl-1">{phone}</h1>
              </div>
            )}
            {email && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Email:</span>
                <h1 className="font-semibold pl-1">{contact}</h1>
              </div>
            )}
            {contact && (
              <div className="flex flex-row">
                <span className="text-muted-foreground">Contato:</span>
                <h1 className="font-semibold pl-1">{contact}</h1>
              </div>
            )}
          </CardContent>
        </Card>

        {mode === "create" && type === "product" ? (
          <ProductLinkForm organizationId={organizationId} types={types} />
        ) : mode === "create" && type === "service" ? (
          <ServiceLinkForm organizationId={organizationId} types={types} />
        ) : (
          <LinkForm
            products={products}
            services={services}
            organizationId={organizationId}
            name={name}
            cnpj={cnpj}
            address={address}
            phone={phone}
            email={email}
            contact={contact}
          />
        )}
      </div>
    </div>
  )
}

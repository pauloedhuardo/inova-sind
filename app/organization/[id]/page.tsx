import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { authClient } from "@/app/_lib/auth-client"
import { getOrganization } from "@/app/_lib/api/fetch-generated"
import { formatPhone } from "@/lib/utils"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  })
  if (!session.data?.user) redirect("/auth")

  const { id } = await params
  const response = await getOrganization(id)
  if (response.status !== 200) redirect("/")
  const org = response.data

  return (
    <div className="flex flex-col p-4 sm:p-6">
      <Header />
      <div className="mx-auto w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{org.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {org.cnpj && (
              <p>
                <span className="font-semibold">CNPJ:</span> {org.cnpj}
              </p>
            )}
            <p>
              <span className="font-semibold">Telefone:</span> {formatPhone(org.phone)}
            </p>
            {org.address && (
              <p>
                <span className="font-semibold">Endereço:</span> {org.address}
              </p>
            )}
            {org.email && (
              <p>
                <span className="font-semibold">E-mail:</span> {org.email}
              </p>
            )}
            {org.contact && (
              <p>
                <span className="font-semibold">Contato:</span> {org.contact}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-col gap-3 mb-6 sm:flex-row">
          <Button className="w-full sm:w-auto" variant="secondary">
            <Link href={`/assessment?idOrganization=${org.id}`}>Avaliar</Link>
          </Button>
          <Link href={`/organization/link?IdOrganization=${org.id}`}>Vincular Serviço ou Produto</Link>
          <Button className="w-full sm:w-auto" variant="secondary">
          </Button>
        </div>

        <Tabs defaultValue="services">
          <TabsList>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4 pt-4">
            {org.services.map((service, i) => (
              <div key={i}>
                <p className="font-semibold">{service.name}</p>
                <p>{service.description}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4 pt-4">
            {org.products.map((product, i) => (
              <div key={i}>
                <p className="font-semibold">{product.name}</p>
                {product.description && <p>{product.description}</p>}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4 pt-4">
            {org.assessments.map((assessment, i) => (
              <div key={i}>
                <div className="flex flex-row gap-2 items-center">
                  <p className="font-semibold">
                    <Avatar>
                      <AvatarImage src={assessment.user.image || undefined} alt={assessment.user.name} />
                    </Avatar>
                  </p>
                  <p className="font-semibold">
                    {assessment.user.name}
                  </p>
                </div>
                <div className="mt-4">
                  <Badge
                    className="top-6 left-2 space-x-2"
                    variant="secondary"
                  >
                    <StarIcon size={12} className="fill-primary text-primary" />
                    <p className="text-xs font-semibold">{assessment.assessmentScore}</p>
                  </Badge>
                </div>
                <div className="mt-4">
                  {assessment.assessmentComments && (
                    <p>{assessment.assessmentComments}</p>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

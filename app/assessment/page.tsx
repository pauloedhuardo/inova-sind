import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getOrganizations,
  type GetOrganizations200Item,
} from "@/app/_lib/api/fetch-generated"

import { AssessmentForm } from "./assessment-form"

interface SearchParams {
  id?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function AssessmentPage({ searchParams }: PageProps) {
  const { id } = await searchParams

  const orgsResponse = await getOrganizations()
  const organizations: GetOrganizations200Item[] =
    orgsResponse.status === 200 ? orgsResponse.data : []

  const selectedOrg = id ? organizations.find((o) => o.id === id) : undefined

  return (
    <div className="flex flex-col p-4 sm:p-6">
      <Header />
      <div className="mx-auto w-full max-w-md space-y-4">
        {selectedOrg && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da organização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Empresa/prestador:</span>{" "}
                {selectedOrg.name}
              </p>
            </CardContent>
          </Card>
        )}

        <AssessmentForm organizations={organizations} organizationId={id} />
      </div>
    </div>
  )
}

import { headers } from "next/headers"
import { authClient } from "./_lib/auth-client"
import { redirect } from "next/navigation"
import Header from "@/components/header";
import { getOrganizations } from "./_lib/api/fetch-generated";
import OrganizationCard from "@/components/organizationCard";
import OrganizationSearch from "@/components/organizationSearch";
import Link from "next/link";
import { PhoneUpdateDialog } from "@/components/phone-update-dialog";

export default async function Home() {

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    },
  });

  if (!session.data?.user) redirect("/auth");

  const user = session.data.user as typeof session.data.user & { phoneVerified?: boolean }
  const phoneVerified = user.phoneVerified ?? false

  const organizationsResponse = await getOrganizations();
  const organizations = (organizationsResponse.status === 200 ? organizationsResponse.data : [])
    .sort((a, b) => {
      const scoreDiff = (b.averageScore ?? 0) - (a.averageScore ?? 0)
      return scoreDiff !== 0 ? scoreDiff : a.name.localeCompare(b.name, "pt-BR")
    })

  return (
    <div className="flex flex-col p-4 sm:p-6">
      <PhoneUpdateDialog userId={user.id} phoneVerified={phoneVerified} />
      <Header />
      <div className="mx-auto w-full max-w-md">
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase">
          Empresas recomendadas
        </h2>
        <div className="flex gap-3 [&::-webkit-scrollbar]:hidden">
          {organizations.map((org) => (
            <Link key={org.id} href={`/organization/${org.id}`}>
              <OrganizationCard organization={{ name: org.name, score: org.averageScore ?? 0 }} />
            </Link>
          ))}
        </div>
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase">
          Pesquisar por Empresas, produtos ou serviços
        </h2>
        <OrganizationSearch />
      </div>
    </div>
  )
}

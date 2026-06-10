import { headers } from "next/headers"
import { authClient } from "./_lib/auth-client"
import { redirect } from "next/navigation"
import Header from "@/components/header";

export default async function Home() {

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <>
      <Header />
      <div className="p-3">
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase">
          Empresas recomendadas
        </h2>

      </div>
    </>
  )
}

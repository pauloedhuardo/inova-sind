import Header from "@/components/header"
import {
  getTypeProductService,
  type GetTypeProductService200Item,
} from "@/app/_lib/api/fetch-generated"

import { ServiceForm } from "./service-form"

export default async function ServicePage() {
  const typesResponse = await getTypeProductService()
  const types: GetTypeProductService200Item[] =
    typesResponse.status === 200 ? typesResponse.data : []

  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="mx-auto w-full max-w-md">
        <ServiceForm types={types} />
      </div>
    </div>
  )
}

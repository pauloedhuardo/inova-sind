"use server"

import { getOrganizationsSearch, GetOrganizationsSearch200Item } from "@/app/_lib/api/fetch-generated"

export async function searchOrganizations(search: string): Promise<GetOrganizationsSearch200Item[]> {
  const response = await getOrganizationsSearch({ search })
  return response.status === 200 ? response.data : []
}

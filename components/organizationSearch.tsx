"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchOrganizations } from "@/app/actions/search-organizations"
import OrganizationCard from "@/components/organizationCard"
import Link from "next/link"
import { GetOrganizationsSearch200Item } from "@/app/_lib/api/fetch-generated"

export default function OrganizationSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GetOrganizationsSearch200Item[]>([])

  async function handleSearch() {
    if (!query.trim()) return
    const data = await searchOrganizations(query)
    setResults(
      [...data].sort((a, b) => {
        const scoreA = a.assessments.length > 0
          ? a.assessments.reduce((sum, x) => sum + x.assessmentScore, 0) / a.assessments.length
          : 0
        const scoreB = b.assessments.length > 0
          ? b.assessments.reduce((sum, x) => sum + x.assessmentScore, 0) / b.assessments.length
          : 0
        const scoreDiff = scoreB - scoreA
        return scoreDiff !== 0 ? scoreDiff : a.name.localeCompare(b.name, "pt-BR")
      }),
    )
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div>
      <div className="mt-2 flex gap-2">
        <Input
          placeholder="Empresa, produto ou serviço"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" onClick={handleSearch}>
          <SearchIcon size={16} />
        </Button>
      </div>
      {results.length > 0 && (
        <div className="mt-3 flex gap-3 [&::-webkit-scrollbar]:hidden">
          {results.map((org) => (
            <Link key={org.id} href={`/organization/${org.id}`}>
              <OrganizationCard
                organization={{
                  name: org.name,
                  score:
                    org.assessments.length > 0
                      ? org.assessments.reduce((sum, a) => sum + a.assessmentScore, 0) /
                      org.assessments.length
                      : 0,
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

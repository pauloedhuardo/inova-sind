"use server"

import { redirect } from "next/navigation"

import {
  createAssessment,
  type CreateAssessmentBody,
} from "@/app/_lib/api/fetch-generated"

export async function createAssessmentAction(
  organizationId: string,
  data: CreateAssessmentBody,
) {
  const response = await createAssessment(organizationId, data)

  if (response.status === 201) {
    redirect("/")
  }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao cadastrar avaliação" }
}

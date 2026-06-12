"use server"

import { updateUser } from "@/app/_lib/api/fetch-generated"

export async function updateUserPhoneAction(userId: string, phone: string) {
  const response = await updateUser(userId, { phone, phoneVerified: true })

  if (response.status === 200) return { success: true }

  const errorData = response.data as { error: string }
  return { error: errorData.error ?? "Erro ao atualizar telefone" }
}

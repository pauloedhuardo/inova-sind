import { createAuthClient } from "better-auth/react"
import { redirect } from "next/navigation";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/')
        },
      },
    })
  }
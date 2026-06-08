"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/app/_lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleIcon } from "@/components/icons/google-icon"

export default function AuthPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/")
    }
  }, [session, isPending, router])

  async function handleGoogleLogin() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_WEB_APP_URL,
    })

    if (error) {
      console.error(error.message)
    }
  }

  if (isPending || session) return null

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="2S Inovação e Tecnologia"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-xl">Bem-vindo</CardTitle>
          <CardDescription>
            Entre com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            variant="default"
            size="lg"
            className="w-full gap-3"
          >
            <GoogleIcon />
            Faça o login com o Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

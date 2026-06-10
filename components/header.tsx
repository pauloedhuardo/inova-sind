import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Image from "next/image"
import { Button } from "./ui/button";

const Header = async () => {

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        },
    });

    const user = session.data?.user as { typeOfUser?: string } | null | undefined
    const isAdmin = user?.typeOfUser === "ADMIN"

    return (
        <>
            <Card>
                <CardContent className="flex flex-row items-center justify-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Inova Sind"
                            width={120}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                    <div className="w-full justify-center">
                        <h1 className="font-bold text-3xl" >Inova Sind</h1>
                        <h1>Informações para síndicos</h1>
                    </div>

                </CardContent>
            </Card>
            <div className="mt-4 flex gap-3 justify-center mb-6">
                <Button className="gap-2" variant="default">
                    <Link href="/assessment">Avaliação</Link>
                </Button>
                <Button className="gap-2" variant="default">
                    <Link href="/organization">Empresa/Prestador</Link>
                </Button>
                {isAdmin && (
                    <>
                        <Button className="gap-2" variant="default">
                            <Link href="/product">Produto</Link>
                        </Button>
                        <Button className="gap-2" variant="default">
                            <Link href="/service">Serviço</Link>
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}

export default Header
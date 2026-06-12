import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { HeaderClient } from "./header-client";

const Header = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const user = session.data?.user as { typeOfUser?: string } | null | undefined;
  const isAdmin = user?.typeOfUser === "ADMIN";

  const links = [
    { href: "/", label: "Home" },
    { href: "/organization", label: "Empresa/Prestador" },
    ...(isAdmin
      ? [
          { href: "/assessment", label: "Avaliação" },
          { href: "/product", label: "Produto" },
          { href: "/service", label: "Serviço" },
          { href: "/type", label: "Tipos" },
        ]
      : []),
  ];

  return <HeaderClient links={links} />;
};

export default Header;

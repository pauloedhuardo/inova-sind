import Header from "@/components/header"
import { OrganizationForm } from "./organization-form"

export default function OrganizationPage() {
  return (
    <div className="flex flex-col p-4 sm:p-6">
      <Header />
      <div className="mx-auto w-full max-w-md">
        <OrganizationForm />
      </div>
    </div>
  )
}

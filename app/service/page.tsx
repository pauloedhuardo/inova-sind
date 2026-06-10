import Header from "@/components/header"
import { ServiceForm } from "./service-form"

export default function ServicePage() {
  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="mx-auto w-full max-w-md">
        <ServiceForm />
      </div>
    </div>
  )
}

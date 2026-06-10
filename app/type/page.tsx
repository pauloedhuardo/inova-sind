import Header from "@/components/header"

import { TypeForm } from "./type-form"

export default function TypePage() {
  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="mx-auto w-full max-w-md">
        <TypeForm />
      </div>
    </div>
  )
}

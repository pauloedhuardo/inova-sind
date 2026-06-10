import Header from "@/components/header"
import { ProductForm } from "./product-form"

export default function ProductPage() {
  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="mx-auto w-full max-w-md">
        <ProductForm />
      </div>
    </div>
  )
}

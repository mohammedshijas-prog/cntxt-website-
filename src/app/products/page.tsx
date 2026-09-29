import type { Metadata } from "next";
import { ProductPage } from "@/components/products/ProductPage";

export const metadata: Metadata = {
  title: "Build AI | CNTXT AI",
  description: "Build AI that survives contact with the real world.",
};

export default function Products() {
  return (
    <div>
      <ProductPage />
    </div>
  );
}

import type { Metadata } from "next";
import { ProductPage } from "@/components/products/ProductPage";

export const metadata: Metadata = {
  title: "AI Lab",
  alternates: { canonical: "/products" },
  description:
    "CNTXT AI Lab: the full stack in three layers: data captured and verified from real work, models trained on it, and agents deployed on-premises, hybrid or in the cloud.",
};

export default function Products() {
  return (
    <div>
      <ProductPage />
    </div>
  );
}

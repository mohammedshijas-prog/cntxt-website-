import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal />;
}

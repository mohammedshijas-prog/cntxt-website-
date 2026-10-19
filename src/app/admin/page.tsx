import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

// Both values are inlined at build time. Without them the portal cannot reach
// Supabase, so show a notice instead of failing the whole build.
const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminPage() {
  if (!configured) {
    return (
      <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: 24, fontFamily: "var(--font-body)" }}>
        <p>The portal is not configured for this deployment.</p>
      </main>
    );
  }
  return <AdminPortal />;
}

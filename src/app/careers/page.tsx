import type { Metadata } from "next";
import { CareersPage } from "@/components/careers/CareersPage";
import { openRoles } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Careers",
  alternates: { canonical: "/careers" },
  description: "Open roles at CNTXT AI: AI evaluators, coding experts, bilingual annotators and robotics data collectors. Remote and on-site options.",
};

// Roles are managed in the portal; refresh the list every minute.
export const revalidate = 60;

export default async function Careers() {
  const roles = await openRoles();
  return (
    <div>
      <CareersPage roles={roles.map(({ slug, title, department, location, terms }) => ({ slug, title, department, location, terms }))} />
    </div>
  );
}

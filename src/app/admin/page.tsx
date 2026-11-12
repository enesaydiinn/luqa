import type { Metadata } from "next";
import { AdminPanel } from "@/features/admin-panel";
export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin" },
};
export default function Admin() {
  return (
    <main id="main" className="admin-page section-pad">
      <AdminPanel />
    </main>
  );
}

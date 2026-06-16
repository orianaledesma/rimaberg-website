import type { Metadata } from "next";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Rima Berg — Admin",
  robots: { index: false, follow: false },
};

/** Top-level admin wrapper: loads the admin skin and keeps it out of search. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}

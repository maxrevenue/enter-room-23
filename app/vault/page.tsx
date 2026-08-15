import type { Metadata } from "next";
import AccessGate from "@/components/AccessGate";

export const metadata: Metadata = {
  title: "The Vault | Room 23",
  description:
    "Access to archival and limited-edition pieces is restricted to members. Request an invitation to the Inner Circle.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <AccessGate
      title="THE VAULT"
      description="Access to archival and limited-edition pieces is restricted to members. Request an invitation to the Inner Circle."
    />
  );
}

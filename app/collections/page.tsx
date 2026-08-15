import type { Metadata } from "next";
import AccessGate from "@/components/AccessGate";

export const metadata: Metadata = {
  title: "Curated Rituals | Room 23",
  description:
    "Our thematic collections are currently being refined. Request early access.",
  robots: { index: false, follow: false },
};

export default function CollectionsPage() {
  return (
    <AccessGate
      title="CURATED RITUALS"
      description="Our thematic collections are currently being refined. Request early access."
    />
  );
}

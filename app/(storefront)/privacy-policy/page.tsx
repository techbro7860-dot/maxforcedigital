import { PolicyPage } from "@/components/storefront/PolicyPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy | Maxforce Digital", description: "How Maxforce Digital collects, uses and protects personal information." };
export const dynamic = "force-dynamic";
export default function Page() { return <PolicyPage slug="privacy-policy" />; }

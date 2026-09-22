import { PolicyPage } from "@/components/storefront/PolicyPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Refund and Cancellation Policy | Maxforce Digital", description: "Refund and cancellation terms for Maxforce Digital products and services." };
export const dynamic = "force-dynamic";
export default function Page() { return <PolicyPage slug="refund-policy" />; }

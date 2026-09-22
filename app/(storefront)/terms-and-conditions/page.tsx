import { PolicyPage } from "@/components/storefront/PolicyPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms and Conditions | Maxforce Digital", description: "Terms governing use of Maxforce Digital's website, products and services." };
export const dynamic = "force-dynamic";
export default function Page() { return <PolicyPage slug="terms-and-conditions" />; }

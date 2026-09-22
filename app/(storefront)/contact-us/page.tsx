import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { ContactForm } from "@/components/storefront/ContactForm";

export const metadata: Metadata = { title: "Contact Us | Maxforce Digital" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();
  const activeServices = content.services.filter((item: any) => item.isActive);
  return <main className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[.8fr_1.2fr]">
    <section><p className="font-semibold text-primary">CONTACT US</p><h1 className="mt-3 text-4xl font-bold">{content.contact.title}</h1><p className="mt-5 leading-7 text-gray-600">{content.contact.intro}</p><dl className="mt-8 space-y-4 text-sm">{content.contact.email && <div><dt className="font-semibold">Email</dt><dd><a href={`mailto:${content.contact.email}`} className="text-primary">{content.contact.email}</a></dd></div>}{content.contact.phone && <div><dt className="font-semibold">Phone</dt><dd>{content.contact.phone}</dd></div>}{content.contact.address && <div><dt className="font-semibold">Address</dt><dd>{content.contact.address}</dd></div>}</dl></section>
    <ContactForm services={activeServices.map((item: any) => item.title)} />
  </main>;
}

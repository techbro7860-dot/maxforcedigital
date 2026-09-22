import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export default async function ServicePage({ params }: { params: { slug: string } }) {
  const { services } = await getSiteContent();
  const service = services.find((item: any) => item.slug === params.slug && item.isActive);
  if (!service) notFound();
  return <main className="mx-auto max-w-4xl px-5 py-16"><p className="font-semibold text-primary">OUR SERVICES</p><h1 className="mt-3 text-4xl font-bold">{service.title}</h1><p className="mt-5 text-xl text-gray-600">{service.summary}</p><div className="mt-10 whitespace-pre-line leading-8 text-gray-700">{service.body}</div>{service.features.length > 0 && <ul className="mt-10 grid gap-3 sm:grid-cols-2">{service.features.map((feature: string) => <li key={feature} className="rounded-lg bg-gray-50 p-4">✓ {feature}</li>)}</ul>}</main>;
}

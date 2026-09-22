import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getServerUser } from "@/lib/middleware/getServerUser";
import { Entitlement } from "@/models";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");
  await connectDB();
  const entitlements = await Entitlement.find({ user: user.id, isActive: true, revokedAt: null })
    .populate("product", "title slug images isActive")
    .sort({ grantedAt: -1 })
    .lean();

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="text-3xl font-bold">My Library</h1>
      <p className="mt-2 text-muted">Your purchased courses and eBooks.</p>
      {entitlements.length === 0 ? (
        <div className="mt-8 rounded-lg border p-8 text-center">
          <p className="text-muted">You do not have any digital purchases yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-primary underline">Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entitlements.map((item: any) => (
            <article key={String(item._id)} className="rounded-lg border p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.productType}</p>
              <h2 className="mt-2 text-lg font-semibold">{item.productTitle}</h2>
              <a
                href={`/api/account/entitlements/${item._id}/access`}
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {item.deliveryMode === "secure_download" ? "Download" : "Open course"}
              </a>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

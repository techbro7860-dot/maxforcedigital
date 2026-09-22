import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import { ProductRail } from "@/components/storefront/ProductRail";
import { getSiteSettings } from "@/lib/site-settings";
import { storefrontAppearance } from "@/components/storefront/appearance";
import {
  BenefitsSection, BlogPreviewSection, FaqSection, HeroBanner,
  IndustriesSection, NewsletterSection, PackagesSection, PartnersSection,
  ServicesTeaser, TestimonialsSection,
} from "@/components/storefront/home/MaxforceHomeSections";

export const dynamic = "force-dynamic";
const fields = "title slug price discountPrice images category tags";
const plain = (value: unknown) => JSON.parse(JSON.stringify(value));
export default async function HomePage() {
  await connectDB();
  const settings = storefrontAppearance(await getSiteSettings());
  const categories = await Category.find({ isActive: true }).select("_id slug").lean();
  const courseCategory = categories.find(c => c.slug === "courses");
  const ebookCategory = categories.find(c => c.slug === "digital-e-book");
  const [courses, ebooks] = await Promise.all([
    Product.find({ isActive: true, ...(courseCategory ? { category: courseCategory._id } : { isFeatured: true }) }).select(fields).populate("category", "name slug").limit(8).lean(),
    ebookCategory ? Product.find({ isActive: true, category: ebookCategory._id }).select(fields).populate("category", "name slug").limit(12).lean() : [],
  ]);
  return <main className="store-home bg-background">
    <HeroBanner />
    <BenefitsSection />
    <ProductRail heading="Digital Courses" subheading="Learn practical, career-ready skills at your own pace." products={plain(courses)} currency={settings.commerce.currencySymbol} viewAllHref="/shop?category=courses" />
    <IndustriesSection />
    <ProductRail heading="eBooks & Digital Resources" subheading="Guides, templates and tools you can use immediately." products={plain(ebooks)} currency={settings.commerce.currencySymbol} viewAllHref="/shop?category=digital-e-book" />
    <PartnersSection />
    <ServicesTeaser />
    <PackagesSection />
    <TestimonialsSection />
    <BlogPreviewSection />
    <FaqSection />
    <NewsletterSection />
  </main>;
}

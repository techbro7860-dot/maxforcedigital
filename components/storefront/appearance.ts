import type { SiteSettingsData } from "@/lib/site-settings";
import { LIGHT_THEME, isLegacyDarkTheme } from "@/lib/theme-presets";

/** Presentation only: translate the original Tiger preset without writing settings.
 * Custom admin values and commerce stay intact; the legacy preset gets new storefront copy.
 */
export function storefrontAppearance(settings: SiteSettingsData): SiteSettingsData {
  const legacyBrand = /^(store|tiger|amaze markets)$/i.test(settings.brand.storeName.trim());
  const legacyTheme = isLegacyDarkTheme(settings.theme);
  return {
    ...settings,
    brand: {
      ...settings.brand,
      storeName: legacyBrand ? "Maxforce Digital" : settings.brand.storeName,
      logoUrl: !settings.brand.logoUrl || ["/brand/tiger-logo.svg", "/brand/amaze-logo.png"].includes(settings.brand.logoUrl) ? "/brand/maxforce-logo.jpg" : settings.brand.logoUrl,
      tagline: legacyBrand ? "Learn. Grow. Succeed." : settings.brand.tagline,
    },
    header: legacyBrand ? { navLinks: [
      { label: "Digital Courses", href: "/shop?category=courses" },
      { label: "Shop eBooks", href: "/shop?category=digital-e-book" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
    ] } : settings.header,
    announcement: legacyBrand ? { ...settings.announcement, enabled: true, text: "Practical digital skills and resources for everyday growth", link: "/shop" } : settings.announcement,
    seo: legacyBrand ? {
      ...settings.seo,
      metaTitle: "Maxforce Digital | Courses, eBooks & Digital Solutions",
      metaDescription: "Learn practical digital skills with Maxforce Digital courses, eBooks and technology solutions.",
    } : settings.seo,
    theme: legacyTheme ? { ...LIGHT_THEME } : settings.theme,
    home: {
      ...settings.home,
      categoriesHeading: ["Shop by Goal", "Shop By Category"].includes(settings.home.categoriesHeading) ? "Explore Digital Resources" : settings.home.categoriesHeading,
      featuredHeading: ["Featured", "Trending Now"].includes(settings.home.featuredHeading) ? "Digital Courses" : settings.home.featuredHeading,
    },
    footer: {
      ...settings.footer,
      columns: legacyBrand ? [
        { title: "Company", links: [{ label: "About Us", href: "/about-us" }, { label: "Services", href: "/services" }, { label: "Industries", href: "/industries" }, { label: "Contact Us", href: "/contact-us" }] },
        { title: "Resources", links: [{ label: "Digital Courses", href: "/shop?category=courses" }, { label: "eBooks", href: "/shop?category=digital-e-book" }, { label: "Blog", href: "/blog" }, { label: "My Account", href: "/account" }] },
      ] : settings.footer.columns,
      about: legacyBrand ? "Practical digital courses, eBooks and technology solutions that help people and businesses learn, create and grow." : settings.footer.about,
      copyrightText: legacyBrand ? "© {year} MAXFORCE SERVICES PRIVATE LIMITED. All rights reserved." : settings.footer.copyrightText,
    },
  };
}

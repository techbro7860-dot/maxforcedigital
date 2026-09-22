import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";
import { LIGHT_THEME } from "@/lib/theme-presets";

/**
 * Shared TypeScript shape for the CMS settings. This is the single source of
 * truth the admin form, the API, and every storefront component agree on.
 */
export interface NavLink {
  label: string;
  href: string;
}
export interface FooterColumn {
  title: string;
  links: NavLink[];
}
export interface Highlight {
  icon: string;
  title: string;
  subtitle: string;
}
export interface Banner {
  image: string;
  heading: string;
  subheading: string;
  link: string;
}
/** A toggleable homepage product rail. */
export interface HomeSection {
  enabled: boolean;
  heading: string;
  subheading: string;
}

export interface SiteSettingsData {
  brand: {
    storeName: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  theme: {
    primaryColor: string;
    primaryForeground: string;
    backgroundColor: string;
    surfaceColor: string;
    foregroundColor: string;
    mutedColor: string;
    borderColor: string;
    accentColor: string;
  };
  commerce: {
    currencySymbol: string;
    currencyCode: string;
    shippingFee: number;
    freeShippingThreshold: number;
    codEnabled: boolean;
    payplusEnabled: boolean;
    razorpayEnabled: boolean;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
      backgroundImage: string;
    };
    categoriesHeading: string;
    featuredHeading: string;
    highlights: Highlight[];
    banners: Banner[];
    combos: HomeSection;
    bestsellers: HomeSection;
    offers: HomeSection;
    comboCategorySlug: string;
  };
  header: {
    navLinks: NavLink[];
  };
  footer: {
    about: string;
    columns: FooterColumn[];
    copyrightText: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

/**
 * The fallback content used when the DB has no settings yet (fresh install),
 * or when a stored doc is missing a newly-added field. These defaults mirror
 * the values that were previously hardcoded in the storefront, so the site
 * looks identical before the admin touches anything.
 */
export const DEFAULT_SETTINGS: SiteSettingsData = {
  brand: {
    storeName: "Maxforce Digital",
    tagline: "Learn. Grow. Succeed.",
    logoUrl: "/brand/maxforce-logo.jpg",
    faviconUrl: "",
  },
  seo: {
    metaTitle: "Maxforce Digital | Courses, eBooks & Digital Solutions",
    metaDescription: "Learn practical digital skills, discover useful eBooks and grow with Maxforce Digital's courses, resources and technology services.",
  },
  theme: { ...LIGHT_THEME },
  commerce: {
    currencySymbol: "₹",
    currencyCode: "INR",
    shippingFee: 0,
    freeShippingThreshold: 0,
    codEnabled: false,
    payplusEnabled: false,
    razorpayEnabled: true,
  },
  announcement: {
    enabled: true,
    text: "Practical digital skills and resources for everyday growth",
    link: "/shop",
  },
  home: {
    hero: {
      title: "Learn new skills. Build your future.",
      subtitle: "Practical courses, eBooks, templates and digital resources designed to help you learn, create and grow.",
      ctaText: "Explore Courses",
      ctaLink: "/shop?category=courses",
      backgroundImage: "",
    },
    categoriesHeading: "Explore Digital Resources",
    featuredHeading: "Digital Courses",
    highlights: [],
    banners: [],
    combos: {
      enabled: true,
      heading: "Featured Resources",
      subheading: "Practical knowledge you can use right away.",
    },
    bestsellers: {
      enabled: true,
      heading: "Popular with Learners",
      subheading: "Our most-loved courses, guides and templates.",
    },
    offers: {
      enabled: true,
      heading: "Learning Offers",
      subheading: "Build valuable skills for less.",
    },
    comboCategorySlug: "digital-e-book",
  },
  header: {
    navLinks: [
      { label: "Digital Courses", href: "/shop?category=courses" },
      { label: "Shop eBooks", href: "/shop?category=digital-e-book" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  footer: {
    about: "Practical digital courses, eBooks and technology solutions that help people and businesses learn, create and grow.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about-us" },
          { label: "Contact Us", href: "/contact-us" },
          { label: "Services", href: "/services" },
          { label: "Industries", href: "/industries" },
        ],
      },
      {
        title: "Policies",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/terms-and-conditions" },
          { label: "Refund Policy", href: "/refund-policy" },
        ],
      },
    ],
    copyrightText: "© {year} MAXFORCE SERVICES PRIVATE LIMITED. All rights reserved.",
  },
  contact: {
    email: "info@maxforcedigital.com",
    phone: "0120 318 9653",
    address: "2nd Floor, E-29, Sector 63, Noida, Uttar Pradesh 201301",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  },
};

/** True for plain `{}` objects — used to decide what to deep-merge vs. copy. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge `stored` over `defaults`. Objects merge key-by-key; arrays and
 * scalars from `stored` replace the default entirely (so an admin who clears
 * all nav links really gets zero nav links, not the defaults back).
 */
export function mergeSettings<T>(defaults: T, stored: unknown): T {
  if (!isPlainObject(defaults) || !isPlainObject(stored)) return defaults;
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };

  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    const dVal = (defaults as Record<string, unknown>)[key];
    const sVal = stored[key];
    if (sVal === undefined || sVal === null) {
      out[key] = dVal;
    } else if (isPlainObject(dVal) && isPlainObject(sVal)) {
      out[key] = mergeSettings(dVal, sVal);
    } else {
      out[key] = sVal;
    }
  }
  return out as T;
}

/**
 * Reads the singleton settings doc, creating it with defaults on first call,
 * and always returns a plain, fully-populated SiteSettingsData object (defaults
 * merged under whatever is stored). Safe to call from any Server Component,
 * layout, or route handler.
 */
export function applyFreeShipping(settings: SiteSettingsData): SiteSettingsData {
  return {
    ...settings,
    commerce: { ...settings.commerce, shippingFee: 0, freeShippingThreshold: 0 },
    announcement: {
      ...settings.announcement,
      text: settings.announcement.text.replace(/free delivery above ₹[\d,]+/gi, "Free delivery on all orders"),
    },
    home: {
      ...settings.home,
      highlights: settings.home.highlights.map((item) => item.icon === "Truck" && /free delivery/i.test(item.title)
        ? { ...item, subtitle: "On all orders" } : item),
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOneAndUpdate(
      { singletonKey: "site" },
      { $setOnInsert: { singletonKey: "site", ...DEFAULT_SETTINGS } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return applyFreeShipping(mergeSettings(DEFAULT_SETTINGS, doc as unknown));
  } catch (err) {
    // Never let a settings/DB hiccup take down a page — fall back to defaults.
    console.error("getSiteSettings failed, using defaults:", err);
    return applyFreeShipping(DEFAULT_SETTINGS);
  }
}

/** Format a numeric amount with the configured currency symbol, e.g. "₹499". */
export function formatPrice(amount: number, symbol = "₹"): string {
  return `${symbol}${amount}`;
}

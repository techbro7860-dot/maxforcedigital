import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const offeringSchema = z.object({
  slug,
  title: text(120).min(1),
  summary: text(400).default(""),
  body: text(12000).default(""),
  features: z.array(text(160)).max(30).default([]),
  isActive: z.boolean().default(true),
});

export const siteContentSchema = z.object({
  about: z.object({
    title: text(140).min(1),
    intro: text(3000),
    mission: text(3000),
    vision: text(3000),
    stats: z.array(z.object({ value: text(40), label: text(80) })).max(12),
    values: z.array(z.object({ title: text(120), description: text(600) })).max(12).default([]),
    team: z.array(z.object({
      name: text(100), role: text(100), bio: text(1000), image: text(1000),
    })).max(30),
  }),
  contact: z.object({
    title: text(140).min(1), intro: text(2000), email: text(254), phone: text(40),
    address: text(500), mapUrl: text(1000),
  }),
  services: z.array(offeringSchema).max(50),
  industries: z.array(offeringSchema).max(50),
  policies: z.array(z.object({ slug, title: text(140).min(1), body: text(30000) })).max(20),
});

export const contactInquirySchema = z.object({
  name: text(100).min(2),
  email: z.string().trim().email().max(254),
  phone: text(40).optional().default(""),
  company: text(120).optional().default(""),
  service: text(120).optional().default(""),
  message: text(4000).min(10),
  website: z.string().max(0).optional(), // honeypot
});

export const postSchema = z.object({
  title: text(160).min(1), slug, excerpt: text(500).default(""),
  content: text(50000).min(1), coverImage: text(1000).default(""),
  metaTitle: text(160).default(""), metaDescription: text(320).default(""),
  isPublished: z.boolean().default(false),
});

import { z } from "zod";

const variantAttributeSchema = z.object({
  name: z.string().min(1),
  options: z.array(z.string().min(1)).min(1),
});

const variantCombinationSchema = z.object({
  combination: z.record(z.string()),
  sku: z.string().optional(),
  stock: z.number().min(0),
  price: z.number().positive().optional(),
  image: z.string().optional(),
});

const deliveryMetadataSchema = z.object({
  secureAssetKey: z.string().trim().min(1).optional(),
  externalUrl: z.string().url().refine((value) => new URL(value).protocol === "https:", {
    message: "External access URL must use HTTPS",
  }).optional(),
}).strict();

export const productSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  discountPrice: z.number().positive().optional(),
  sku: z.string().optional(),
  // Images are optional so the catalogue can go live before photography
  // exists; ProductCard renders a styled empty state when the array is empty.
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(variantAttributeSchema).default([]),
  variantCombinations: z.array(variantCombinationSchema).default([]),
  stock: z.number().min(0).default(0),
  productType: z.enum(["course", "ebook", "service", "physical"]).default("physical"),
  deliveryMode: z.enum(["secure_download", "external_link", "manual", "none"]).default("none"),
  deliveryMetadata: deliveryMetadataSchema.optional(),
}).superRefine((product, ctx) => {
  const digital = product.productType === "course" || product.productType === "ebook";
  if (!digital && product.deliveryMode !== "none") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMode"], message: "Only courses and eBooks can use digital delivery" });
  }
  if (!digital && product.deliveryMetadata && Object.values(product.deliveryMetadata).some(Boolean)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMetadata"], message: "This product type cannot contain delivery metadata" });
  }
  if (digital && product.isActive && product.deliveryMode === "none") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMode"], message: "Active courses and eBooks require a delivery method" });
  }
  if (product.deliveryMode === "secure_download" && !product.deliveryMetadata?.secureAssetKey) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMetadata", "secureAssetKey"], message: "A secure asset key is required" });
  }
  if (product.deliveryMode === "external_link" && !product.deliveryMetadata?.externalUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMetadata", "externalUrl"], message: "An external access URL is required" });
  }
  if (["manual", "none"].includes(product.deliveryMode) && product.deliveryMetadata && Object.values(product.deliveryMetadata).some(Boolean)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["deliveryMetadata"], message: "Delivery metadata requires a delivery method" });
  }
});

export type ProductInput = z.infer<typeof productSchema>;

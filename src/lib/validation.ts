import { z } from "zod";
export const leadSchema = z.object({
  full_name: z.string().trim().min(3, "Adınızı ve soyadınızı yazın.").max(100),
  email: z
    .email("Geçerli bir e-posta adresi yazın.")
    .max(254)
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (v) => !v || /^[+\d\s().-]{7,30}$/.test(v),
      "Geçerli bir telefon numarası yazın.",
    )
    .optional(),
  product_id: z.string().uuid("Bir ürün seçin.").nullable(),
  message: z
    .string()
    .trim()
    .max(2000, "Mesaj en fazla 2000 karakter olabilir.")
    .optional(),
  marketing_consent: z.boolean(),
  privacy_acknowledged: z.literal(true, {
    error: "Aydınlatma metnini okuyup onaylayın.",
  }),
  website: z.string().max(0),
  started_at: z.number().int().positive(),
  turnstile_token: z.string().max(2048).optional(),
});
export type LeadInput = z.input<typeof leadSchema>;
export const productSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  collection_id: z.uuid(),
  short_description: z.string().max(240),
  description: z.string().max(6000),
  dimensions: z.string().max(1000),
  materials: z.string().max(2000),
  design_story: z.string().max(4000),
  care: z.string().max(2000),
  usage: z.string().max(2000),
  status: z.enum(["concept", "coming_soon", "open", "available", "sold_out"]),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  price: z.number().nonnegative().nullable(),
  currency: z.literal("TRY"),
});

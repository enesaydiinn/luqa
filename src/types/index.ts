export type ProductStatus =
  "concept" | "coming_soon" | "open" | "available" | "sold_out";
export interface Product {
  id: string;
  collection_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  dimensions: string;
  materials: string;
  status: ProductStatus;
  is_featured: boolean;
  is_published: boolean;
  price: number | null;
  currency: string;
  design_story: string;
  care: string;
  usage: string;
  created_at: string;
  product_images: { image_url: string; alt_text: string; sort_order: number }[];
}
export interface SiteSettings {
  hero_title?: string;
  hero_description?: string;
  hero_image?: string;
  collection_description?: string;
  story?: string;
  contact_email?: string;
  seo_title?: string;
  seo_description?: string;
}
export type LeadStatus =
  "new" | "reviewing" | "contacted" | "completed" | "cancelled";

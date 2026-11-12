"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowUpRight, ArrowRight } from "lucide-react";
import { useSite } from "./site-shell";
import type { Product } from "@/types";
import { content } from "@/config/content";
import { track } from "@/lib/tracking";
export function ProductCard({
  product: p,
  index = 0,
  compact = false,
  image,
  description,
}: {
  product: Product;
  index?: number;
  compact?: boolean;
  image?: string;
  description?: string;
}) {
  const { favorites, toggleFavorite, inquire } = useSite();
  return (
    <article
      className={`product-card ${compact ? "product-card--featured" : ""}`}
    >
      <div className="product-image">
        <Link
          href={`/urun/${p.slug}`}
          onClick={() => track("select_item", { item_id: p.id })}
        >
          <Image
            src={
              image || p.product_images[0]?.image_url || "/images/glass.webp"
            }
            alt={p.product_images[0]?.alt_text || p.name}
            fill
            quality={90}
            sizes={
              compact
                ? "(max-width:700px) 45vw,(max-width:1100px) 23vw,16vw"
                : "(max-width:640px) 45vw,(max-width:1000px) 45vw,24vw"
            }
          />
        </Link>
        {!compact && (
          <span className="product-status">{content.statuses[p.status]}</span>
        )}
        <button
          className={`favorite ${favorites.includes(p.id) ? "active" : ""}`}
          aria-label={`${p.name} ${favorites.includes(p.id) ? "favorilerden çıkar" : "favorilere ekle"}`}
          aria-pressed={favorites.includes(p.id)}
          onClick={() => toggleFavorite(p.id)}
        >
          <Heart
            size={19}
            strokeWidth={1.2}
            fill={favorites.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button className="quick-inquire" onClick={() => inquire(p.id)}>
          Ön Talep Oluştur <ArrowRight size={16} />
        </button>
      </div>
      <div className="product-card-label">
        <span className="eyebrow">LUQA HOME</span>
        <span className="product-number">0{index + 1}</span>
      </div>
      <Link className="product-title" href={`/urun/${p.slug}`}>
        <h3>{p.name}</h3>
        <ArrowUpRight size={20} strokeWidth={1.25} />
      </Link>
      <p>{description || p.short_description}</p>
      {compact && (
        <span className="home-product-status">
          {content.statuses[p.status]}
        </span>
      )}
      {p.price !== null && (
        <p className="price">
          {new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: p.currency,
          }).format(p.price)}
        </p>
      )}
      <Link className="product-details" href={`/urun/${p.slug}`}>
        Detayları İncele <span>↗</span>
      </Link>
    </article>
  );
}

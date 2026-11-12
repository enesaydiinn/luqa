"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";
import { content } from "@/config/content";
import { track } from "@/lib/tracking";
export function CatalogGrid({ products }: { products: Product[] }) {
  const [status, setStatus] = useState("all"),
    [sort, setSort] = useState("featured"),
    [query, setQuery] = useState("");
  useEffect(
    () => track("view_collection", { item_list_name: "LUQA HOME" }),
    [],
  );
  const filtered = products
    .filter(
      (p) =>
        (status === "all" || p.status === status) &&
        p.name.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "tr")
        : sort === "newest"
          ? b.created_at.localeCompare(a.created_at)
          : Number(b.is_featured) - Number(a.is_featured),
    );
  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-tabs">
          <button
            className={status === "all" ? "selected" : ""}
            onClick={() => setStatus("all")}
          >
            Tüm Tasarımlar <span>{products.length}</span>
          </button>
          <button
            className={status === "concept" ? "selected" : ""}
            onClick={() => setStatus("concept")}
          >
            Konsept Koleksiyonu
          </button>
        </div>
        <div className="catalog-tools">
          <label className="catalog-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara"
              aria-label="Ürün adı ara"
            />
          </label>
          <label>
            <SlidersHorizontal size={15} />
            <select
              aria-label="Ürün durumunu filtrele"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              {Object.entries(content.statuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <select
              aria-label="Ürünleri sırala"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Önerilen Sıralama</option>
              <option value="name">İsim: A–Z</option>
              <option value="newest">En Yeni</option>
            </select>
          </label>
        </div>
      </div>
      <p className="catalog-count">{filtered.length} parça · LUQA HOME</p>
      <div className="product-grid">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h2>Bu seçimde henüz bir parça yok.</h2>
          <p>Yeni tasarımlar için koleksiyonu takip edin.</p>
          <button
            className="text-link"
            onClick={() => {
              setStatus("all");
              setQuery("");
            }}
          >
            Filtreleri Temizle <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

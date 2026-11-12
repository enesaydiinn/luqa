"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import type { Product } from "@/types";
import { track } from "@/lib/tracking";
export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0),
    [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    touchStart = useRef<number | null>(null);
  useEffect(
    () => track("view_item", { item_id: product.id, item_name: product.name }),
    [product.id, product.name],
  );
  useEffect(() => {
    if (zoom) dialog.current?.showModal();
    else dialog.current?.close();
  }, [zoom]);
  const images = product.product_images;
  if (!images.length)
    return (
      <div className="empty-state">
        <h3>Görseller hazırlanıyor.</h3>
        <p>Bu parçanın görsellerini yakında paylaşacağız.</p>
      </div>
    );
  return (
    <div className="gallery">
      <button
        className="gallery-main"
        onTouchStart={(e) => {
          touchStart.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const delta =
            e.changedTouches[0].clientX -
            (touchStart.current ?? e.changedTouches[0].clientX);
          if (Math.abs(delta) > 40) {
            e.preventDefault();
            setIndex(
              (old) =>
                (old + (delta < 0 ? 1 : images.length - 1)) % images.length,
            );
          }
          touchStart.current = null;
        }}
        onClick={() => setZoom(true)}
        aria-label="Ürün görselini büyüt"
      >
        <Image
          src={images[index].image_url}
          alt={images[index].alt_text}
          fill
          sizes="(max-width:760px) 100vw,50vw"
          priority
        />
        <span className="zoom-label">
          <Expand size={15} /> Yakından Keşfet
        </span>
      </button>
      <div className="gallery-thumbs" aria-label="Ürün görselleri">
        {images.map((im, i) => (
          <button
            key={im.image_url}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Görsel ${i + 1}: ${im.alt_text}`}
            aria-pressed={i === index}
          >
            <Image src={im.image_url} alt="" fill sizes="86px" />
          </button>
        ))}
      </div>
      <p className="gallery-note">
        Görseller tasarım konseptini temsil etmektedir.
      </p>
      <dialog
        ref={dialog}
        className="zoom-dialog"
        aria-label="Büyütülmüş ürün görseli"
        onCancel={() => setZoom(false)}
      >
        <button
          className="icon-button"
          onClick={() => setZoom(false)}
          aria-label="Büyütülmüş görseli kapat"
        >
          <X />
        </button>
        <Image
          src={images[index].image_url}
          alt={images[index].alt_text}
          fill
          sizes="95vw"
        />
      </dialog>
    </div>
  );
}

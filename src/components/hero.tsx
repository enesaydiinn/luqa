"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { content } from "@/config/content";
const slides = [
  {
    image: "/images/home/luqa-hero-original.png",
    alt: "Mermer yüzey üzerinde bordo, pembe ve beyaz çiçeklerle işlenmiş LUQA Heritage cam sandık konsepti",
  },
  {
    image: "/images/glass.webp",
    alt: "Altın çerçeveli ve açık tonlu çiçek detaylı LUQA cam kutu konsepti",
  },
  {
    image: "/images/floral.webp",
    alt: "LUQA konseptindeki üç boyutlu bordo çiçek ve altın tonlu yaprak detayları",
  },
];
export function Hero({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  const [slide, setSlide] = useState(0);
  return (
    <section
      className={`home-hero ${slide === 0 && !image ? "home-hero--original" : ""}`}
      aria-roledescription="carousel"
      aria-label="LUQA HOME koleksiyonu"
    >
      <div className="home-hero-photo">
        <Image
          key={slides[slide].image}
          src={slide === 0 && image ? image : slides[slide].image}
          alt={slides[slide].alt}
          fill
          quality={90}
          sizes={
            slide === 0 && !image ? "100vw" : "(max-width:700px) 100vw,66vw"
          }
          unoptimized={slide === 0 && !image}
          loading="eager"
          priority
        />
      </div>
      <div className="home-hero-copy">
        <p className="home-eyebrow">{content.hero.eyebrow}</p>
        <h1>
          {(title || content.hero.title).split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="home-hero-description">
          {description || content.hero.description}
        </p>
        <Link className="home-bronze-button" href="/koleksiyon">
          Koleksiyonu Keşfet <ArrowRight size={20} strokeWidth={1.1} />
        </Link>
        <div
          className="home-hero-pagination"
          aria-label="Koleksiyon görselleri"
        >
          {slides.map((item, i) => (
            <button
              key={item.image}
              aria-label={`${i + 1}. koleksiyon görselini göster`}
              aria-pressed={slide === i}
              onClick={() => setSlide(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        Görsel {slide + 1} / {slides.length}. Görseller tasarım konseptini
        temsil etmektedir.
      </span>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Gem,
  ShieldCheck,
  Flower2,
  Gift,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { getProducts, getSettings } from "@/lib/catalog";
import { LeadForm } from "@/features/lead-form";
import { content } from "@/config/content";
import { homeContent } from "@/config/home-content";
const benefitIcons = {
  gem: Gem,
  shield: ShieldCheck,
  flower: Flower2,
  gift: Gift,
  sparkles: Sparkles,
};
export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: { absolute: s.seo_title || "LUQA | Zarafeti Detaylarda Keşfedin" },
    description: s.seo_description || content.description,
  };
}
export default async function Home() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);
  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  return (
    <main id="main" className="home-page">
      <Hero
        title={settings.hero_title}
        description={settings.hero_description}
        image={settings.hero_image}
      />
      <section className="home-benefits" aria-label="LUQA marka değerleri">
        {homeContent.benefits.map((item) => {
          const Icon = benefitIcons[item.icon as keyof typeof benefitIcons];
          return (
            <div className="home-benefit" key={item.title}>
              <Icon size={40} strokeWidth={1} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </section>
      <section
        className="home-details"
        aria-label="Koleksiyon ve tasarım detayları"
      >
        {homeContent.details.map((item) => (
          <Link className="home-detail-card" href={item.href} key={item.title}>
            <div className="home-detail-image">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width:700px) 160px,13vw"
              />
            </div>
            <div className="home-detail-copy">
              <h2>
                {item.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <span>
                {item.link}
                <ArrowRight size={17} strokeWidth={1} />
              </span>
            </div>
          </Link>
        ))}
      </section>
      <section className="home-featured" aria-labelledby="featured-title">
        <div className="home-featured-heading">
          <h2 id="featured-title">Öne Çıkan Ürünler</h2>
          <Link href="/koleksiyon">
            Tüm Ürünleri Gör <ArrowRight size={18} strokeWidth={1} />
          </Link>
        </div>
        <div className="home-featured-layout">
          <div className="home-product-grid">
            {featured.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                compact

                description={homeContent.productDescriptions[p.slug]}
              />
            ))}
          </div>
          <aside className="home-story">
            <div className="home-story-photo" aria-hidden="true">
              <Image
                src="/images/home/story-flowers.webp"
                alt=""
                fill
                sizes="170px"
              />
            </div>
            <div className="home-story-copy">
              <p className="home-eyebrow">HİKÂYEMİZ</p>
              <h2>{homeContent.storyTitle}</h2>
              <p>{settings.story || homeContent.story}</p>
              <Link className="home-outline-button" href="/hakkimizda">
                Marka Hikâyemiz <ArrowRight size={19} strokeWidth={1} />
              </Link>
            </div>
          </aside>
        </div>
        <p className="home-concept-note">
          İlk koleksiyon geliştirme aşamasındadır. Görseller tasarım konseptini
          temsil etmektedir.
        </p>
      </section>
      <section className="newsletter section-pad" id="on-talep">
        <div className="newsletter-copy">
          <span className="eyebrow">HİKÂYENİN BİR PARÇASI OLUN</span>
          <h2>
            Güzel başlangıçlardan
            <br />
            <em>ilk siz haberdar olun.</em>
          </h2>
          <p>
            LUQA HOME koleksiyonu hayat buluyor. İlginizi çeken parçaları
            bizimle paylaşın, bu yolculuğa birlikte başlayalım.
          </p>
          <div className="newsletter-symbol" aria-hidden="true">
            <Flower2 size={80} strokeWidth={0.5} />
          </div>
          <span className="eyebrow">WITH CARE, LUQA.</span>
        </div>
        <div className="newsletter-form">
          <LeadForm products={products} />
        </div>
      </section>
    </main>
  );
}

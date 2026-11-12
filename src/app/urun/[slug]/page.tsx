import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import { ProductGallery } from "@/features/product-gallery";
import { Breadcrumb } from "@/components/breadcrumb";
import { InquireButton } from "@/components/inquire-button";
import { ProductCard } from "@/components/product-card";
import { content } from "@/config/content";
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProducts()).find((p) => p.slug === slug);
  return p
    ? {
        title: `${p.name} — Cam Hatıra Kutusu`,
        description: p.short_description,
        alternates: { canonical: `/urun/${p.slug}` },
        openGraph: {
          images: p.product_images[0] ? [p.product_images[0].image_url] : [],
        },
      }
    : { title: "Ürün bulunamadı" };
}
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.product_images.map(
      (i) => new URL(i.image_url, content.domain).href,
    ),
    brand: { "@type": "Brand", name: "LUQA" },
    url: `${content.domain}/urun/${p.slug}`,
  };
  return (
    <main id="main" className="product-page section-pad">
      <Breadcrumb
        items={[
          { label: "Koleksiyon", href: "/koleksiyon" },
          { label: p.name },
        ]}
      />
      <div className="product-layout">
        <ProductGallery product={p} />
        <div className="product-info">
          <span className="eyebrow">LUQA HOME · İMZALI CAM HATIRA KUTUSU</span>
          <h1>{p.name}</h1>
          <div className="status-line">{content.statuses[p.status]}</div>
          <p className="product-description">{p.description}</p>
          {p.price !== null && (
            <p>
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: p.currency,
              }).format(p.price)}
            </p>
          )}
          <InquireButton id={p.id} />
          <p className="form-notice">{content.leadNotice}</p>
          <div className="product-accordions">
            {[
              { title: "Tasarımın Hikâyesi", text: p.design_story },
              {
                title: "Ölçüler & Malzeme",
                text: `${p.dimensions} ${p.materials}`,
              },
              { title: "Kullanım & İç Düzenleme", text: p.usage },
              { title: "Bakım & Özen", text: p.care },
            ].map((item, i) => (
              <details key={item.title} open={i === 0}>
                <summary>{item.title}</summary>
                <p>{item.text}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <section className="related">
        <div className="section-intro">
          <div>
            <span className="eyebrow">AYNI HİKÂYENİN DİĞER PARÇALARI</span>
            <h2>
              Bunları da <em>sevebilirsiniz.</em>
            </h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.id !== p.id)
            .slice(0, 3)
            .map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: content.domain,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Koleksiyon",
                item: `${content.domain}/koleksiyon`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: p.name,
                item: `${content.domain}/urun/${p.slug}`,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}

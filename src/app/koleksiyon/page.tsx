import type { Metadata } from "next";
import { getProducts, getSettings } from "@/lib/catalog";
import { CatalogGrid } from "@/features/catalog-grid";
import { Breadcrumb } from "@/components/breadcrumb";
export const metadata: Metadata = {
  title: "LUQA HOME Koleksiyonu",
  description:
    "LUQA HOME cam hatıra kutusu konseptleri. Heritage, Blossom, Ivory ve Garden tasarımlarını keşfedin.",
  alternates: { canonical: "/koleksiyon" },
};
export default async function Collection() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);
  return (
    <main id="main" className="catalog-page section-pad">
      <Breadcrumb items={[{ label: "Koleksiyon" }]} />
      <div className="page-heading" id="luqa-home">
        <span className="eyebrow">İLK BÖLÜM · LUQA HOME</span>
        <h1>
          Anılarınızı saklamanın
          <br />
          <em>zarif yolu.</em>
        </h1>
        <p>
          {settings.collection_description ||
            "Küçük hazineler, büyük hikâyeler. Yaşamınıza eşlik etmek için tasarlanan ilk LUQA HOME konseptleriyle tanışın."}
        </p>
      </div>
      <CatalogGrid products={products} />
      <p className="concept-note">
        Koleksiyon geliştirme aşamasındadır. Görseller tasarım konseptini temsil
        etmektedir. Nihai ürün, malzeme ve ölçüler değişebilir.
      </p>
    </main>
  );
}

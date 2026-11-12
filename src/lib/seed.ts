import type { Product } from "@/types";
const shared = {
  collection_id: "10000000-0000-4000-8000-000000000001",
  dimensions: "40 × 30 × 20 cm — üretim öncesi hedef ölçü; kesinleşmemiştir.",
  materials:
    "Cam görünümlü şeffaf paneller ve metalik altın tonlarında çerçeve hedeflenmektedir. Nihai malzeme ve üretim bilgileri henüz kesinleşmemiştir.",
  status: "concept" as const,
  is_featured: true,
  is_published: true,
  price: null,
  currency: "TRY",
  care: "Bakım talimatları, nihai malzemeler ve üretim testleri tamamlandıktan sonra paylaşılacaktır.",
  usage:
    "Hatıralar, takılar ve özel eşyalar için dekoratif saklama konsepti. İç düzenleme seçenekleri geliştirme aşamasındadır.",
  created_at: "2026-11-11T00:00:00Z",
};
export const seedProducts: Product[] = [
  {
    ...shared,
    id: "20000000-0000-4000-8000-000000000001",
    name: "LUQA Heritage",
    slug: "luqa-heritage",
    short_description: "Gelenekten ilham alan, zamansız bir hatıra.",
    description:
      "Bordo, pembe ve beyaz çiçeklerin altın tonlu çerçeveyle buluştuğu cam hatıra kutusu konsepti. Sakladığınız her parçaya, yeni bir hikâye.",
    design_story:
      "Bir çiçeğin zarafeti, bir hatıranın değeri. Heritage, geleneksel çiçek motiflerini modern bir formda yeniden yorumluyor.",
    product_images: [
      {
        image_url: "/images/home/heritage-clean.webp",
        alt_text:
          "LUQA Heritage cam hatıra kutusu konsepti, bordo ve pembe çiçek detayları",
        sort_order: 0,
      },
      {
        image_url: "/images/floral.webp",
        alt_text: "Bordo çiçek ve altın tonlu üç boyutlu işleme konsepti",
        sort_order: 1,
      },
      {
        image_url: "/images/signature.webp",
        alt_text: "LUQA Q kilit tasarımı konseptinin yakın görünümü",
        sort_order: 2,
      },
    ],
  },
  {
    ...shared,
    id: "20000000-0000-4000-8000-000000000002",
    name: "LUQA Blossom",
    slug: "luqa-blossom",
    short_description: "Çiçeklerin en naif hali, anılarınıza eşlik eder.",
    description:
      "Pembe ve açık tonlu çiçeklerle tasarlanan romantik bir koleksiyon fikri. Blossom, yaşam alanlarına yumuşak ve zarif bir dokunuş katmayı amaçlıyor.",
    design_story:
      "İlkbaharın sakin renklerinden ilham alan Blossom, küçük anların güzelliğini saklamak için düşünüldü.",
    product_images: [
      {
        image_url: "/images/home/blossom-clean.webp",
        alt_text: "LUQA Blossom açık pembe çiçekli kutu konsepti",
        sort_order: 0,
      },
      {
        image_url: "/images/glass.webp",
        alt_text: "Açık tonlu çiçek işleme ve şeffaf panel konsepti",
        sort_order: 1,
      },
    ],
  },
  {
    ...shared,
    id: "20000000-0000-4000-8000-000000000003",
    name: "LUQA Ivory",
    slug: "luqa-ivory",
    short_description: "Sade çizgiler. İncelikle düşünülmüş detaylar.",
    description:
      "Krem ve altın tonlarının sakin uyumuyla şekillenen sade hatıra kutusu konsepti. Fazlalıklardan arınmış, özenle düşünülmüş bir tasarım.",
    design_story:
      "Ivory, sadeliğin içinde saklı ayrıntıları öne çıkarıyor. Işık, şeffaflık ve sıcak altın tonları bir arada.",
    product_images: [
      {
        image_url: "/images/home/ivory-clean.webp",
        alt_text: "LUQA Ivory krem ve altın tonlarında kutu konsepti",
        sort_order: 0,
      },
      {
        image_url: "/images/glass.webp",
        alt_text: "Altın tonlu çerçeve ve açık renkli çiçek işleme konsepti",
        sort_order: 1,
      },
    ],
  },
  {
    ...shared,
    id: "20000000-0000-4000-8000-000000000004",
    name: "LUQA Garden",
    slug: "luqa-garden",
    short_description: "Doğanın sakin ritminden, evinize.",
    description:
      "Çiçek ve yaprak detaylarının çevrelediği bir saklama konsepti. Garden, doğadan aldığı ilhamı evinize taşımak için geliştiriliyor.",
    design_story:
      "Bir bahçenin doğal dengesi, bir kutunun sınırları içinde. Garden, günlük yaşamda doğaya küçük bir alan açıyor.",
    product_images: [
      {
        image_url: "/images/home/garden-clean.webp",
        alt_text:
          "LUQA Garden altın tonlu yaprak ve çiçek detaylı cam kutu konsepti",
        sort_order: 0,
      },
      {
        image_url: "/images/floral.webp",
        alt_text: "Çiçek ve yaprak detaylarının tasarım referansı",
        sort_order: 1,
      },
    ],
  },
];

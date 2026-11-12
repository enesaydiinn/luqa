import type { Metadata } from "next";
import Image from "next/image";
import { InquireButton } from "@/components/inquire-button";
export const metadata: Metadata = {
  title: "Tasarım Anlayışımız",
  alternates: { canonical: "/tasarim" },
  description:
    "LUQA Signature Q, çiçek işlemeleri ve zamansız tasarım yaklaşımını yakından keşfedin.",
};
export default function Design() {
  return (
    <main id="main">
      <div className="editorial-banner">
        <Image
          src="/images/floral.webp"
          alt="Bordo çiçekli LUQA tasarım konseptindeki kabartma ve altın çerçeve detayları"
          fill
          sizes="100vw"
          priority
        />
        <span className="eyebrow">THE BEAUTY IS IN THE DETAILS</span>
      </div>
      <article className="editorial-content">
        <span className="eyebrow">TASARIM ANLAYIŞIMIZ</span>
        <h1>
          Bir fikirden,
          <br />
          <em>size ait bir parçaya.</em>
        </h1>
        <p className="intro">
          Estetik ve işlevsellik, aynı hikâyenin iki parçası.
        </p>
        <p>
          LUQA’da her tasarım bir soruyla başlar: Gündelik yaşamda kullandığımız
          bir parçaya nasıl daha fazla özen katabiliriz? Sade formları, sıcak
          tonları ve dokunma isteği uyandıran detayları bu düşünceyle bir araya
          getiriyoruz.
        </p>
        <h2 id="signature-q">Signature Q — bize ait bir iz.</h2>
        <p>
          LUQA’nın tasarım dilini yansıtan Q kilit konsepti, estetik ve
          işlevselliği tek bir detayda buluşturuyor. Logomuzdaki karakterden
          yola çıkan bu tasarım, koleksiyonun görsel imzası olarak
          geliştiriliyor. Kilit mekanizması henüz fiziksel olarak
          doğrulanmamıştır.
        </p>
        <div className="gallery-main" style={{ marginTop: 30 }}>
          <Image
            src="/images/signature.webp"
            alt="Özgün Q kilit konsepti"
            fill
            sizes="800px"
          />
        </div>
        <h2 id="desenler">Doğadan ilham alan detaylar.</h2>
        <p>
          Çiçek ve yaprak formları, ilk koleksiyonun hikâyesini anlatıyor. Altın
          tonlu konturlar ve renkli kabartma detaylar, şeffaf yüzey üzerinde
          hafiflik ve derinlik hissi oluşturmak üzere tasarlanıyor.
        </p>
        <h2 id="ic-tasarim">İç Tasarım Seçenekleri</h2>
        <p>
          Kadife görünümlü iç yüzeyler ve bölmeli düzenleyiciler, özel
          eşyalarınıza yer açmak için değerlendirilen tasarım seçenekleridir.
          Nihai iç malzeme, bölme ölçüleri ve üretim seçenekleri henüz
          kesinleşmemiştir.
        </p>
        <div className="design-interior-photo">
          <Image
            src="/images/home/interior-detail.webp"
            alt="Kadife görünümlü bölmeli kutu içi tasarım referansı"
            width={346}
            height={268}
          />
        </div>
        <h2>Henüz başlangıçtayız.</h2>
        <p>
          Paylaştığımız görseller tasarım konseptlerini temsil ediyor. Malzeme,
          boyut, üretim yöntemi ve mekanizma detayları geliştirme sürecinde
          değişebilir. Fiziksel ürünler ve testler tamamlandığında doğrulanmış
          bilgileri paylaşacağız.
        </p>
        <InquireButton className="text-link">
          Bu Yolculuğa Katılın
        </InquireButton>
      </article>
    </main>
  );
}

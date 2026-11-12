import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getSettings } from "@/lib/catalog";
import { content } from "@/config/content";
export const metadata: Metadata = {
  title: "LUQA’nın Dünyası",
  alternates: { canonical: "/hakkimizda" },
  description:
    "Gündelik yaşama özenle dokunan bir yaşam markası. LUQA’nın hikâyesini ve değerlerini keşfedin.",
};
export default async function About() {
  const s = await getSettings();
  return (
    <main id="main">
      <div className="editorial-banner">
        <Image
          src="/images/lifestyle-wide.webp"
          alt="LUQA marka dünyası: krem tonları, özenli ambalaj ve yaşam aksesuarları konsepti"
          fill
          sizes="100vw"
          priority
        />
        <span className="eyebrow">THE LUQA WAY OF LIVING</span>
      </div>
      <article className="editorial-content">
        <span className="eyebrow">LUQA’NIN DÜNYASI</span>
        <h1>
          Güzel bir hayat,
          <br />
          <em>küçük detaylarda.</em>
        </h1>
        <p className="intro">
          Bazı eşyalar yalnızca kullanılmaz.
          <br />
          Hayata eşlik eder, bir hikâyenin parçası olur.
        </p>
        <p>{s.story || content.story}</p>
        <p>
          Bizim için zarafet; gösterişte değil, düşünülmüş bir detayda. Bir
          eşyanın nasıl göründüğü kadar, yaşamınızdaki yerine de özen
          gösteriyoruz.
        </p>
        <h2>Bugün HOME ile başlayan bir yolculuk.</h2>
        <p>
          LUQA HOME, bu anlayışın ilk koleksiyonu. Cam hatıra kutusu
          konseptlerimizle, sevdiklerinizden kalan izlere ve sizin için değerli
          parçalara yer açıyoruz. İlk tasarımlarımız henüz geliştirme
          aşamasında; her adımı özenle şekillendiriyoruz.
        </p>
        <div className="design-details">
          <div>
            <h3>Özenli.</h3>
            <p>
              Estetik ile işlevselliği bir araya getiren düşünülmüş tasarımlar.
            </p>
          </div>
          <div>
            <h3>Zamansız.</h3>
            <p>
              Değişen günlere eşlik edebilen, sakin ve güçlü bir tasarım dili.
            </p>
          </div>
          <div>
            <h3>Ulaşılabilir.</h3>
            <p>Güzel tasarımı gündelik yaşamın bir parçası yapma hedefi.</p>
          </div>
        </div>
        <Link className="text-link" href="/koleksiyon">
          İlk Koleksiyonu Keşfet <ArrowUpRight size={18} />
        </Link>
      </article>
    </main>
  );
}

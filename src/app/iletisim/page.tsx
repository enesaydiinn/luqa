import type { Metadata } from "next";
import { getProducts, getSettings } from "@/lib/catalog";
import { LeadForm } from "@/features/lead-form";
import { content } from "@/config/content";
import { ContactLink } from "@/components/contact-link";
export const metadata: Metadata = {
  title: "İletişim & Ön Talep",
  alternates: { canonical: "/iletisim" },
  description:
    "LUQA ile iletişime geçin. Konsept koleksiyonunu keşfedin ve ilginizi çeken ürün için ön talep bırakın.",
};
export default async function Contact() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);
  const email = settings.contact_email || content.contact.email;
  return (
    <main id="main" className="section-pad">
      <div className="contact-layout">
        <div className="contact-copy">
          <span className="eyebrow">İLETİŞİMDE KALALIM</span>
          <h1>
            Her güzel hikâye,
            <br />
            <em>bir merhabayla başlar.</em>
          </h1>
          <p>
            Koleksiyon hakkında merak ettiklerinizi paylaşın. İlginizi çeken
            tasarımı bize bildirin, yeni adımlardan haberdar olun.
          </p>
          {email ? (
            <ContactLink email={email} />
          ) : (
            <p className="form-status">
              LUQA’nın resmi iletişim kanalları yakında burada paylaşılacak.
            </p>
          )}
        </div>
        <div>
          <LeadForm products={products} />
        </div>
      </div>
      <section className="faq" id="sorular">
        <span className="eyebrow">MERAK ETTİKLERİNİZ</span>
        <h2>Sıkça Sorulan Sorular</h2>
        {[
          {
            q: "Ürünleri şu anda satın alabilir miyim?",
            a: "İlk koleksiyonumuz geliştirme aşamasındadır. Sitedeki parçalar konsept tasarımlardır ve henüz satışa sunulmamıştır. Bu aşamada ödeme alınmaz.",
          },
          {
            q: "Ön talep ne anlama geliyor?",
            a: "Ön talep, bir ürüne olan ilginizi bizimle paylaşmanızı sağlar. Satın alma, sipariş veya kesin rezervasyon oluşturmaz. Talep toplama açıldığında gelişmeleri paylaşmak için iletişim kurabiliriz.",
          },
          {
            q: "Görseller nihai ürünü mü gösteriyor?",
            a: "Hayır. Görseller tasarım konseptlerini temsil eder. Nihai ürünün malzemesi, ölçüsü, renkleri ve detayları geliştirme sürecinde değişebilir.",
          },
          {
            q: "Üretim ve satış tarihi belli mi?",
            a: "Henüz doğrulanmış bir üretim veya satış tarihi bulunmuyor. Kesinleşen bilgileri bu site üzerinden paylaşacağız.",
          },
        ].map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}

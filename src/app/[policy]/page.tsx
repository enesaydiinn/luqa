import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/config/content";
const titles: Record<string, string> = {
  kvkk: "KVKK Aydınlatma Metni",
  gizlilik: "Gizlilik Politikası",
  cerez: "Çerez Politikası",
};
export function generateStaticParams() {
  return Object.keys(titles).map((policy) => ({ policy }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ policy: string }>;
}): Promise<Metadata> {
  const { policy } = await params;
  return {
    title: titles[policy] || "Sayfa bulunamadı",
    alternates: { canonical: `/${policy}` },
    robots: { index: content.legalReady, follow: true },
  };
}
export default async function Policy({
  params,
}: {
  params: Promise<{ policy: string }>;
}) {
  const { policy } = await params;
  if (!titles[policy]) notFound();
  return (
    <main id="main" className="legal-page section-pad">
      <span className="eyebrow">LUQA · BİLGİLENDİRME</span>
      <h1>{titles[policy]}</h1>
      {!content.legalReady && (
        <div className="legal-draft">
          <strong>Taslak — inceleme ve işletme bilgileri bekleniyor.</strong>
          <br />
          Bu sayfa nihai hukuki metin değildir. Veri sorumlusu ve işletme
          bilgileri tamamlanmadan kişisel veri kaydı açılmaz.
        </div>
      )}
      {policy === "cerez" ? (
        <>
          <h2>Gerekli depolama</h2>
          <p>
            Favori ürün seçimleri ve analitik tercihi cihazınızın yerel
            depolamasında saklanır. Yönetici girişi için Supabase oturum
            çerezleri kullanılır.
          </p>
          <h2>İsteğe bağlı analitik</h2>
          <p>
            Google Analytics 4 yalnızca yapılandırıldığında ve çerez
            tercihlerinden izin verdiğinizde çalışır. Sayfa görüntüleme,
            koleksiyon inceleme, ürün seçimi ve talep oluşturma olayları
            ölçülebilir. İzin önceden seçili değildir. İzninizi alt menüdeki
            Çerez Tercihleri üzerinden değiştirebilirsiniz.
          </p>
        </>
      ) : (
        <>
          <h2>Veri sorumlusu</h2>
          <p>
            {content.contact.name || "İşletme unvanı: henüz belirtilmedi."}
            <br />
            {content.contact.address || "Adres: henüz belirtilmedi."}
            <br />
            {content.contact.email ||
              "Resmi iletişim adresi: henüz belirtilmedi."}
          </p>
          <h2>İşlenen bilgiler ve amaç</h2>
          <p>
            Ön talep toplama açıldığında; ad soyad, e-posta, ilgilenilen ürün
            ile isteğe bağlı telefon ve mesaj, talebi değerlendirmek ve
            yanıtlamak amacıyla işlenir. Pazarlama izni ayrıca ve isteğe bağlı
            alınır. Hizmet güvenliği için kimlikten ayrıştırılmış hız sınırlama
            kaydı tutulur.
          </p>
          <h2>Hukuki sebep, aktarım ve saklama</h2>
          <p>
            Veri sorumlusunun hukuki sebep, saklama süresi, hizmet sağlayıcılar
            ve yurt dışı aktarım mekanizmalarıyla ilgili değerlendirmesi
            tamamlandıktan sonra bu bölüm kesinleştirilecektir. Supabase ve
            Vercel yapılandırmasının veri işleme koşulları da bu değerlendirmeye
            dahil edilmelidir.
          </p>
          <h2>Başvuru ve haklar</h2>
          <p>
            İlgili kişi başvuru kanalı ve kişisel verilere ilişkin hakların
            kullanım süreci, resmi işletme bilgileri ve hukuki metin incelemesi
            tamamlandığında burada açıklanacaktır.
          </p>
        </>
      )}
      <p>Metin sürümü: {content.privacyVersion}</p>
    </main>
  );
}

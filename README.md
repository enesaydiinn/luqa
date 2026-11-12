# LUQA — Premium Lifestyle Web Platform

LUQA HOME için Next.js App Router, TypeScript ve Supabase temelli Türkçe web platformu. Verilen logo ve ürün konseptleri kullanılmıştır. Fiyat, stok, üretim tarihi veya test edilmemiş dayanıklılık bilgisi üretilmez.

## Hızlı başlangıç

Node.js 24 LTS kullanın (`.nvmrc`). Bağımlılık sürümleri `package-lock.json` ile sabittir.

```sh
npm ci --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Yerel adres: `http://127.0.0.1:3000`. Supabase olmadan dört yerel konsept sunulur. Yönetici alanı özel veri göstermez; talep uç noktası 503 döndürür ve kayıt oluşturulduğunu söylemez.

## Sayfalar ve etkileşimler

- `/`: editorial hero, üç görselli sunum, marka değerleri, öne çıkan ürünler, Signature Q, hikâye ve ön talep.
- `/koleksiyon`: arama, ürün durumu filtresi, sıralama ve duyarlı ürün grid’i.
- `/urun/[slug]`: metadata, galeri, büyütme, hikâye, ölçü/malzeme, bakım, ön talep ve benzer ürünler.
- `/hakkimizda`, `/tasarim`, `/iletisim`: marka anlatımı, iletişim formu ve sorular.
- `/kvkk`, `/gizlilik`, `/cerez`: yapılandırılabilir bilgi ve taslak hukuki metinler.
- `/admin`: güvenli giriş; gerçek verilerle dashboard, ürün ekleme/düzenleme/silme, yayın durumu, koleksiyon atama, görsel yükleme, talep inceleme/durum güncelleme ve içerik yönetimi.
- Arama ve favoriler, ön talep penceresi, mobil menü, çerez tercihleri.

Favoriler yalnızca ziyaretçinin cihazında saklanır. İlk koleksiyonun bütün örnekleri **Konsept Tasarım** statüsündedir. Blossom ve Ivory görselleri, sağlanan ana sayfa referansındaki ürün alanlarından kırpılmıştır; kaynak çözünürlükleri sınırlıdır. Logo, onaylı raster görselden çıkarılmıştır; harfler ve Q yeniden çizilmemiştir.

## Supabase kurulumu

1. Supabase projesi oluşturun. SQL Editor veya Supabase CLI ile `supabase/migrations/202611110001_initial.sql`, ardından `202611110002_dashboard.sql` dosyalarını uygulayın.
2. Konsept kataloğu için `supabase/seed.sql` çalıştırın. Seed yeniden çalıştırılabilir ve fiyat içermez.
3. `.env.local` dosyasına projenizin URL’sini, publishable key’ini ve **yalnızca sunucuda kullanılacak** service role anahtarını ekleyin.
4. `LEAD_RATE_LIMIT_SECRET` için uzun, rastgele bir sunucu sırrı oluşturun. Bu değer IP adresini doğrudan kaydetmeden hız sınırı anahtarı üretir.
5. Supabase Auth üzerinden bir yönetici hesabı oluşturun. Herkese açık kayıt ekranı yoktur. Supabase’in public sign-up ayarını ihtiyacınıza göre kapatın; auth hız sınırlarını etkin tutun. SQL Editor’da yalnızca yetkili hesabı ekleyin:

```sql
insert into public.admin_users(id, display_name)
values ('SUPABASE_AUTH_USER_UUID', 'LUQA Yönetici');
```

6. Auth oturumu, her yönetici API isteğinde `getUser()` ve `admin_users` üyeliğiyle doğrulanır. Şifre/token koda yazılmaz. RLS, normal authenticated kullanıcılara yönetici yetkisi vermez.

Tablolar: `collections`, `products`, `product_images`, `preorders`, `site_settings`, `admin_users`, sunucuya özel `lead_rate_limits`. İndeksler, foreign key’ler, güncelleme trigger’ları ve RLS migration içindedir. `product-images` bucket’ı public görsel okuması ve yalnızca yönetici yüklemesi için hazırlanır.

## Ön talebin açılması

Kayıt için Supabase bağlantısına ek olarak aşağıdakilerin tamamı gerekir:

- Gerçek işletme unvanı, adres ve resmi iletişim e-postasının ortam değişkenlerinde bulunması.
- Taslak KVKK/gizlilik metinlerinin işletmenize göre tamamlanması ve onaylanması.
- `NEXT_PUBLIC_LEGAL_READY=true` ile yeni üretim derlemesi.
- Vercel üzerinde `LEAD_RATE_LIMIT_SECRET` dahil sunucu ortam değişkenleri.

Yayın öncesi `privacyVersion` değerini onaylı metin sürümüyle değiştirin. `LEGAL_READY` bayrağı hukuki metni kendiliğinden tamamlamaz. Supabase bölgesi, veri aktarım koşulları, saklama süreleri ve başvuru kanalı da işletmeye göre kesinleştirilmelidir.

`POST /api/preorders` kaynak kontrolü, 16 KB JSON sınırı, Zod, görünmez bot alanı, form süresi, opsiyonel Turnstile, PostgreSQL’de atomik hız sınırı ve mükerrer kontrolü uygular. Aynı anonimleştirilmiş IP anahtarı 15 dakikada en fazla üç kayıt oluşturabilir. Aynı e-posta ve ürün için 24 saatte ikinci kayıt engellenir. Hız sınırı kayıtları yeni talepler sırasında 24 saat sonra temizlenir. Kesin kişisel veri saklama/silme planı işletme tarafından belirlenmelidir.

Ürünle ilgili kayıt, genel koleksiyon ilgisi için `product_id=null` olabilir. Pazarlama izni ayrı, isteğe bağlı ve varsayılan olarak kapalıdır. Hiçbir ödeme veya sipariş oluşmaz. Supabase yoksa dosyaya veya tarayıcıya gizlice talep kaydedilmez.

Üretimde hız sınırı için Vercel’in güvenilir proxy başlığı kullanılır. Başka bir sunucuda yayınlanırsa `src/app/api/preorders/route.ts` içindeki IP kaynağı, o platformun güvenilir proxy sınırına uyarlanmalıdır; bilinmeyen istemci başlığına güvenilmez.

Opsiyonel Turnstile için hem public site key hem sunucu secret key eklenmelidir. Opsiyonel Resend bildirimi için API key, doğrulanmış gönderici ve yönetici e-postasını yapılandırın. E-posta başarısızlığı, başarıyla oluşturulmuş veritabanı kaydını geri almaz; hata sunucu log’una kişisel veri içermeden yazılır.

## Görseller ve içerik

Ürün görselleri yönetici panelinden JPEG, PNG veya WebP olarak yüklenebilir. Dosya türü gerçek baytlardan kontrol edilir; SVG kabul edilmez. Görseller yeniden kodlanır, metadata çıkarılır ve en fazla 1800 px WebP olarak saklanır. En fazla 5 MB ve 25 megapiksel giriş sınırı vardır. Vercel planının istek boyutu sınırı daha düşükse daha küçük dosya kullanın.

Önce yeni ürünü taslak olarak kaydedin, ardından düzenleyerek görsel yükleyin ve yayınlayın. Talebi bulunan ürünler foreign key nedeniyle silinemez; yayından kaldırılabilir. Görsel kaydını kaldırmak, Storage’daki dosyayı kalıcı olarak silmez; bu dosyalar gerektiğinde Supabase’den temizlenebilir.

Ana içerik ve tema `src/config/content.ts` ve `src/styles/globals.css` içindedir. Yönetilebilir alanlar `site_settings` üzerinden kullanılır. Ürün içeriği veritabanındadır. Türkçe varsayılan içerik, dil desteğinin başlangıç noktasıdır; tam İngilizce çeviri bu sürüme dahil değildir.

## Analytics ve SEO

`NEXT_PUBLIC_GA4_ID` isteğe bağlıdır. Kullanıcı footer’daki Çerez Tercihleri’nden analitiğe izin vermeden GA yüklenmez. `page_view`, `view_item`, `select_item`, `view_collection`, `generate_lead`, `contact_click` olayları hazırdır. Form alanları ve kişisel bilgiler analitik parametrelerine gönderilmez.

Canonical domain `https://helloluqa.com`. Metadata, Open Graph, Twitter, sitemap, robots, Organization, Product ve ürün breadcrumb verileri bulunur. Konseptlerin fiyat/stok/değerlendirme verisi structured data’ya eklenmez. Yönetim sayfası indekslenmez. Lighthouse hedefleri ölçülmüş skor olarak sunulmaz.

## Doğrulama

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Birim/API testleri Zod doğrulaması, katalog verisi, talep kaydı yanıtı, veri tabanı hatası, kaynak kontrolü, hız sınırı/mükerrer yanıtları, yetkisiz erişim ve yetkili ürün işlemlerini kapsar. API veritabanı testlerinde kontrollü mock kullanılır; canlı RLS ve Storage testi yerine geçmez.

Tarayıcı testleri:

```sh
npx playwright install chromium
npm run test:e2e
```

Testler masaüstü ve iPhone boyutunda katalog/filtre, SEO, galeri, talep, favoriler, arama, menü ve yönetim korumasını kapsar. Bu çalışma ortamında Chrome başlatılamadığı için otomatik E2E sonucu başarılı olarak raporlanmamıştır. Etkileşimler ayrıca uygulama içi tarayıcıda kontrol edilmiştir. Ayrıntılar `TEST_REPORT.md` içindedir.

## Vercel ve domain

Tam sunucu uygulaması için `DEPLOYMENT.md` dosyasını izleyin. Next.js üretim build’i hazırdır. Özel Sites yayını yalnızca bağlantısız katalog önizlemesidir; Vercel/Supabase üretim kurulumu veya `helloluqa.com` DNS değişikliği değildir.

```sh
npm run preview:build
```

Bu komut, aynı arayüzün statik önizlemesini `out/` içinde oluşturur; API uç noktalarını çıkarır, analitiği ve gerçek talep kaydını kapatır. Önizlemeyi tam e-ticaret sistemi olarak kullanmayın. Ödeme, stok, kargo ve müşteri hesapları bu sürümde kapsam dışıdır; ürün/collection UUID’leri gelecekteki sipariş tablolarıyla ilişkilendirilebilir.

Resmi başvuru kaynakları: [Next.js 16.4](https://nextjs.org/docs), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Vercel domain kurulumu](https://vercel.com/docs/domains/set-up-custom-domain).

## Onaylı referansa göre tasarım yenilemesi

Ana sayfa, 1536 × 1024 referans kompozisyonuna göre yeniden kuruldu: 34 px duyuru, 71 px navigasyon, 75 px beşli avantaj şeridi, dört yatay detay kartı ve dört ürünün sağında marka hikâyesi. Mobilde yatay kaydırılan detay kartları ve iki sütun ürün düzeni kullanılır. 12 Kasım güncellemesinde ilk hero, kullanıcının doğrudan gönderdiği 1920 × 819 PNG ile değiştirildi. Fotoğraf dosyası değiştirilmez ve Next Image optimizasyonuna alınmaz. Kutunun tamamını göstermek için 1536 px masaüstünde banner 480 px yüksekliğindedir; tablet ve mobilde metin ile aynı özgün fotoğraf alt alta gösterilir.

Yerleşim `src/styles/home.css`, ana sayfa içerikleri `src/config/home-content.ts` içindedir. Temel Latin ve Türkçe karakter font dosyaları birlikte yüklenir. Görsellerin kaynağı ve Imagegen işlemleri `ASSET_NOTES.md` içinde belgelenmiştir. UI yenilemesinde veritabanı şeması veya servis yetkileri değiştirilmemiştir. Güncellenen seed yalnızca örnek kapak görsellerini aynı ürünlerin yeni dosyalarına yönlendirir; mevcut bir veritabanına kendiliğinden uygulanmaz.

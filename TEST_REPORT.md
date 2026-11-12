# LUQA doğrulama raporu

Tarih: 11 Kasım 2026, Europe/Istanbul.

| Kontrol | Sonuç |
| --- | --- |
| TypeScript | Geçti |
| ESLint | Geçti |
| Vitest | 27 test geçti |
| Next.js üretim build | Geçti — 22 sayfa/route üretim işlemi, Node 24, webpack |
| Statik katalog önizleme export | Geçti |
| Üretim bağımlılık denetimi | `npm audit --omit=dev --audit-level=high`: 0 güvenlik açığı |
| Yetkisiz `/api/admin` | Gerçek yerel HTTP isteğinde 401; özel kayıt dönmedi |
| Chrome tabanlı otomatik E2E | Çalıştırma denendi; ortam Chrome’u SIGABRT ile kapattı, uygulama testlerine geçilemedi |
| Lighthouse | Ölçülmedi; skor iddiası yok |
| Canlı Supabase / RLS / Storage / Auth / e-posta | Servis anahtarları olmadığı için canlı entegrasyon doğrulanmadı |

Uygulama içi tarayıcıda kontrol edilenler (666 px viewport):

- Koleksiyon dört konsept gösteriyor; satışta filtresi doğru boş sonuç gösteriyor.
- Heritage favoriye ekleniyor ve favori penceresinde listeleniyor.
- Aramada “Ivory” tek ürün döndürüyor.
- Mobil menü açılıp koleksiyon sayfasına geçiyor.
- Heritage ürün sayfası, tasarım durumu ve konsept bildirimiyle açılıyor.
- Galeri büyük görsel penceresini açıp kapatıyor.
- Ön talepte Heritage otomatik seçiliyor; boş ad/e-posta ve zorunlu bilgilendirme doğrulanıyor.
- Pazarlama izni varsayılan olarak boş.
- Geçerli test bilgileri gönderildiğinde bağlantısız sunucu “Ön talep kaydı henüz açılmadı. Kaydınız oluşturulmadı.” yanıtı veriyor.
- Yönetim sayfasında oturum kontrolü sonrası yalnızca giriş formu görünüyor; dashboard görünmüyor.
- Yönetim sayfasında canonical `https://helloluqa.com/admin`; 666 px genişlikte yatay taşma yok.

Birim/API testlerinde veritabanı mock’u kullanılır. Bu testler gerçek PostgreSQL fonksiyonunun eşzamanlılık davranışını, canlı RLS politikalarını veya üçüncü taraf servislerini doğrulamış sayılmaz. Yayın sonrası gerçek Supabase hesabıyla kontrol edilmelidir. Otomatik 390 px / 1440 px E2E senaryoları `tests/e2e` içinde hazırdır; başarılı oldukları iddia edilmez.

## Yayın durumu

Özel Sites kaydı oluşturuldu; kaynak eşitleme yardımcısına standart girdiden bilgi gönderme işlemi otomatik onay denetiminde sandbox_approval kategorisi kapalı olduğu için engellendi. Projenin .git klasörü için verilen ek izin de engeli gidermedi. Kaynak push, sürüm kaydı ve deploy tamamlanmadı. Bir canlı URL doğrulanmadı. helloluqa.com DNS kayıtları değiştirilmedi. Yerel uygulama ve kaynak paket teslim edildi.

## Referans tasarım yenilemesi — 11 Kasım 2026

Ana sayfa yeniden oluşturuldu. Duyuru/header/hero/avantaj/detay kartı/ürün alanı düzeni, onaylı 1536 × 1024 görselle karşılaştırıldı ve birkaç tur düzeltildi. Menü, arama ve favori pencereleri, ürün detayı, otomatik seçilen ürünle ön talep formu ve boş alan doğrulamaları uygulama içi tarayıcıda kontrol edildi. Mobil menüden koleksiyona geçiş ve Satışta filtresinin boş sonuç vermesi doğrulandı. UI yenilemesinden sonra 27 test, lint ve TypeScript kontrolleri geçti.

Komut satırı Chrome Headless Shell de denendi; macOS sandbox içindeki Mach port izni reddedildiği için otomatik E2E başlatılamadı. Görsel doğrulama bunun yerine uygulama içi tarayıcının viewport yeteneğiyle yapıldı. Gerçek DOM viewport ölçüsü ve çıktı görsel boyutları birlikte kontrol edildi. Üretim sunucusunda 1536 × 1024 masaüstü, 390 × 844 mobil ve 834 × 1112 tablet görselleri kaydedildi. Yatay sayfa taşması yok; mobil detay şeridi kendi içinde kaydırılabilir.

Kaynak eşitleme yardımcısına standart girdiden bilgi iletme işlemi yine otomatik onay denetiminde engellendi; canlı yayın tamamlandığı iddia edilmez. Veritabanı şeması, Auth ve ön talep API davranışı değiştirilmedi. Gerçek Supabase servis testi önceki gibi harici servis erişimine bağlıdır.

## Özgün hero fotoğrafı — 12 Kasım 2026

Kullanıcının son gönderdiği 1920 × 819 PNG, ana sayfanın ilk banner'ına doğrudan bağlandı. Kaynak ile projedeki dosyanın SHA-256 değerleri eşleşti (`79fcea1e254662d19c2ac582a897a39887416f858e8e11d30c15f482f10aeeb3`). Tarayıcı DOM'unda görselin doğrudan `/images/home/luqa-hero-original.png` adresinden ve özgün boyutlarıyla yüklendiği doğrulandı. Eski hero/mobil kırpmaları ve ek kumaş katmanı artık bileşende kullanılmıyor.

- Üretim build (TypeScript dahil), ESLint ve statik katalog export geçti.
- Uygulama içi tarayıcıda 1536 × 1024, 390 × 844, 834 × 1112 ve ara 1024 px genişlik görsel olarak kontrol edildi. Kutunun bütünü ve Q kilidi görünüyor.
- Üç teslim viewport'unda yatay sayfa taşması yok. Masaüstü hero yüksekliği 480 px; mobilde metin ve fotoğraf alt alta.
- `design/VERIFIED_LAYOUT.json` güncel ölçümleri içerir. Önceki 370 px hero ölçümü referans yenilemesinin tarihsel durumudur.
- Bu değişiklik yalnızca görsel bileşeni, CSS ve dosya kaynağını kapsar; API/DB davranışı değişmedi. Daha önceki canlı servis ve yayın kısıtları devam eder.

# LUQA üretim kurulumu

## 1. Servisler

Supabase migration ve seed adımlarını README’ye göre uygulayın. Auth üzerinden yetkili yöneticiyi oluşturun; anon veya sıradan authenticated kullanıcıyla `preorders` okumasının ve doğrudan insert’ün reddedildiğini doğrulayın. Storage yüklemesini yetkili yöneticiyle kontrol edin. Bu işlem için gerçek Supabase erişimi gerekir; henüz uygulanmamıştır.

## 2. Vercel

Kaynak projeyi kendi Git deponuza alın ve Vercel’e import edin. Proje kökü bu klasördür. Framework Next.js, Node 24, install komutu `npm ci --legacy-peer-deps`, build komutu `npm run build`; çıktı klasörünü Next.js varsayılanında bırakın. `vercel.json` bu komutları tanımlar. `out/` Sites önizlemesine aittir ve Vercel server uygulaması için çıktı klasörü olarak seçilmemelidir.

`.env.example` dosyasındaki gerekli değişkenleri Vercel Environment Variables alanına girin. `SUPABASE_SERVICE_ROLE_KEY`, `LEAD_RATE_LIMIT_SECRET`, Turnstile ve Resend sırlarını yalnızca sunucu anahtarları olarak tutun. `NEXT_PUBLIC_` değerleri tarayıcıya gönderilir. Public değişkenler değiştiğinde yeniden deploy edin.

Başlangıçta `NEXT_PUBLIC_LEGAL_READY=false` bırakın. Hukuki metinler ve işletme bilgileri kesinleştiğinde bunları doldurup bayrağı açın. `NEXT_PUBLIC_SITE_URL` değerini Vercel'de seçili ana domain ile birebir eşleştirin. 12 Kasım'da doğrulanan yayında kök domain `www` adresine yönlendiği için bu değer `https://www.helloluqa.com` olmalıdır. Vercel’in geçici URL’sinde form testi yapacaksanız o ortamın URL’sini açıkça yapılandırın; üretim dışında geniş wildcard origin kabul etmeyin.

Supabase Auth Site URL’sini ana domain olarak yapılandırın. Bu sürüm e-posta/parola yönetici girişi kullanır; herkese açık hesap kaydı sunmaz. Şifre sıfırlama işlemleri Supabase’in yönetim ve e-posta ayarlarıyla ayrıca hazırlanmalıdır.

## 3. DNS ve HTTPS

Vercel projesine hem `helloluqa.com` hem `www.helloluqa.com` ekleyin. Settings → Domains altında tek bir ana domain seçin ve diğerini yalnızca o domaine yönlendirin. Uygulama içinde www/kök domain yönlendirmesi tanımlamayın; domain yönlendirmesinin sahibi yalnızca yayın platformu olmalıdır.

12 Kasım'da canlı yanıtlarda `helloluqa.com → www.helloluqa.com` ve uygulama kuralından gelen `www.helloluqa.com → helloluqa.com` şeklinde iki ters 308 yönlendirmesi doğrulandı. Uygulamadaki ters kural kaldırıldı. Mevcut panel ayarıyla beklenen zincir `https://helloluqa.com → https://www.helloluqa.com → 200` şeklindedir. Değişikliğin canlıya yansıması için yeni commit'in Vercel deploy'u tamamlanmalıdır. Safari eski kalıcı yönlendirmeyi saklıyorsa yeni deploy sonrasında önce özel pencerede deneyin.

DNS sağlayıcısına eklenecek kayıtların **tam hedef değerleri**, bu Vercel projesinin Settings → Domains ekranından alınmalıdır. Bu değerler proje oluşturulmadan doğrulanamaz; aşağıdaki tabloda gerçek değerler uydurulmamıştır.

| Tür | Ad | Hedef |
| --- | --- | --- |
| A | `@` | Vercel’in `helloluqa.com` için gösterdiği IPv4 adresi |
| CNAME | `www` | Vercel’in projeye özgü gösterdiği CNAME hedefi |
| TXT | Vercel isterse gösterilen ad | Domain sahiplik doğrulaması için gösterilen tam metin |

Vercel DNS doğrulaması tamamlandıktan sonra HTTPS sertifikasını doğrulayın. Mevcut e-posta MX/SPF/DKIM kayıtlarını web domain kurulumu sırasında değiştirmeyin. Bu çalışma sırasında domain hesabına erişilmemiş, hiçbir DNS veya Vercel hesap ayarı değiştirilmemiştir.

Kaynak: [Vercel — Custom domain kurulumu](https://vercel.com/docs/domains/set-up-custom-domain), [Vercel — Domain ekleme](https://vercel.com/docs/domains/working-with-domains/add-a-domain). Vercel, proje için gösterilen DNS değerlerinin kullanılmasını önerir; sabit örnek IP/CNAME’ler bu projenin doğrulanmış kayıtları değildir.

## 4. Yayın sonrası doğrulama

Üretimde gerçek test hesabıyla yönetici oturumu, ürün ekleme/düzenleme/yayından kaldırma, görsel yükleme, ön talep insert, mükerrer ve hız sınırı, talep durumu güncelleme ve varsa bildirim e-postasını kontrol edin. Test kişisel verilerini silmek için işletmenizin kayıt temizleme sürecini kullanın. Normal ziyaretçiyle özel API ve tablolara erişimin reddedildiğini doğrulayın. Son olarak mobil tarayıcılar ve Lighthouse ölçümlerini yapın.

Tam uygulama Node üzerinde çalışır; Sites yayını yalnızca özel statik tasarım/katalog önizlemesidir. Sites erişim kitlesi sahibiyle sınırlı bırakılır.

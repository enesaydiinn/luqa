# Onaylı LUQA ana sayfa analizi

Referans: 1536 × 1024. Mevcut yüksek ve iki sütuna bölünmüş hero yerine, referanstaki kısa ve bütünleşik fotoğraf kompozisyonu uygulandı. Geniş editorial boşluklar kaldırıldı. Ürünler ve marka hikâyesi tek sırada konumlandırıldı.

| Bölüm | Referans başlangıcı | Hedef yükseklik |
| --- | --- | --- |
| Duyuru | y = 0 | 34 px |
| Navigasyon | y = 34 | 71 px |
| Hero | y = 105 | 370 px |
| Avantajlar | y = 475 | 75 px |
| Dört detay kartı alanı | y = 550 | 182 px |
| Öne çıkan ürünler başlığı | y = 732 | 56 px |
| Ürün görselleri ve sağdaki hikâye | y = 788 | İçeriğe göre |

Sol logo yaklaşık 160 px genişliğinde, yatay menü 15 px, hero başlığı 54 px Cormorant Garamond, gövde 16 px Manrope, bölüm başlığı 32 px. İnce bronz ayraçlar, keskin bronz CTA, 11–14 px kart köşe yarıçapları ve bej/krem geçişleri korundu. Sadece aktif arama ve favori ikonları ile mevcut ön talep işlemi gösterilir. Sepet ve hesap simgesi eklenmedi. Doğrulanmamış ücretsiz kargo, stok, fiyat, çizilmezlik veya teslimat iddiası eklenmedi.

Aynı sayfada bağımsız fotoğraf kırpmaları ve gerçek HTML bileşenleri kullanılır. Tam referans ekranı hiçbir hero veya bölüm arka planı olarak gösterilmez. Ürün kapağı, katalog ve galeri arasında aynı varyasyonla eşleşir.

Kontrol boyutları: 1536 × 1024 masaüstü, 390 × 844 mobil ve 834 × 1112 tablet. Uygulama içi tarayıcının ekran ölçeği nedeniyle viewport ayarı fiziksel boyuttan farklı olabildiğinden, doğrulamada DOM `innerWidth/innerHeight` ve gerçek çıktı dosyası boyutları birlikte kaydedilir. Komut satırı Chromium'unun Mach port izni hatası, uygulama içi tarayıcıda bu boyutların doğrulanmasını engellemez.

## 12 Kasım: özgün fotoğrafa geçiş

Kullanıcının yeni sağladığı 1920 × 819 fotoğraf ilk hero'da doğrudan kullanılır. Eski 370 px referans banner'ının yerine kutuyu kesmeyen 480 px banner (1536 px genişlikte) uygulanır. Fotoğrafa birleştirilmiş kumaş katmanı ve ayrı mobil kaynak kaldırılmıştır. 1000 px ve altında metin fotoğrafın üstünde ayrı akıştadır. Güncel gerçek ölçümler VERIFIED_LAYOUT.json içindedir.

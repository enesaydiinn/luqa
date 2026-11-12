# Ana sayfa görselleri

Onaylı tasarım kaynağı: kullanıcının `web_ana_sayfa_tasarim_referansi.png` görseli (1536 × 1024). Tam sayfa görseli hiçbir HTML bölümünün arka planı olarak kullanılmaz. Menü, metin, buton ve ürün kartları gerçek bileşenlerdir.

Dört detay kartı ve hikâye çiçekleri yalnızca yazı içermeyen fotoğraf bölgelerinden bağımsız olarak kırpılmıştır. İlk hero için daha önce hazırlanan hero/kumaş kırpmaları artık kullanılmıyor. `scripts/prepare-home-assets.mjs` kırpma koordinatlarını içerir. Görseller CSS object-fit ile oranları korunarak gösterilir.

Ürün kutularının bütün varyasyonları için yüksek çözünürlüklü bağımsız kaynak fotoğraflar bulunmuyordu. Bu yüzden Blossom, Ivory ve Garden için onaylı referanstaki ilgili ürün karesi temel alınarak built-in Imagegen ile yüksek çözünürlüklü konsept rekonstrüksiyonları hazırlandı. Bu görseller fiziksel ürün fotoğrafı değildir; mikro detaylar nihai üretim bilgisi olarak değerlendirilmemelidir. Heritage için mevcut özgün LUQA ürün görseli tercih edildi; üretilen Heritage varyantı kullanılmadı.

Kullanılan dosyalar:

- `public/images/home/heritage-clean.webp`: mevcut özgün LUQA Heritage kaynağı, Q kilidi korunarak.
- `public/images/home/blossom-clean.webp`: pembe/beyaz çiçekli Blossom konsepti.
- `public/images/home/ivory-clean.webp`: krem/altın tonlu Ivory konsepti.
- `public/images/home/garden-clean.webp`: beyaz/altın çiçekli şeffaf Garden konsepti.

Üç rekonstrüksiyon 1200 × 750 WebP olarak projeye kaydedildi. Ürün galerisi, katalog ve ana sayfa aynı varyasyonun aynı kapak görselini kullanır. Rastgele stok görsel, harici Unsplash bağlantısı, örnek fiyat veya işlevsiz kullanıcı/sepet ikonu eklenmedi. Onaylı logo görseli değiştirilmedi.

## Imagegen prompt seti

Built-in tool mode kullanıldı; CLI/API anahtarı kullanılmadı. Her varyasyon için kendi ürün kırpması edit target olarak verildi. Ortak prompt aşağıdadır; `NAME` alanı Blossom, Ivory veya Garden olarak değiştirildi.

> Use case: precise-object-edit. This is the edit target for LUQA NAME: a real supplied concept product photo cropped from the approved LUQA web design. Make a clean catalog photograph for a website. Remove ONLY the small black outlined heart UI icon in the upper-right corner and reconstruct the beige photo background behind it. Restore fine photographic clarity at a high-resolution approximately 1536x960 landscape output. Preserve the exact single rectangular glass keepsake box, its proportions and perspective, its same gold metal frame, same feet, same floral decoration positions and colors, same translucent panels, and same signature Q-shaped clasp. Keep the same camera angle and warm neutral beige tabletop and background. Keep the whole box fully in frame at the same relative size. Do not redesign or simplify the product, add flowers, change colors, add a second object, or add new branding. Preserve existing tiny LUQA branding where visible. No new text, labels, heart, UI, border, watermark or graphic elements. The invariant is the original product photo and colorway; the only intentional object removal is the small favorite heart icon.

## 12 Kasım 2026 — Kullanıcının özgün hero fotoğrafı

Ana sayfanın ilk banner görseli, kullanıcının son gönderdiği `Lüks Çiçekli LUQA Mücevher Kutusu.png` dosyasıdır (1920 × 819). `public/images/home/luqa-hero-original.png` dosyasına byte-byte kopyalanmıştır. Yeniden üretim, rötuş, görsel birleştirme veya dosya sıkıştırması yapılmadı. Next Image için bu görselde optimizasyon kapalıdır; tarayıcı doğrudan özgün PNG dosyasını alır. Eski mobil hero ve ek kumaş katmanı bileşenden kaldırıldı. Yalnızca CSS ile, ürünün tamamını görünür tutacak responsive kadraj uygulanır.

import sharp from "sharp";
import { resolve } from "node:path";
const source = "/Users/enesaydin/Desktop/LUQA_Codex_Baslangic_Paketi/assets";
const out = resolve("public/images");
await Promise.all([
  sharp(`${source}/branding/luqa_wordmark_reference.png`)
    .extract({ left: 292, top: 376, width: 960, height: 300 })
    .resize(490)
    .webp({ quality: 95 })
    .toFile(`${out}/wordmark.webp`),
  sharp(`${source}/products/heritage_box_concept.webp`)
    .webp({ quality: 92 })
    .toFile(`${out}/heritage.webp`),
  sharp(`${source}/products/glass_box_concept.webp`)
    .webp({ quality: 92 })
    .toFile(`${out}/glass.webp`),
  sharp(`${source}/products/floral_detail_concept.webp`)
    .webp({ quality: 90 })
    .toFile(`${out}/floral.webp`),
  sharp(`${source}/references/urun_tasarim_koleksiyon_referansi.png`)
    .extract({ left: 238, top: 668, width: 299, height: 220 })
    .resize(900, 700, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(`${out}/signature.webp`),
  sharp(`${source}/references/web_ana_sayfa_tasarim_referansi.png`)
    .extract({ left: 304, top: 789, width: 235, height: 145 })
    .resize(640, 540, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(`${out}/blossom.webp`),
  sharp(`${source}/references/web_ana_sayfa_tasarim_referansi.png`)
    .extract({ left: 556, top: 790, width: 222, height: 144 })
    .resize(640, 540, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(`${out}/ivory.webp`),
  sharp(`${source}/references/marka_kimligi_referansi.png`)
    .extract({ left: 529, top: 691, width: 536, height: 314 })
    .resize(900, 1100, { fit: "cover", position: "centre" })
    .webp({ quality: 90 })
    .toFile(`${out}/lifestyle.webp`),
  sharp(`${source}/references/marka_kimligi_referansi.png`)
    .extract({ left: 31, top: 690, width: 1473, height: 314 })
    .resize(1600)
    .webp({ quality: 90 })
    .toFile(`${out}/lifestyle-wide.webp`),
  sharp(`${source}/branding/luqa_wordmark_reference.png`)
    .resize(64, 64, { fit: "cover" })
    .png()
    .toFile("src/app/icon.png"),
]);
console.log(
  "10 optimized reference assets prepared. No product designs altered.",
);

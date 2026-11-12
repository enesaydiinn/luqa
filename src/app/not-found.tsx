import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="error-page">
      <span className="eyebrow">404 · YOLUNUZU YENİDEN BULUN</span>
      <h1>
        Bu sayfa henüz
        <br />
        <em>hikâyemizde yok.</em>
      </h1>
      <p>Koleksiyonumuzda sizi bekleyen parçaları keşfedin.</p>
      <Link href="/koleksiyon" className="button">
        Koleksiyona Dön ↗
      </Link>
    </main>
  );
}

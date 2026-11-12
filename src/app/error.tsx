"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="error-page">
      <h1>Kısa bir ara.</h1>
      <p>Sayfa şu anda yüklenemiyor. Lütfen tekrar deneyin.</p>
      <button className="button" onClick={reset}>
        Tekrar Dene ↗
      </button>
    </main>
  );
}

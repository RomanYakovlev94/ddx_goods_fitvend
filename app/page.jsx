/* eslint-disable @next/next/no-img-element */
"use client";

const APPARATUS_QUERY_KEYS = ["apparatusId", "apparatus_id", "id"];

export default function HomePage() {
  const handleCatalogClick = (event) => {
    event.preventDefault();
    window.location.href = buildCatalogHref(window.location.search, window.location.hostname);
  };

  return (
    <main className="home-page" aria-label="Ассортимент вендинга">
      <div className="home-artboard">
        <img src="/assets/home-ddx-logo.webp" alt="DDX Fitness" className="home-ddx-logo" />
        <img src="/assets/home-title.webp" alt="Ассортимент вендинга" className="home-title-image" />
        <img src="/assets/home-arrow.webp" alt="Тыкни сюда" className="home-arrow-image" />
        <img src="/assets/home-hand-icon.webp" alt="" className="home-hand-image" aria-hidden="true" />

        <a href="/catalog" className="home-vending-link" aria-label="Перейти к списку товаров" onClick={handleCatalogClick}>
          <img src="/assets/vending.webp" alt="Вендинговый аппарат Fitvend" className="home-vending-image" />
          <span className="home-vending-link-label">Перейти к списку товаров</span>
        </a>

        <img src="/assets/home-fitvend-logo.webp" alt="Fitvend" className="home-fitvend-logo" />
      </div>
    </main>
  );
}

function buildCatalogHref(search, hostname) {
  const apparatusId = getApparatusIdFromSearch(search);
  const catalogPath = isLocalHost(hostname) ? "/catalog" : "catalog.html";

  return apparatusId ? `${catalogPath}?apparatusId=${encodeURIComponent(apparatusId)}` : catalogPath;
}

function getApparatusIdFromSearch(search) {
  const params = new URLSearchParams(search);

  for (const key of APPARATUS_QUERY_KEYS) {
    const value = params.get(key)?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

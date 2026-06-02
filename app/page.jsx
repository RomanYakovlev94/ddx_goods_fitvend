/* eslint-disable @next/next/no-img-element */
export default function HomePage() {
  return (
    <main className="home-page" aria-label="Ассортимент вендинга">
      <div className="home-artboard">
        <img src="/assets/home-ddx-logo.webp" alt="DDX Fitness" className="home-ddx-logo" />
        <img src="/assets/home-title.webp" alt="Ассортимент вендинга" className="home-title-image" />
        <img src="/assets/home-arrow.webp" alt="Тыкни сюда" className="home-arrow-image" />
        <img src="/assets/home-hand-icon.webp" alt="" className="home-hand-image" aria-hidden="true" />

        <a href="/catalog" className="home-vending-link" aria-label="Перейти к списку товаров">
          <img src="/assets/vending.webp" alt="Вендинговый аппарат Fitvend" className="home-vending-image" />
          <span>Перейти к списку товаров</span>
        </a>

        <img src="/assets/home-fitvend-logo.webp" alt="Fitvend" className="home-fitvend-logo" />
      </div>
    </main>
  );
}

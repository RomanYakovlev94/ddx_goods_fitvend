/* eslint-disable @next/next/no-img-element */
export default function HomePage() {
  return (
    <main className="home-page" aria-label="Ассортимент вендинга">
      <div className="home-artboard">
        <img src="/assets/home-reference.jpeg" alt="" className="home-reference-image" aria-hidden="true" />
        <a href="/catalog" className="home-vending-link" aria-label="Перейти к списку товаров">
          <span>Перейти к списку товаров</span>
        </a>
      </div>
    </main>
  );
}

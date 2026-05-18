/* eslint-disable @next/next/no-img-element */
export default function HomePage() {
  return (
    <main className="exact-shell" aria-label="Ассортимент вендинга">
      <img
        src="assets/screen-home.png"
        alt="DDX Fitness ассортимент вендинга"
        className="exact-screen"
      />
      <a href="catalog.html" className="home-vending-hotspot" aria-label="Перейти к списку товаров">
        <span>Перейти к списку товаров</span>
      </a>
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
export default function HomePage() {
  return (
    <main className="exact-shell" aria-label="Ассортимент вендинга">
      <div className="exact-screen-crop">
        <img
          src="assets/screen-home.webp"
          alt="DDX Fitness ассортимент вендинга"
          className="exact-screen"
        />
      </div>
      <a href="/catalog" className="home-vending-hotspot" aria-label="Перейти к списку товаров">
        <span>Перейти к списку товаров</span>
      </a>
    </main>
  );
}

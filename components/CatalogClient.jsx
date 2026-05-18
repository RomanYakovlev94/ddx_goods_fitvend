/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

export default function CatalogClient({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!selectedProduct) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProduct]);

  return (
    <main className="catalog-page" aria-label="Fitness лето">
      <CatalogHeader />

      <section className="goods-grid" aria-label="Список товаров">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={() => setSelectedProduct(product)}
          />
        ))}
      </section>

      {selectedProduct ? (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      ) : null}
    </main>
  );
}

function CatalogHeader() {
  return (
    <header className="catalog-heading">
      <img src="assets/catalog-header.png" alt="Fitness лето" className="catalog-header-image" />
      <a href="index.html" className="catalog-back-area" aria-label="Назад к вендингу">
        <span>Назад к вендингу</span>
      </a>
    </header>
  );
}

function ProductCard({ product, onOpen }) {
  const title = getProductTitle(product);

  return (
    <button type="button" className="good-card" onClick={onOpen}>
      <div className="good-image-frame">
        <img src={product.img_path} alt={title} className="good-image" loading="lazy" />
      </div>
      <div className="good-copy">
        <ProductTitle product={product} />
      </div>
    </button>
  );
}

function ProductModal({ product, onClose }) {
  const title = getProductTitle(product);
  const description = cleanInfoText(product.extra_info?.description, "description");
  const composition = cleanInfoText(product.extra_info?.composition, "composition");
  const cpf = cleanInfoText(product.extra_info?.cpf, "cpf");
  const hasDetails = cpf || composition;

  return (
    <div className="product-modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="product-modal-shell">
        <header className="catalog-heading modal-heading">
          <img src="assets/catalog-header.png" alt="Fitness лето" className="catalog-header-image" />
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Закрыть карточку товара"
          >
            ×
          </button>
        </header>

        <article className="product-detail-card">
          <div className="product-detail-top">
            <div className="detail-image-frame">
              <img src={product.img_path} alt={title} className="detail-product-image" />
            </div>
            <ProductTitle product={product} />
          </div>

          {description ? (
            <div className="detail-bubble">
              <p>{description}</p>
            </div>
          ) : null}

          {hasDetails ? (
            <section className="detail-info">
              {cpf ? (
                <>
                  <h3>КБЖУ</h3>
                  <p className="detail-cpf">{cpf}</p>
                </>
              ) : null}

              {composition ? (
                <>
                  <h3>Состав:</h3>
                  <p className="detail-composition">{composition}</p>
                </>
              ) : null}
            </section>
          ) : null}
        </article>
      </div>
    </div>
  );
}

function ProductTitle({ product }) {
  const brand = cleanInfoText(product.brand?.name);
  const rest = [product.nameseria?.name, product.taste].map((part) => cleanInfoText(part)).filter(Boolean);
  const restTitle = rest.join(" ");

  if (!restTitle) {
    return (
      <h2>
        <span>{brand}</span>
      </h2>
    );
  }

  const lastSpaceIndex = restTitle.lastIndexOf(" ");
  const restMain = lastSpaceIndex === -1 ? "" : restTitle.slice(0, lastSpaceIndex);
  const restAccent = lastSpaceIndex === -1 ? restTitle : restTitle.slice(lastSpaceIndex + 1);

  return (
    <h2>
      {brand ? <span className="title-brand">{brand}</span> : null}
      <span className="title-rest">
        {restMain ? `${restMain} ` : null}
        <span className="title-accent">{restAccent}</span>
      </span>
    </h2>
  );
}

function getProductTitle(product) {
  return [product.brand?.name, product.nameseria?.name, product.taste]
    .map((part) => cleanInfoText(part))
    .filter(Boolean)
    .join(" ");
}

function cleanInfoText(value, fieldName) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value).replace(/\s+/g, " ").trim();
  const normalized = text.toLowerCase();
  const blocked = new Set([
    "description",
    "cpf",
    "composition",
    "кбжу",
    "состав",
    "состав:",
  ]);

  if (!text || normalized === fieldName || blocked.has(normalized)) {
    return "";
  }

  return text;
}

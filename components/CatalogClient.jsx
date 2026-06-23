/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

const CATALOG_MENU_ITEMS = [
  {
    controlId: "catalog-filter-water",
    label: "Вода",
    slug: "water",
  },
  {
    controlId: "catalog-filter-functional",
    label: "Функциональные напитки",
    slug: "functional",
  },
  {
    controlId: "catalog-filter-snack",
    label: "Снеки",
    slug: "snack",
  },
  {
    controlId: "catalog-filter-other",
    label: "Прочее",
    slug: "other",
  },
];

const APPARATUS_QUERY_KEYS = ["apparatusId", "apparatus_id", "id"];
const PUBLIC_ASSORTMENT_ENDPOINT = "https://vd.fitvend.fit/api/listing/public-assortment";
const PUBLIC_ASSORTMENT_TOKEN = "nwPoeP7n3h7l1DAieq+CnTK3gVqmSPJUWWI4rQtRpBQ=";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function CatalogClient({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [catalogState, setCatalogState] = useState({
    message: "Загружаем ассортимент",
    products: [],
    status: "loading",
  });

  useEffect(() => {
    const apparatusId = getApparatusIdFromSearch(window.location.search);

    if (!apparatusId) {
      queueCatalogStateUpdate(setCatalogState, {
        message: "ID аппарата не передан",
        products: [],
        status: "error",
      });
      return undefined;
    }

    if (!isUuid(apparatusId)) {
      queueCatalogStateUpdate(setCatalogState, {
        message: "Некорректный ID аппарата",
        products: [],
        status: "error",
      });
      return undefined;
    }

    const controller = new AbortController();

    fetch(`${PUBLIC_ASSORTMENT_ENDPOINT}/${encodeURIComponent(apparatusId)}`, {
      headers: {
        Authorization: `Bearer ${PUBLIC_ASSORTMENT_TOKEN}`,
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new PublicAssortmentError(response.status);
        }

        const productIds = normalizeAssortmentIds(await response.json());
        const allowedIds = new Set(productIds);
        const filteredProducts = products.filter((product) => allowedIds.has(normalizeId(product.id)));

        setCatalogState({
          message: filteredProducts.length ? "" : "В этом аппарате нет доступных товаров",
          products: filteredProducts,
          status: filteredProducts.length ? "ready" : "empty",
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setCatalogState({
          message: getPublicAssortmentErrorMessage(error),
          products: [],
          status: "error",
        });
      });

    return () => controller.abort();
  }, [products]);

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
      <CatalogFilterControls />
      <CatalogMenu />

      {catalogState.products.length ? (
        <section className="goods-grid" aria-label="Список товаров">
          {catalogState.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => setSelectedProduct(product)}
            />
          ))}
        </section>
      ) : (
        <CatalogStateMessage message={catalogState.message} status={catalogState.status} />
      )}

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

function CatalogFilterControls() {
  return (
    <>
      <input
        className="catalog-filter-control"
        type="radio"
        name="catalog-filter"
        id="catalog-filter-all"
        defaultChecked
      />
      {CATALOG_MENU_ITEMS.map((item) => (
        <input
          key={item.controlId}
          className="catalog-filter-control"
          type="radio"
          name="catalog-filter"
          id={item.controlId}
        />
      ))}
    </>
  );
}

function CatalogMenu() {
  const menuRef = useRef(null);

  const closeMenu = () => {
    window.requestAnimationFrame(() => {
      menuRef.current?.removeAttribute("open");
    });
  };

  return (
    <details className="catalog-menu" ref={menuRef}>
      <summary className="catalog-menu-toggle" aria-label="Открыть меню категорий">
        <span />
        <span />
        <span />
      </summary>

      <nav className="catalog-menu-panel" aria-label="Категории товаров">
        {CATALOG_MENU_ITEMS.map((item) => (
          <label
            key={item.controlId}
            className="catalog-menu-item"
            data-category={item.label}
            htmlFor={item.controlId}
            onClick={closeMenu}
          >
            {item.label}
          </label>
        ))}
      </nav>
    </details>
  );
}

function CatalogStateMessage({ message, status }) {
  return (
    <section className={`catalog-state catalog-state-${status}`} aria-live="polite">
      {message}
    </section>
  );
}

function ProductCard({ product, onOpen }) {
  const pointerStartRef = useRef(null);
  const title = getProductTitle(product);
  const subcategoryClass = `subcategory-${getSubcategorySlug(product.subcategory?.name)}`;

  const handlePointerDown = (event) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event) => {
    if (!pointerStartRef.current) {
      return;
    }

    const deltaX = Math.abs(event.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(event.clientY - pointerStartRef.current.y);
    pointerStartRef.current = null;

    if (deltaX <= 8 && deltaY <= 8) {
      onOpen();
    }
  };

  return (
    <button
      type="button"
      className={`good-card ${subcategoryClass}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={onOpen}
    >
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

function queueCatalogStateUpdate(setCatalogState, nextState) {
  window.queueMicrotask(() => setCatalogState(nextState));
}

function normalizeAssortmentIds(value) {
  if (!Array.isArray(value)) {
    throw new PublicAssortmentError(0);
  }

  return value
    .filter((id) => typeof id === "string" && isUuid(id))
    .map((id) => normalizeId(id));
}

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isUuid(value) {
  return UUID_PATTERN.test(String(value ?? "").trim());
}

function getPublicAssortmentErrorMessage(error) {
  if (error instanceof PublicAssortmentError) {
    switch (error.status) {
      case 400:
        return "Некорректный ID аппарата";
      case 401:
        return "Нет доступа к ассортименту";
      case 404:
        return "Аппарат не найден";
      default:
        return "Не удалось загрузить ассортимент";
    }
  }

  return "Не удалось загрузить ассортимент";
}

class PublicAssortmentError extends Error {
  constructor(status) {
    super(`Public assortment request failed with status ${status}`);
    this.name = "PublicAssortmentError";
    this.status = status;
  }
}

function getSubcategorySlug(subcategoryName) {
  switch (subcategoryName) {
    case "Вода":
      return "water";
    case "Функциональные напитки":
      return "functional";
    case "Снек":
      return "snack";
    case "Прочее":
      return "other";
    default:
      return "none";
  }
}

import CatalogClient from "@/components/CatalogClient";
import fallbackGoods from "@/data/goods.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function CatalogPage() {
  const goods = readGoods();

  return <CatalogClient products={goods} />;
}

function readGoods() {
  try {
    const goodsPath = join(process.cwd(), "goods.json");
    const rawGoods = readFileSync(goodsPath, "utf8").trim();

    if (!rawGoods) {
      return fallbackGoods;
    }

    return JSON.parse(rawGoods);
  } catch {
    return fallbackGoods;
  }
}

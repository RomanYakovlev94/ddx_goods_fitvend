import CatalogClient from "@/components/CatalogClient";
import fallbackGoods from "@/data/goods.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function CatalogPage() {
  const goods = sortGoodsByNewest(readGoods());

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

function sortGoodsByNewest(goods) {
  return [...goods].sort((a, b) => getGoodTimestamp(b) - getGoodTimestamp(a));
}

function getGoodTimestamp(good) {
  const source = `${good.img_name ?? ""} ${good.img_path ?? ""}`;
  const match = source.match(/-(\d{10,})\.(?:png|jpe?g|webp)(?:\?|\s|$)/i);

  return match ? Number(match[1]) : 0;
}

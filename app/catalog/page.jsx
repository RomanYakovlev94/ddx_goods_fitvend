import CatalogClient from "@/components/CatalogClient";
import fallbackGoods from "@/data/goods.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function CatalogPage() {
  const goods = sortGoodsByNewest(filterGoodsByAllowedIds(readGoods()));

  return <CatalogClient products={goods} />;
}

const ALLOWED_PRODUCT_IDS = new Set([
  "2f38520a-118f-43e9-b15c-53139eca2f52",
  "bc612aeb-5f9c-4fda-a25c-66381cd77da3",
  "bf577ac3-05cc-4e9b-99e9-36b1e9516854",
  "a2e6d42a-a84e-4875-9bcb-a8f4b2d1613d",
  "690c4b41-4304-4c74-b528-44be20a7685f",
  "c06ea65f-2634-4a64-be36-a99253e3756f",
  "c649c25e-3806-498a-8a51-6761fa099d6e",
  "0c59c3b0-1262-47a1-b5e9-60242d7c8ec2",
  "b294c85b-1485-4016-b19a-aaddcc17638f",
  "9f376d6b-305c-4a01-ab13-cc791b7fc296",
  "c59c3af1-05d3-480b-bade-12d67be7f05f",
  "7b19e489-a3cd-4288-a23e-469bea68694f",
  "774b943e-6d58-4b79-bd75-a22d7cb05dce",
  "d2d19697-7e5a-4701-aa44-552d0a69816c",
  "ade22ff8-558b-48fd-a462-72d077cb01ec",
  "2d7a745b-d905-40d1-99b8-da3770ac6a9b",
  "0cca29d9-d62e-4424-aa41-4dd34f1fcd10",
  "0c93d04d-230e-454b-a031-0237704e850e",
  "488f6585-359f-4fa4-ae2b-579e4e437ad2",
  "071fbb3f-13f3-4ec2-a03d-cc3397eb4960",
  "90cac4dd-3827-4e96-b6c4-f9c6320349a2",
  "27b42480-f152-4bc6-86a2-24b29952c362",
  "9cb636ed-621b-41d0-b597-6c8019dcb41d",
  "782d47b1-3719-4970-83b7-89b4e9b335d6",
  "63c3ba44-ac5d-4aab-ac13-ce22d1ccc632",
  "d2f770b6-d4e6-4b61-b873-f10c4c3ff81d",
  "9d516784-1358-4a4f-8302-d115190c8d33",
  "e60f8cbe-e403-4b43-8a42-f1df77548c94",
  "361db449-4978-4d04-b68b-e4c44271bb77",
  "c235982d-5a26-4629-a2e8-490cb9a5a45d",
  "daadff77-2d5c-4786-8ee6-ba764dcdccf7",
  "cbe39fed-5348-4635-82c0-ef5225331c0b",
  "b3cfa9c4-d7cd-4497-aa50-ed6666d8548f",
  "d93ca3d5-ad13-43ca-9aaa-5f84dbb5cf57",
  "14df3d51-4a20-4c91-a3f3-2096b54270a4",
  "867c9e2d-627b-4797-9bc9-92da942ef1d7",
  "27e9a571-727d-4e30-893d-28645e31de3d",
  "d4cbbf13-98bd-4857-8126-8437d7a938b8",
  "2d361137-ffec-415a-9d19-c690d0c1caad",
  "be70a2f3-2a92-4672-a1e2-28d75d5821c2",
  "e8556dd2-4764-488e-b13a-7b11fb93b55d",
  "7b925ef8-aea5-4df9-921e-a0ccf8d414f7",
  "42cb97d7-be9f-457d-9103-923da440dc5c",
  "2837ac49-2078-42ed-bf20-ebf6b54f9428",
  "7560363a-da92-4b95-b495-8a4c6302d319",
  "f43486a9-b763-447d-a537-064d3ce4feb2",
  "e7e44187-6082-492c-946c-0ce2c6875cbf",
  "52419833-c153-42e9-89a6-b8d237f08427",
  "c6dd3e11-ecac-4729-a06b-4cb1e23bda59",
  "dc09a331-58cb-46c9-b424-eb12d03bdd07",
]);

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

function filterGoodsByAllowedIds(goods) {
  return goods.filter((good) => ALLOWED_PRODUCT_IDS.has(good.id));
}

function sortGoodsByNewest(goods) {
  return [...goods].sort((a, b) => getGoodTimestamp(b) - getGoodTimestamp(a));
}

function getGoodTimestamp(good) {
  const source = `${good.img_name ?? ""} ${good.img_path ?? ""}`;
  const match = source.match(/-(\d{10,})\.(?:png|jpe?g|webp)(?:\?|\s|$)/i);

  return match ? Number(match[1]) : 0;
}

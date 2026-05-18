import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const outDir = join(process.cwd(), "out");

for (const file of walk(outDir)) {
  const extension = extname(file);

  if (![".html", ".txt", ".css", ".js"].includes(extension)) {
    continue;
  }

  const original = readFileSync(file, "utf8");
  let next = original;

  if (extension === ".css") {
    next = next
      .replaceAll('url("/assets/', 'url("../../../assets/')
      .replaceAll("url('/assets/", "url('../../../assets/")
      .replaceAll("url(/assets/", "url(../../../assets/");
  } else {
    const prefix = htmlPrefixFor(file);
    next = next
      .replaceAll('href="/_next/', `href="${prefix}_next/`)
      .replaceAll('src="/_next/', `src="${prefix}_next/`)
      .replaceAll('href="/assets/', `href="${prefix}assets/`)
      .replaceAll('src="/assets/', `src="${prefix}assets/`)
      .replaceAll('href="/catalog"', 'href="catalog.html"')
      .replaceAll('href="/" class="catalog-back-area"', 'href="index.html" class="catalog-back-area"');
  }

  if (next !== original) {
    writeFileSync(file, next);
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

function htmlPrefixFor(file) {
  const rel = relative(outDir, file);
  const depth = rel.split(sep).length - 1;
  return depth === 0 ? "" : "../".repeat(depth);
}

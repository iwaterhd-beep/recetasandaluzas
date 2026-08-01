/**
 * Reemplaza fotos incorrectas con archivos Commons curados.
 * Uso: node scripts/fix-bad-images.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { unlink } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/recetas");
const UA = "RecetasAndaluzasBot/1.0 (https://recetasandaluzas.com; local-dev)";

/** id → File:… en Commons (elige plato real, no paisaje/coche/hotel). */
const FIXES = {
  "presa-iberica-a-la-plancha":
    "File:Iberico Secreto 141227 AW.jpg",
  "secreto-iberico-con-ajo":
    "File:Secreto de cerdo ibérico, carne a la parrilla con salsa.jpg",
  "revuelto-de-ajetes":
    "File:Revuelto de huevos y ajos tiernos, gastronomía de España.jpg",
  "olla-de-san-anton": "File:Puchero de Hinojos.jpg",
  "lentejas-andaluzas": "File:Guiso de lentejas con arroz.jpg",
  "berza-jiennense": "File:Cocido de garbanzos con verdura.jpg",
  "ajo-colorao": "File:Potaje de vigilia.jpg",
  "potaje-de-tagarninas": "File:PotajeVigilia-2009.jpg",
  "rape-a-la-marinera": "File:Rape a la gallega.jpg",
  "caballa-a-la-malaguena": "File:Caballa asada.jpg",
  "pez-espada-encebollado": "File:Pez espada a la plancha.jpg",
  "salmonetes-fritos": "File:Salmonetes fritos.jpg",
  "esparragos-trigueros-alinados": "File:Espárragos trigueros.jpg",
  "ortiguillas-fritas": "File:Puntillitas fritas.jpg",
  "mantecados-de-estepa": "File:Mantecados de Estepa.jpg",
  "tomates-alinados": "File:Ensalada de tomate.jpg",
  "pimientos-asados-alinados": "File:Pimientos asados.jpg",
  "ensalada-de-pulpo-andaluza": "File:Ensalada de pulpo.jpg",
  "salmorejo-de-remolacha": "File:Salmorejo cordouan.JPG",
  "ajoblanco-de-melon": "File:Ajoblanco.jpg",
  "tortilla-del-sacromonte":
    "File:Tortilla española con patatas y cebolla.jpg",
};

async function commonsImageUrl(title) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", title);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|size");
  url.searchParams.set("iiurlwidth", "1600");
  url.searchParams.set("format", "json");
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`info ${res.status}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const mime = info.mime || "";
  if (!mime.startsWith("image/") || mime.includes("svg")) return null;
  return info.thumburl || info.url;
}

async function searchFirst(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", `${query} filetype:bitmap`);
  url.searchParams.set("srnamespace", "6");
  url.searchParams.set("srlimit", "8");
  url.searchParams.set("format", "json");
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const data = await res.json();
  return (data.query?.search ?? []).map((s) => s.title);
}

async function saveWebp(imageUrl, dest) {
  const res = await fetch(imageUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 800, { fit: "cover", position: "attention" })
    .webp({ quality: 78 })
    .toFile(dest);
}

const FALLBACK_QUERIES = {
  "rape-a-la-marinera": ["Rape", "Rape salsa", "Monkfish"],
  "caballa-a-la-malaguena": ["Caballa asada", "Caballa", "Mackerel grilled"],
  "pez-espada-encebollado": [
    "Pez espada",
    "Swordfish grilled",
    "Swordfish steak",
  ],
  "salmonetes-fritos": ["Salmonete", "Red mullet", "Mullus"],
  "esparragos-trigueros-alinados": [
    "Espárragos trigueros",
    "Espárragos plato",
    "Grilled asparagus plate",
  ],
  "mantecados-de-estepa": ["Mantecados", "Mantecado Estepa", "Mantecado"],
  "tomates-alinados": ["Tomate aliñado", "Tomato salad oil", "Ensalada tomate"],
  "pimientos-asados-alinados": [
    "Pimientos asados plato",
    "Roasted peppers plate",
    "Pimientos del piquillo",
  ],
  "ensalada-de-pulpo-andaluza": [
    "Ensalada de pulpo",
    "Pulpo vinagreta",
    "Octopus salad Spanish",
  ],
  "ajoblanco-de-melon": ["Ajoblanco", "Ajo blanco"],
};

let ok = 0;
for (const [id, curated] of Object.entries(FIXES)) {
  const dest = path.join(OUT, `${id}.webp`);
  try {
    await unlink(dest).catch(() => {});
    let done = false;
    try {
      const imgUrl = await commonsImageUrl(curated);
      if (imgUrl) {
        await saveWebp(imgUrl, dest);
        console.log(`ok    ${id} ← ${curated}`);
        done = true;
        ok += 1;
      }
    } catch (e) {
      console.warn(`warn  ${id} curated fail: ${e.message}`);
    }

    if (!done) {
      for (const q of FALLBACK_QUERIES[id] ?? []) {
        const titles = await searchFirst(q);
        for (const title of titles) {
          // Evita mapas, embalses, coches, hoteles obvios
          const bad =
            /embalse|hotel|lamborghini|chart|map|panoram|diagram|logo|coat of arms/i.test(
              title,
            );
          if (bad) continue;
          const imgUrl = await commonsImageUrl(title);
          if (!imgUrl) continue;
          await saveWebp(imgUrl, dest);
          console.log(`ok    ${id} ← ${title} (search)`);
          done = true;
          ok += 1;
          break;
        }
        if (done) break;
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    if (!done) console.error(`FAIL  ${id}`);
  } catch (e) {
    console.error(`FAIL  ${id}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 600));
}

console.log(`\nFixed: ${ok}/${Object.keys(FIXES).length}`);

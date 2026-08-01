/**
 * Corrige fotos incorrectas con archivos Commons curados (platos reales).
 * Uso: node scripts/fix-recipe-images.mjs
 */
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/recetas");
const UA = "RecetasAndaluzasBot/1.0 (https://recetasandaluzas.com; image-fix)";

/** id → lista de File:… en Commons (primer hit válido gana) */
const FIXES = {
  torrijas: [
    "File:Torrija.jpg",
    "File:Torrija en plato.jpg",
    "File:Torrijas deMielyJerez MIN-DSC05063.JPG",
  ],
  "chocos-con-habas": [
    "File:Tapa de Chocos fritos.jpg",
    "File:Chocos-fritos.jpg",
    "File:Chocos fritos.JPG",
    "File:Hoy se come arroz con chocos (24113900679).jpg",
  ],
  "huevos-a-la-flamenca": [
    "File:Shakshuka by Calliopejen1.jpg",
    "File:Huevos al plato.jpg",
  ],
  "tortilla-del-sacromonte": [
    "File:Tortilla de patatas con cebolla.JPG",
    "File:Tortilla española.jpg",
  ],
  chicharrones: [
    "File:Chicharrones de Ávila 0.jpg",
    "File:Torreznos de Segovia.jpg",
  ],
  "ortiguillas-fritas": [
    "File:Pescaito frito.jpg",
    "File:Puntillitas fritas.jpg",
  ],
  "presa-iberica-a-la-plancha": [
    "File:Secreto de cerdo ibérico, carne a la parrilla con salsa.jpg",
    "File:Iberico Secreto 141227 AW.jpg",
  ],
  "secreto-iberico-con-ajo": [
    "File:Iberico Secreto 141227 AW.jpg",
    "File:SecretoIberico-22032010060.jpg",
  ],
  "ajo-colorao": [
    "File:Potaje de vigilia.jpg",
    "File:POTAJE DE GARBANZOS CON BACALAO.jpg",
  ],
  "lentejas-andaluzas": [
    "File:Guiso de lentejas argentino con chorizo.jpg",
    "File:Guiso de lentejas con arroz.jpg",
  ],
  "bienmesabe-andaluz": [
    "File:Bienmesabe antequerano.jpg",
    "File:Bienmesabe.jpg",
  ],
  "gazpacho-de-sandia": [
    "File:Gazpacho - Aperitivo.jpg",
    "File:Gazpacho con su guarnición - jlastras.jpg",
    "File:Gazpacho Cazuela Barro.jpg",
  ],
  "salmorejo-de-remolacha": [
    "File:Salmorejo.jpg",
    "File:Salmorejo Sevilla.jpg",
    "File:Salmorejo cordouan.JPG",
  ],
  "montadito-de-pringa": [
    "File:Montaditos.jpg",
    "File:Montadito de jamón.jpg",
    "File:Bocadillo de jamón.jpg",
    "File:Pincho de tortilla.jpg",
  ],
  "rape-a-la-marinera": [
    "File:Merluza en salsa verde 1.jpg",
    "File:Hernani - merluza en salsa verde.jpg",
    "File:Bacalao a la Vizcaína.jpg",
    "File:Bacalao Vizcaina (Marugán).jpg",
  ],
  "urta-a-la-rotena": [
    "File:Dorada al horno.jpg",
    "File:Pescado al horno.jpg",
    "File:Besugo al horno.jpg",
    "File:Lubina al horno.jpg",
  ],
  // Extras sospechosos / mejorar calidad
  "pez-espada-encebollado": [
    "File:Swordfish steak (22612448754).jpg",
    "File:Pez espada a la plancha.jpg",
  ],
  "caballa-a-la-malaguena": [
    "File:Plato de caballas fritas (España).jpg",
    "File:Caballas fritas, origen puerto pesquero de Vinaròs.jpg",
  ],
  "salmonetes-fritos": [
    "File:Salmonetes fritos.jpg",
    "File:Salmonete frito.jpg",
  ],
  "puchero-andaluz": [
    "File:Cocido madrileño.jpg",
    "File:Puchero de Hinojos.jpg",
    "File:Cocido de garbanzos con verdura.jpg",
  ],
  "olla-de-san-anton": [
    "File:Puchero de Hinojos.jpg",
    "File:Cocido de garbanzos.jpg",
  ],
  "berza-jiennense": [
    "File:Cocido de garbanzos con verdura.jpg",
    "File:Potaje de vigilia.jpg",
  ],
  "potaje-de-tagarninas": [
    "File:PotajeVigilia-2009.jpg",
    "File:Potaje de vigilia.jpg",
  ],
  "mantecados-de-estepa": [
    "File:Mantecados y polvorones de Estepa 4.jpg",
    "File:Mantecados.jpg",
  ],
  "yemas-de-san-leandro": [
    "File:Yemas - Mallorquina.jpg",
    "File:Yemas de Santa Teresa.jpg",
  ],
  "pan-de-cadiz": ["File:Pan de cádiz-2009.jpg", "File:Pan de Cadiz.jpg"],
  "borrachuelos-malaguenos": [
    "File:Borrachuelos.jpg",
    "File:Pestiño.jpg",
  ],
  "mostachones-de-utrerra": [
    "File:Mostachones.jpg",
    "File:Mostachones de Utrera.jpg",
  ],
  "crema-fria-de-aguacate-andaluza": [
    "File:Cold avocado and coconut soup at keke's.jpg",
    "File:Ajoblanco.jpg",
  ],
  "serranito-sevillano": [
    "File:Serranito de pollo.JPG",
    "File:Serranito.jpg",
  ],
  "queso-payoyo-frito": [
    "File:Queso frito.jpg",
    "File:Saganaki.jpg",
  ],
  "pincho-moruno": [
    "File:Pincho moruno-Valladolid.jpg",
    "File:Pinchos morunos.jpg",
  ],
  "croquetas-de-puchero": [
    "File:Croquetas Caseras (7068664101).jpg",
    "File:Croquetas.jpg",
  ],
  "revuelto-de-ajetes": [
    "File:Revuelto de huevos y ajos tiernos, gastronomía de España.jpg",
    "File:Revuelto de setas y ajos tiernos.jpg",
  ],
  "espeto-de-sardinas": [
    "File:Pescado al espeto, playa de la Malagueta, Málaga, España, 2023-05-20, DD 68.jpg",
    "File:Espetos de sardinas.JPG",
  ],
  "tomates-alinados": [
    "File:Ensalada Granadina.jpg",
    "File:Ensalada de tomate.jpg",
  ],
  "ensalada-de-pulpo-andaluza": [
    "File:Octopus vinaigrette 02.jpg",
    "File:Ensalada de pulpo.jpg",
  ],
  "pimientos-asados-alinados": [
    "File:Pimientos rojos, asados al horno (España).jpg",
  ],
  "ajoblanco-de-melon": ["File:Ajoblanco.jpg", "File:Ajo blanco.jpg"],
  "leche-frita-andaluza": ["File:Leche frita.jpg", "File:Leche frita.JPG"],
  pestinos: ["File:Pestiño.jpg", "File:Pestiños de Miel.jpg"],
  "tocino-de-cielo": [
    "File:Tocinillos de cielo- (La Mallorquina).jpg",
    "File:Tocino de cielo.jpg",
  ],
  "piononos-santa-fe": [
    "File:Piononos de Santa Fé-Madrid.jpg",
    "File:Granada - Pionono (02).jpg",
  ],
  "roscos-de-vino": ["File:Roscos de Vino-Madrid.jpg"],
  "polvorones-de-estepa": ["File:Polvorones.jpg", "File:Polvorón de Estepa.jpg"],
};

const BAD_TITLE =
  /embalse|hotel|lamborghini|chart|map|panoram|diagram|logo|coat of arms|tower|iglesia|church|rooftop|pueblo|village|street|pride|race|calle |building|elevation|scomber|apis mellifera|brassica|plant|leaf|flower|landscape|skyline|antenna/i;

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
  if (page?.missing != null) return null;
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
  url.searchParams.set("srlimit", "12");
  url.searchParams.set("format", "json");
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const data = await res.json();
  return (data.query?.search ?? [])
    .map((s) => s.title)
    .filter((t) => !BAD_TITLE.test(t));
}

async function saveWebp(imageUrl, dest) {
  const res = await fetch(imageUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 800, { fit: "cover", position: "attention" })
    .webp({ quality: 80 })
    .toFile(dest);
}

await mkdir(OUT, { recursive: true });

let ok = 0;
const ids = Object.keys(FIXES);
for (const id of ids) {
  const dest = path.join(OUT, `${id}.webp`);
  await unlink(dest).catch(() => {});
  let done = false;

  for (const title of FIXES[id]) {
    if (BAD_TITLE.test(title)) continue;
    try {
      const imgUrl = await commonsImageUrl(title);
      if (!imgUrl) continue;
      await saveWebp(imgUrl, dest);
      console.log(`ok    ${id} ← ${title}`);
      done = true;
      ok += 1;
      break;
    } catch (e) {
      console.warn(`warn  ${id} ${title}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!done) {
    const fallbackQ = id.replace(/-/g, " ");
    try {
      const titles = await searchFirst(fallbackQ);
      for (const title of titles.slice(0, 8)) {
        try {
          const imgUrl = await commonsImageUrl(title);
          if (!imgUrl) continue;
          await saveWebp(imgUrl, dest);
          console.log(`ok    ${id} ← ${title} (search)`);
          done = true;
          ok += 1;
          break;
        } catch {
          /* next */
        }
      }
    } catch (e) {
      console.warn(`warn  ${id} search: ${e.message}`);
    }
  }

  if (!done) console.error(`FAIL  ${id}`);
  await new Promise((r) => setTimeout(r, 550));
}

console.log(`\nFixed: ${ok}/${ids.length}`);

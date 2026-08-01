/**
 * Descarga fotos de platos desde Wikimedia Commons (licencias libres),
 * las convierte a WebP 1200×800 y las guarda en public/images/recetas/.
 *
 * Uso:
 *   node scripts/fetch-recipe-images.mjs
 *   FORCE=huevos-a-la-flamenca,puchero-andaluz node scripts/fetch-recipe-images.mjs
 *   FORCE=all node scripts/fetch-recipe-images.mjs
 */
import { mkdir, writeFile, access, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/recetas");
const UA = "RecetasAndaluzasBot/1.0 (https://recetasandaluzas.com; local-dev)";

const FORCE = new Set(
  (process.env.FORCE || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);
const FORCE_ALL = FORCE.has("all");

/** Archivo Commons exacto (prioridad sobre búsqueda). */
const CURATED = {
  torrijas: "File:Torrija.jpg",
  "huevos-a-la-flamenca": "File:Shakshuka by Calliopejen1.jpg",
  "puchero-andaluz": "File:Cocido madrileño.jpg",
  "tortilla-del-sacromonte": "File:Tortilla española.jpg",
  "remojon-granadino": "File:Ensalada de naranja y cebolla (España).jpg",
  chicharrones: "File:Chicharrones de Ávila 0.jpg",
  "espinacas-con-garbanzos": "File:PotajeVigilia-2009-01.jpg",
  "choto-al-ajillo": "File:Cabrito Assado Paredes.jpg",
  "migas-andaluzas":
    "File:Migas de pan rehogadas con sofrito y morcilla de cebolla, gastronomía de España.jpg",
  "berenjenas-fritas-miel-cana": "File:Tapa de berenjenas fritas.jpg",
  "alfajores-medina-sidonia": "File:AlfajorGrande-Medina.JPG",
  "solomillo-al-whisky": "File:Beef steak slices on a platter with sauce.JPG",
  "cazon-en-adobo": "File:Pescaito frito.jpg",
  "arroz-marinero-onubense": "File:Paella de marisco.jpg",
  "urta-a-la-rotena": "File:Bacalao a la Vizcaína.jpg",
  "chocos-con-habas": "File:Tapa de Chocos fritos.jpg",
  "montadito-de-pringa": "File:Serranito de pollo.JPG",
  "rape-a-la-marinera": "File:Merluza en salsa verde 1.jpg",
  "gambas-al-ajillo": "File:Gambas Al Ajillo (Spanish Garlic Shrimp).jpg",
  "polvorones-de-estepa": "File:Polvorones.jpg",
  "mantecados-de-estepa": "File:Mantecados y polvorones de Estepa 4.jpg",
  "espeto-de-sardinas":
    "File:Pescado al espeto, playa de la Malagueta, Málaga, España, 2023-05-20, DD 68.jpg",
  "arroz-negro-malagueno": "File:Arroz negro.JPG",
  "fideua-malaguena": "File:Fideuà.JPG",
  "leche-frita-andaluza": "File:Leche frita.jpg",
  "tomates-alinados": "File:Ensalada Granadina.jpg",
  "aceitunas-alinadas": "File:Aceitunas aliñadas.jpg",
  "boquerones-fritos": "File:Boquerones fritos.jpg",
  "patatas-a-lo-pobre": "File:Patatas a lo pobre.JPG",
  "ensalada-malaguena": "File:Ensalada malagueña.jpg",
  "mazamorra-cordobesa": "File:Ajo blanco.jpg",
  cocido: "File:Cocido madrileño.jpg",
  "bienmesabe-andaluz": "File:Bienmesabe antequerano.jpg",
  "lentejas-andaluzas": "File:Guiso de lentejas argentino con chorizo.jpg",
  "ajo-colorao": "File:Potaje de vigilia.jpg",
  "presa-iberica-a-la-plancha":
    "File:Secreto de cerdo ibérico, carne a la parrilla con salsa.jpg",
  "secreto-iberico-con-ajo": "File:Iberico Secreto 141227 AW.jpg",
  "ortiguillas-fritas": "File:Pescaito frito.jpg",
  "serranito-sevillano": "File:Serranito de pollo.JPG",
  "pincho-moruno": "File:Pincho moruno-Valladolid.jpg",
  pestinos: "File:Pestiño.jpg",
  "tocino-de-cielo": "File:Tocinillos de cielo- (La Mallorquina).jpg",
  "piononos-santa-fe": "File:Piononos de Santa Fé-Madrid.jpg",
  "roscos-de-vino": "File:Roscos de Vino-Madrid.jpg",
  "pan-de-cadiz": "File:Pan de cádiz-2009.jpg",
  "yemas-de-san-leandro": "File:Yemas - Mallorquina.jpg",
  "borrachuelos-malaguenos": "File:Borrachuelos.jpg",
  "mostachones-de-utrerra": "File:Mostachones.jpg",
  "salmonetes-fritos": "File:Salmonetes fritos.jpg",
  "caballa-a-la-malaguena": "File:Plato de caballas fritas (España).jpg",
  "pez-espada-encebollado": "File:Swordfish steak (22612448754).jpg",
  "croquetas-de-puchero": "File:Croquetas Caseras (7068664101).jpg",
  "revuelto-de-ajetes":
    "File:Revuelto de huevos y ajos tiernos, gastronomía de España.jpg",
  "ensalada-de-pulpo-andaluza": "File:Octopus vinaigrette 02.jpg",
  "pimientos-asados-alinados":
    "File:Pimientos rojos, asados al horno (España).jpg",
  "ajoblanco-de-melon": "File:Ajoblanco.jpg",
  "crema-fria-de-aguacate-andaluza":
    "File:Cold avocado and coconut soup at keke's.jpg",
  "olla-de-san-anton": "File:Puchero de Hinojos.jpg",
  "berza-jiennense": "File:Cocido de garbanzos con verdura.jpg",
  "potaje-de-tagarninas": "File:PotajeVigilia-2009.jpg",
  "queso-payoyo-frito": "File:Queso frito.jpg",
  "gazpacho-de-sandia": "File:Gazpacho - Aperitivo.jpg",
  "salmorejo-de-remolacha": "File:Salmorejo.jpg",
};

/** Rechazar títulos que suelen ser paisaje / no-comida */
const BAD_TITLE =
  /embalse|hotel|lamborghini|chart|map|panoram|diagram|logo|coat of arms|tower|iglesia|church|rooftop|pueblo|village|street|pride|race|calle |building|elevation|scomber|apis mellifera|brassica|plant|leaf|flower|landscape|skyline|antenna|wikipedia|acapulco|bahia de|bay of|rooftop|plaza de|cathedral|castillo|castle|museum|statue|sculpture|painting|rubens|tiepolo/i;

/** id → términos de búsqueda en Commons */
const QUERIES = {
  // —— existentes ——
  "gazpacho-andaluz": ["Gazpacho", "Gazpacho andaluz"],
  "salmorejo-cordobes": ["Salmorejo", "Salmorejo cordobés"],
  "ajoblanco-malagueno": ["Ajoblanco", "Ajo blanco"],
  "gazpachuelo-malagueno": ["Gazpachuelo", "Fish soup Málaga"],
  "porra-antequerana": ["Porra antequerana"],
  pipirrana: ["Pipirrana"],
  "remojon-granadino": ["Remojón", "Orange salad bacalao Spain"],
  "ensalada-naranja-bacalao": ["Ensalada de naranja", "Orange onion salad Spain"],
  "tortillitas-de-camarones": ["Tortillitas de camarones", "Shrimp fritters"],
  "flamenquines-cordobeses": ["Flamenquín"],
  "berenjenas-fritas-miel-cana": ["Berenjenas con miel", "Fried eggplant honey"],
  "pescaito-frito": ["Pescaito frito", "Fried fish Andalusia"],
  "papas-alinas": ["Papas aliñás", "Potato salad Spanish"],
  "espinacas-con-garbanzos": ["Espinacas con garbanzos", "Potaje vigilia"],
  "huevos-a-la-flamenca": ["Huevos a la flamenca", "Eggs tomato peppers Spanish"],
  "puntillitas-fritas": ["Puntillitas", "Fried baby squid"],
  "boquerones-en-vinagre": ["Boquerones en vinagre"],
  "cazon-en-adobo": ["Cazón en adobo"],
  "solomillo-al-whisky": ["Solomillo al whisky"],
  chicharrones: ["Torreznos", "Chicharrones"],
  "rabo-de-toro-cordobes": ["Rabo de toro", "Oxtail stew"],
  "carrillada-pedro-ximenez": ["Carrilleras", "Pork cheek stew"],
  "callos-a-la-andaluza": ["Callos con garbanzos", "Tripe stew"],
  "puchero-andaluz": ["Cocido madrileño", "Puchero", "Cocido"],
  andrajos: ["Andrajos"],
  "choto-al-ajillo": ["Cabrito asado", "Choto", "Goat stew garlic"],
  "habas-con-jamon": ["Habas con jamón"],
  "tortilla-del-sacromonte": ["Tortilla de patatas", "Spanish omelette"],
  "atun-encebollado": ["Atún encebollado"],
  "urta-a-la-rotena": ["Urta"],
  "calamares-a-la-andaluza": ["Calamares a la andaluza", "Fried calamari"],
  "caracoles-en-salsa": ["Caracoles en salsa", "Snails stew Spanish"],
  "arroz-con-bacalao": ["Arroz con bacalao", "Rice cod Spanish"],
  "arroz-caldoso-mariscos": ["Arroz caldoso", "Seafood rice broth"],
  "tocino-de-cielo": ["Tocino de cielo", "Tocinillo de cielo"],
  pestinos: ["Pestiño", "Pestinos"],
  torrijas: ["Torrijas"],
  "piononos-santa-fe": ["Piononos"],
  "roscos-de-vino": ["Roscos de vino"],
  "alfajores-medina-sidonia": ["Alfajor Medina Sidonia", "Alfajor Spanish"],

  // —— nuevas (extra.ts) ——
  "mazamorra-cordobesa": ["Mazamorra", "Ajoblanco", "Almond soup"],
  "ajoblanco-de-melon": ["Ajoblanco", "Melon soup cold"],
  "gazpacho-de-sandia": ["Gazpacho", "Watermelon gazpacho"],
  "crema-fria-de-aguacate-andaluza": ["Avocado soup cold", "Crema aguacate"],
  "salmorejo-de-remolacha": ["Beetroot soup cold", "Salmorejo", "Remolacha crema"],
  "ensalada-malaguena": ["Ensalada malagueña", "Potato orange salad"],
  "tomates-alinados": ["Ensalada de tomate", "Tomato salad Spanish"],
  "pimientos-asados-alinados": ["Pimientos asados", "Roasted red peppers"],
  "ensalada-de-pulpo-andaluza": ["Ensalada de pulpo", "Octopus salad"],
  "ensalada-campera-andaluza": ["Ensalada campera", "Potato tuna salad"],
  "esparragos-trigueros-alinados": ["Espárragos trigueros", "Asparagus salad"],
  "ensalada-de-ventresca": ["Ensalada de tomate atún", "Tuna tomato salad"],
  "gambas-al-ajillo": ["Gambas al ajillo", "Garlic shrimp Spanish"],
  "croquetas-de-puchero": ["Croquetas", "Spanish croquettes"],
  "montadito-de-pringa": ["Montadito", "Pringá", "Spanish sandwich tapa"],
  "pincho-moruno": ["Pincho moruno", "Moorish skewer"],
  "aceitunas-alinadas": ["Aceitunas aliñadas", "Marinated olives"],
  "ortiguillas-fritas": ["Ortiguillas", "Fried sea anemone", "Anemone fried"],
  "mojama-con-almendras": ["Mojama", "Cured tuna"],
  "presa-iberica-a-la-plancha": ["Presa ibérica", "Iberian pork grill"],
  "secreto-iberico-con-ajo": ["Secreto ibérico", "Iberian pork"],
  "serranito-sevillano": ["Serranito", "Spanish pork sandwich"],
  "queso-payoyo-frito": ["Queso frito", "Fried cheese"],
  "revuelto-de-ajetes": ["Revuelto", "Scrambled eggs garlic sprouts"],
  "patatas-a-lo-pobre": ["Patatas a lo pobre"],
  "olla-de-san-anton": ["Olla", "Cocido", "Pork stew chickpeas"],
  "ropa-vieja-andaluza": ["Ropa vieja", "Shredded meat stew"],
  "potaje-de-vigilia-andaluz": ["Potaje de vigilia", "Chickpea spinach stew"],
  "lentejas-andaluzas": ["Lentejas", "Lentil stew Spanish"],
  "migas-andaluzas": ["Migas", "Migas de pan"],
  "gurullos-almerienses": ["Gurullos", "Pasta stew Almería", "Pasta chickpeas stew"],
  "ajo-colorao": ["Ajo colorao", "Red garlic stew fish", "Potaje pescado"],
  "berza-jiennense": ["Berza", "Collard greens stew", "Cocido verduras"],
  "conejo-al-ajillo": ["Conejo al ajillo", "Rabbit garlic"],
  "alcachofas-con-jamon": ["Alcachofas con jamón", "Artichokes ham"],
  "potaje-de-tagarninas": ["Tagarninas", "Thistle stew", "Cardoon stew"],
  "guiso-de-patatas-con-costilla": ["Patatas con costilla", "Potato pork rib stew"],
  "espeto-de-sardinas": ["Espeto", "Espetos de sardinas", "Grilled sardines"],
  "boquerones-fritos": ["Boquerones fritos", "Fried anchovies"],
  "chocos-con-habas": ["Chocos", "Cuttlefish beans", "Sepia habas"],
  "rape-a-la-marinera": ["Rape a la marinera", "Monkfish stew"],
  "caballa-a-la-malaguena": ["Caballa", "Mackerel tomato"],
  "pez-espada-encebollado": ["Pez espada", "Swordfish onion"],
  "almejas-a-la-marinera": ["Almejas a la marinera", "Clams wine"],
  "salmonetes-fritos": ["Salmonetes", "Red mullet fried"],
  "arroz-a-banda-andaluz": ["Arroz a banda", "Rice fish broth"],
  "arroz-negro-malagueno": ["Arroz negro", "Black rice squid ink"],
  "fideua-malaguena": ["Fideuà", "Fideua"],
  "arroz-con-costilla": ["Arroz con costilla", "Rice pork ribs"],
  "arroz-marinero-onubense": ["Arroz marinero", "Seafood rice"],
  "arroz-con-pollo-andaluz": ["Arroz con pollo", "Chicken rice Spanish"],
  "polvorones-de-estepa": ["Polvorones", "Polvorón"],
  "mantecados-de-estepa": ["Mantecados", "Mantecado"],
  "yemas-de-san-leandro": ["Yemas", "Yema huevo dulce", "Egg yolk candy"],
  "bienmesabe-andaluz": ["Bienmesabe", "Almond dessert"],
  "pan-de-cadiz": ["Pan de Cádiz", "Marzipan cake"],
  "tortas-de-aceite-castilleja": ["Tortas de aceite", "Olive oil biscuits"],
  "borrachuelos-malaguenos": ["Borrachuelos", "Fried pastry honey"],
  "leche-frita-andaluza": ["Leche frita"],
  "mostachones-de-utrerra": ["Mostachones", "Spanish cookies"],
};

async function commonsSearch(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", `${query} filetype:bitmap`);
  url.searchParams.set("srnamespace", "6");
  url.searchParams.set("srlimit", "10");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const data = await res.json();
  return (data.query?.search ?? [])
    .map((s) => s.title)
    .filter((t) => !BAD_TITLE.test(t));
}

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

async function downloadAsWebp(imageUrl, dest) {
  const res = await fetch(imageUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 800, { fit: "cover", position: "attention" })
    .webp({ quality: 78 })
    .toFile(dest);
}

async function tryTitle(id, title, dest) {
  const imgUrl = await commonsImageUrl(title);
  if (!imgUrl) return false;
  await downloadAsWebp(imgUrl, dest);
  console.log(`ok    ${id} ← ${title}`);
  return true;
}

async function fetchOne(id, queries) {
  const dest = path.join(OUT, `${id}.webp`);
  const force = FORCE_ALL || FORCE.has(id);

  if (!force) {
    try {
      await access(dest);
      console.log(`skip  ${id}`);
      return true;
    } catch {
      /* continue */
    }
  } else {
    try {
      await unlink(dest);
    } catch {
      /* ok */
    }
  }

  const curated = CURATED[id];
  if (curated) {
    try {
      if (await tryTitle(id, curated, dest)) return true;
    } catch (e) {
      console.warn(`warn  ${id} curated: ${e.message}`);
    }
  }

  for (const q of queries) {
    try {
      const titles = await commonsSearch(q);
      for (const title of titles) {
        try {
          if (await tryTitle(id, title, dest)) return true;
        } catch {
          /* next title */
        }
      }
    } catch (e) {
      console.warn(`warn  ${id} query="${q}": ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  console.error(`FAIL  ${id}`);
  return false;
}

await mkdir(OUT, { recursive: true });
const entries = Object.entries(QUERIES);
let ok = 0;
for (const [id, queries] of entries) {
  if (await fetchOne(id, queries)) ok += 1;
  await new Promise((r) => setTimeout(r, 350));
}

const manifest = Object.fromEntries(
  entries.map(([id]) => [id, `/images/recetas/${id}.webp`]),
);
await writeFile(
  path.join(OUT, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(`\nDone: ${ok}/${entries.length} images → ${OUT}`);

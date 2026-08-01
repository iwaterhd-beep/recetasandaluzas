# Recetas Andaluzas

Web de cocina andaluza: [recetasandaluzas.com](https://recetasandaluzas.com)  
Repo: https://github.com/iwaterhd-beep/recetasandaluzas

Next.js (App Router) + TypeScript + Tailwind. Catálogo estático (~135 recetas), buscador Fuse.js, favoritos y lista de la compra, modo cocina con temporizador, auth Supabase (email + Google), paneles `/cuenta` y `/admin`, SEO (JSON-LD Recipe), PWA y huecos AdSense.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # rellena claves
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # producción
npm start
```

## Variables de entorno

Copia `.env.example` → `.env.local` (y las mismas en Vercel):

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon / publishable key (nunca service role en el cliente) |
| `ADMIN_EMAILS` | Emails admin, separados por coma |
| `NEXT_PUBLIC_ADSENSE_*` | AdSense (opcional) |
| `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG` | Afiliados Amazon (opcional) |

Sin Supabase la web funciona; login, valoraciones cloud y admin quedan desactivados.

## Supabase

1. Crea un proyecto (región recomendada `eu-west-1`) en la org **tpv**. Si el plan Free está al límite (2 proyectos), pausa o elimina otro proyecto o sube de plan.
2. Aplica las migraciones en `supabase/migrations/` (SQL Editor o CLI):
   - `20260801000000_init.sql` — tablas, RLS, triggers
   - `20260801000001_seed_recipe_stats.sql` — stats iniciales
3. Auth → Providers:
   - **Email** activado
   - **Google**: OAuth client en Google Cloud; redirect URI de Supabase  
     `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
4. Authentication → URL configuration:
   - Site URL: `https://recetasandaluzas.com` (y `http://localhost:3000` en local)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://recetasandaluzas.com/auth/callback`, preview de Vercel
5. (Opcional) Sign in with Apple cuando tengas Apple Developer — la UI ya muestra “próximamente”.

## Vercel

1. Conecta el repo `iwaterhd-beep/recetasandaluzas`.
2. Añade las env vars de `.env.example`.
3. Redeploy tras configurar Supabase + Google OAuth.

## Estructura útil

- `src/data/recetas/` — recetas tipadas (+ `ampliacion.ts`)
- `src/app/recetas/[id]/cocinar` — modo cocina + feedback
- `src/app/cuenta` — favoritos sync, historial, top semanal
- `src/app/admin` — usuarios, visitas, ratings, moderación
- `src/lib/supabase/` — clientes SSR / browser
- `supabase/migrations/` — schema + seed

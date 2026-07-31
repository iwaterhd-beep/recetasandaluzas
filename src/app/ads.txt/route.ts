import { adsTxtLine } from "@/lib/ads";

/**
 * ads.txt en la raíz del sitio.
 * Con CLIENT_ID real emite la línea de Google; si no, comentario placeholder.
 */
export function GET() {
  const line = adsTxtLine();
  const body = line
    ? `${line}\n`
    : `# ads.txt — sustituye NEXT_PUBLIC_ADSENSE_CLIENT_ID cuando AdSense apruebe la cuenta
# Formato: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
# https://support.google.com/adsense/answer/7532444
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

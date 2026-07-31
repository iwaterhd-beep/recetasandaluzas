import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Layout mínimo: el chrome del sitio se oculta vía data-cook-mode */
export default function CocinarLayout({ children }: { children: React.ReactNode }) {
  return children;
}

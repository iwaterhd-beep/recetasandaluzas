import type { Metadata } from "next";
import { CookChrome } from "@/components/cocina/cook-chrome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Layout mínimo: el chrome del sitio se oculta vía data-cook-mode */
export default function CocinarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookChrome />
      {children}
    </>
  );
}

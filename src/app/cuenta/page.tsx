import type { Metadata } from "next";
import CuentaClient from "./cuenta-client";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default function CuentaPage() {
  return <CuentaClient />;
}

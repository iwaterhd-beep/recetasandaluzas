import type { Metadata } from "next";
import ListaCompraClient from "./lista-client";

export const metadata: Metadata = {
  title: "Lista de la compra",
  robots: { index: false, follow: false },
};

export default function ListaCompraPage() {
  return <ListaCompraClient />;
}

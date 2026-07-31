import type { Metadata } from "next";
import FavoritosClient from "./favoritos-client";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false, follow: false },
};

export default function FavoritosPage() {
  return <FavoritosClient />;
}

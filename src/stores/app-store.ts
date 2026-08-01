import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCompra {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  notas?: string;
  origenRecetas: string[];
  marcado: boolean;
}

interface AppState {
  favoritos: string[];
  listaCompra: ItemCompra[];
  tema: "light" | "dark" | "system";
  toggleFavorito: (recetaId: string) => void;
  esFavorito: (recetaId: string) => boolean;
  anadirALista: (
    items: Omit<ItemCompra, "marcado" | "origenRecetas">[],
    recetaId: string,
  ) => void;
  toggleItemCompra: (id: string) => void;
  eliminarItemCompra: (id: string) => void;
  limpiarListaCompra: () => void;
  limpiarMarcados: () => void;
  setTema: (tema: "light" | "dark" | "system") => void;
}

function mergeKey(nombre: string, unidad: string) {
  return `${nombre.toLowerCase().trim()}::${unidad}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favoritos: [],
      listaCompra: [],
      tema: "light",

      toggleFavorito: (recetaId) =>
        set((state) => ({
          favoritos: state.favoritos.includes(recetaId)
            ? state.favoritos.filter((id) => id !== recetaId)
            : [...state.favoritos, recetaId],
        })),

      esFavorito: (recetaId) => get().favoritos.includes(recetaId),

      anadirALista: (items, recetaId) =>
        set((state) => {
          const mapa = new Map(
            state.listaCompra.map((i) => [mergeKey(i.nombre, i.unidad), i]),
          );

          for (const item of items) {
            const key = mergeKey(item.nombre, item.unidad);
            const existente = mapa.get(key);
            if (existente) {
              mapa.set(key, {
                ...existente,
                cantidad: existente.cantidad + item.cantidad,
                origenRecetas: existente.origenRecetas.includes(recetaId)
                  ? existente.origenRecetas
                  : [...existente.origenRecetas, recetaId],
              });
            } else {
              mapa.set(key, {
                ...item,
                marcado: false,
                origenRecetas: [recetaId],
              });
            }
          }

          return { listaCompra: Array.from(mapa.values()) };
        }),

      toggleItemCompra: (id) =>
        set((state) => ({
          listaCompra: state.listaCompra.map((i) =>
            i.id === id ? { ...i, marcado: !i.marcado } : i,
          ),
        })),

      eliminarItemCompra: (id) =>
        set((state) => ({
          listaCompra: state.listaCompra.filter((i) => i.id !== id),
        })),

      limpiarListaCompra: () => set({ listaCompra: [] }),

      limpiarMarcados: () =>
        set((state) => ({
          listaCompra: state.listaCompra.filter((i) => !i.marcado),
        })),

      setTema: (tema) => set({ tema }),
    }),
    {
      name: "recetas-andaluzas-storage",
      partialize: (state) => ({
        favoritos: state.favoritos,
        listaCompra: state.listaCompra,
        tema: state.tema,
      }),
    },
  ),
);

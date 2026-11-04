// Secciones del catálogo del design system. Fuente única del menú lateral: cada `id` es el del
// encabezado de su sección en /design-system/. «pending» son piezas planificadas que aún no existen.
export interface CatalogItem {
  id: string;
  label: string;
}

export interface CatalogGroup {
  label: string;
  items: CatalogItem[];
  pending?: string[];
}

export const catalogGroups: CatalogGroup[] = [
  {
    label: "Tokens",
    items: [
      { id: "tokens-color", label: "Color" },
      { id: "tokens-space", label: "Space" },
      { id: "tokens-radius", label: "Radii" },
      { id: "tokens-type", label: "Typography" },
    ],
  },
  {
    label: "Primitives",
    items: [
      { id: "prim-box", label: "Box" },
      { id: "prim-flex", label: "Flex" },
      { id: "prim-grid", label: "Grid" },
      { id: "prim-text", label: "Text" },
      { id: "prim-icon", label: "Icon" },
    ],
  },
  { label: "Components", items: [], pending: ["Button"] },
];

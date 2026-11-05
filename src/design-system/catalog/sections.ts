// Páginas del catálogo del design system. Fuente única del menú lateral, de la página de inicio del
// catálogo, de los títulos y de los tests: añadir una pieza aquí y crear su página en
// src/pages/design-system/<grupo>/<slug>.astro. «pending» son piezas planificadas que aún no existen.
export interface CatalogItem {
  slug: string;
  label: string;
  description: string;
}

export interface CatalogGroup {
  slug: string;
  label: string;
  description: string;
  items: CatalogItem[];
  pending?: string[];
}

export const catalogGroups: CatalogGroup[] = [
  {
    slug: "tokens",
    label: "Tokens",
    description: "Valores de diseño en DTCG: primitivos y semánticos.",
    items: [
      {
        slug: "color",
        label: "Color",
        description:
          "Rampas primitivas (neutral, violet, orange, red) y roles semánticos que cambian con el esquema.",
      },
      {
        slug: "space",
        label: "Space",
        description: "Escala de espaciado. El paso N equivale a N × 0,25 rem.",
      },
      {
        slug: "radii",
        label: "Radii",
        description: "Escala de radios de esquina y sus alias semánticos.",
      },
      {
        slug: "border",
        label: "Border",
        description: "Anchos de borde.",
      },
      {
        slug: "typography",
        label: "Typography",
        description: "Estilos de texto semánticos y la escala tipográfica.",
      },
      {
        slug: "motion",
        label: "Motion",
        description:
          "Duraciones y curvas de movimiento, con sus alias semánticos.",
      },
    ],
  },
  {
    slug: "primitives",
    label: "Primitives",
    description:
      "Bloques base de maquetación y texto; todo se construye sobre ellos.",
    items: [
      {
        slug: "box",
        label: "Box",
        description: "Contenedor con espaciado, fondo, borde y radio.",
      },
      {
        slug: "flex",
        label: "Flex",
        description: "Caja flexible con dirección, alineación y huecos.",
      },
      {
        slug: "grid",
        label: "Grid",
        description: "Cuadrícula con columnas fijas o responsivas.",
      },
      {
        slug: "text",
        label: "Text",
        description:
          "Texto con estilos semánticos (variant), tamaño, peso, color e interlineado.",
      },
      {
        slug: "icon",
        label: "Icon",
        description: "Icono de trazo que hereda el color del texto.",
      },
    ],
  },
  {
    slug: "components",
    label: "Components",
    description: "Piezas compuestas con su propio comportamiento.",
    items: [],
    pending: ["Button"],
  },
];

export const catalogHref = (group: CatalogGroup, item: CatalogItem) =>
  `/design-system/${group.slug}/${item.slug}/`;

// Todas las páginas del catálogo, para los tests de accesibilidad y de regresión visual.
export const catalogPages = [
  { name: "overview", path: "/design-system/" },
  ...catalogGroups.flatMap((group) =>
    group.items.map((item) => ({
      name: `${group.slug}-${item.slug}`,
      path: catalogHref(group, item),
    }))
  ),
];

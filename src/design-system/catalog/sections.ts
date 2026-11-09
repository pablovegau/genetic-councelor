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
    items: [
      {
        slug: "button",
        label: "Button",
        description:
          "Botón de acción en violeta; con href es un enlace con el mismo aspecto.",
      },
      {
        slug: "mobile-menu",
        label: "MobileMenu",
        description:
          "Menú de móvil: hamburguesa que pasa a X y panel lateral con cristal esmerilado.",
      },
      {
        slug: "section",
        label: "Section",
        description:
          "Banda de página con fondo, franja de color y su contenido centrado (Container).",
      },
      {
        slug: "link",
        label: "Link",
        description:
          "Enlace de texto con cuatro variantes: énfasis, título, navegación y apagado.",
      },
      {
        slug: "icon",
        label: "Icon",
        description:
          "Iconos de 1,25 em que heredan el color: correo y logos de redes sociales.",
      },
      {
        slug: "brand-mark",
        label: "BrandMark",
        description:
          "El símbolo de la marca: un círculo y la flecha del probando, como en el árbol.",
      },
      {
        slug: "wordmark",
        label: "Wordmark",
        description:
          "El nombre del sitio en la tipografía de titulares: enlace en la cabecera, texto en el pie.",
      },
      {
        slug: "byline",
        label: "Byline",
        description:
          "Firma: foto redonda recortada a la cara, con el nombre y el cargo.",
      },
      {
        slug: "portrait",
        label: "Portrait",
        description:
          "Foto en un marco de esquinas redondeadas, recortada a la persona.",
      },
      {
        slug: "split",
        label: "Split",
        description:
          "Dos bloques apilados en móvil y en dos columnas, centrados en vertical, desde 48 rem.",
      },
      {
        slug: "marker-list",
        label: "MarkerList",
        description:
          "Lista de entradas con un símbolo de color, un título que enlaza y una descripción.",
      },
      {
        slug: "steps",
        label: "Steps",
        description:
          "Pasos numerados unidos por una línea, como la línea de hermanos de un árbol genealógico.",
      },
      {
        slug: "language-switch",
        label: "LanguageSwitch",
        description: "Enlaces ES / CA / EN con el idioma actual en negrita.",
      },
      {
        slug: "footer",
        label: "Footer",
        description:
          "Pie de página sobre fondo de tinta: marca, columnas de enlaces y línea final.",
      },
      {
        slug: "family-tree",
        label: "FamilyTree",
        description:
          "Árbol genealógico de ejemplo: se dibuja una vez y sus símbolos explican qué son.",
      },
      {
        slug: "scheme-toggle",
        label: "SchemeToggle",
        description:
          "Interruptor claro/oscuro con un icono que pasa de sol a luna.",
      },
      {
        slug: "price-card",
        label: "PriceCard",
        description:
          "Tarjeta de una visita con su precio a la vista y una acción.",
      },
      {
        slug: "publication-list",
        label: "PublicationList",
        description:
          "Publicaciones con las más recientes a la vista y el resto en un desplegable nativo.",
      },
    ],
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

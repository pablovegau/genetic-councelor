// Geometría del árbol genealógico de ejemplo (guías de la NSGC): tres generaciones, el hombre a la
// izquierda de cada pareja y una flecha en la persona que consulta (el probando).
export const treeViewBox = "37.5 9 345 272";

export const treeLines = [
  // Generación I: pareja y sus dos hijos (II.2 y II.3).
  "M178 40H222M200 40V100M150 100H250M150 100V130M250 100V130",
  // II.1 + II.2 y su hijo (III.1).
  "M88 148H132M110 148V232",
  // II.3 + II.4 y sus dos hijos (III.2 y III.3).
  "M268 148H312M290 148V205M250 205H330M250 205V232M330 205V232",
];

/** Una misma condición lleva siempre el mismo color: a (violeta) y b (naranja). */
export type TreeCondition = "a" | "b";
/** Cada símbolo dice si es un hombre (cuadrado) o una mujer (círculo) y su estado. */
export type TreeSymbol =
  | "man"
  | "woman"
  | "manCarrier"
  | "womanCarrier"
  | "manAffected"
  | "womanAffected"
  | "manOther"
  | "womanOther"
  | "proband";

export interface TreeNode {
  shape: "square" | "circle";
  /** Generación a la que pertenece (se dice en el texto interactivo, no en el dibujo). */
  generation: "I" | "II" | "III";
  /** Centro del símbolo. */
  cx: number;
  cy: number;
  symbol: Exclude<TreeSymbol, "proband">;
  /** Relleno entero: la persona tiene esa condición. */
  fill?: TreeCondition;
  /** Punto en el centro: portador o portadora sin síntomas de la condición a. */
  carrier?: boolean;
}

export const treeNodes: TreeNode[] = [
  // I
  { generation: "I", shape: "square", cx: 160, cy: 40, symbol: "man" },
  {
    generation: "I",
    shape: "circle",
    cx: 240,
    cy: 40,
    symbol: "womanCarrier",
    carrier: true,
  },
  // II
  {
    generation: "II",
    shape: "square",
    cx: 70,
    cy: 148,
    symbol: "manCarrier",
    carrier: true,
  },
  {
    generation: "II",
    shape: "circle",
    cx: 150,
    cy: 148,
    symbol: "womanCarrier",
    carrier: true,
  },
  {
    generation: "II",
    shape: "square",
    cx: 250,
    cy: 148,
    symbol: "manOther",
    fill: "b",
  },
  { generation: "II", shape: "circle", cx: 330, cy: 148, symbol: "woman" },
  // III
  {
    generation: "III",
    shape: "square",
    cx: 110,
    cy: 250,
    symbol: "manAffected",
    fill: "a",
  },
  {
    generation: "III",
    shape: "circle",
    cx: 250,
    cy: 250,
    symbol: "womanOther",
    fill: "b",
  },
  { generation: "III", shape: "square", cx: 330, cy: 250, symbol: "man" },
];

/** Flecha del probando (II.2): el cuerpo y la punta, apuntando al símbolo desde arriba a la izquierda. */
export const probandArrow = "M107 105L130 128M130 128H118M130 128V116";

/** Lado de los cuadrados y radio de los círculos. */
export const squareSize = 36;
export const circleRadius = 18;
export const carrierDotRadius = 6;

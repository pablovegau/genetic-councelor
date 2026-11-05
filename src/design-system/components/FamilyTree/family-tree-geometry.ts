// Geometría del árbol genealógico de ejemplo.
export const treeViewBox = "37.5 9 345 272";

export const treeLines = [
  "M128 40H272M200 40V100M70 100H270M70 100V130M170 100V130M270 100V130",
  "M288 148H332M310 148V205M270 205H350M270 205V232M350 205V232M70 166V232",
];

export type TreeFill = "f1" | "f2" | "f3";
export type TreeSymbol =
  "man" | "woman" | "manAffected" | "womanAffected" | "carrier";

interface NodeBase {
  symbol: TreeSymbol;
  fill?: TreeFill;
}
export interface SquareNode extends NodeBase {
  shape: "square";
  x: number;
  y: number;
}
export interface CircleNode extends NodeBase {
  shape: "circle";
  cx: number;
  cy: number;
}
/** Círculo con un punto dentro: una mujer portadora. */
export interface CarrierNode extends NodeBase {
  shape: "carrier";
  cx: number;
  cy: number;
}
export type TreeNode = SquareNode | CircleNode | CarrierNode;

export const treeNodes: TreeNode[] = [
  { shape: "square", symbol: "man", x: 92, y: 22 },
  { shape: "circle", symbol: "woman", cx: 290, cy: 40 },
  { shape: "circle", symbol: "woman", cx: 70, cy: 148 },
  { shape: "square", symbol: "manAffected", fill: "f2", x: 152, y: 130 },
  { shape: "circle", symbol: "womanAffected", fill: "f1", cx: 270, cy: 148 },
  { shape: "square", symbol: "man", x: 332, y: 130 },
  { shape: "carrier", symbol: "carrier", cx: 70, cy: 250 },
  { shape: "circle", symbol: "womanAffected", fill: "f3", cx: 270, cy: 250 },
  { shape: "square", symbol: "manAffected", fill: "f2", x: 332, y: 232 },
];

/** Lado de los cuadrados y radio de los círculos. */
export const squareSize = 36;
export const circleRadius = 18;
export const carrierDotRadius = 6;

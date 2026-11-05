// Filas de la tabla de props que comparten varios primitivos (los style props de Box y de gap).
import {
  bgRoles,
  borderRoles,
  radii,
  spaceSteps,
} from "../style-props.generated";

export interface PropRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

export const quote = (values: readonly string[]) =>
  values.map((value) => `"${value}"`).join(" | ");

const space = quote(spaceSteps);

const row = (
  name: string,
  type: string,
  description: string,
  defaultValue = "—"
): PropRow => ({ name, type, default: defaultValue, description });

export const boxRows: PropRow[] = [
  row("p", space, "Relleno en los cuatro lados (pasos de la escala space)."),
  row("px", space, "Relleno horizontal."),
  row("py", space, "Relleno vertical."),
  row("pt", space, "Relleno superior. Sobrescribe py y p."),
  row("pr", space, "Relleno derecho. Sobrescribe px y p."),
  row("pb", space, "Relleno inferior. Sobrescribe py y p."),
  row("pl", space, "Relleno izquierdo. Sobrescribe px y p."),
  row("bg", quote(bgRoles), "Rol de color de fondo."),
  row(
    "border",
    quote(borderRoles),
    "Borde de un píxel con el rol de color indicado."
  ),
  row("radius", quote(radii), "Radio de esquina semántico."),
];

export const gapRows: PropRow[] = [
  row("gap", space, "Separación entre hijos en ambos ejes."),
  row("gapX", space, "Separación horizontal. Sobrescribe gap."),
  row("gapY", space, "Separación vertical. Sobrescribe gap."),
];

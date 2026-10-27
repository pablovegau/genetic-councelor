// PLACEHOLDER: trazos geométricos simples (24×24) hasta elegir el set de iconos.
export const icons = {
  close: ["M6 6l12 12", "M18 6L6 18"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  "arrow-right": ["M5 12h14", "M13 6l6 6-6 6"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
} as const;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];

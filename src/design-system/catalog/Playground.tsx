import { useState, type ReactNode } from "react";
import { Box, Flex, Grid, Icon, Text } from "../primitives";
import { iconNames } from "../primitives/Icon/icons";
import {
  bgRoles,
  borderRoles,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  spaceSteps,
  textColors,
  textVariants,
} from "../style-props.generated";
import styles from "./Playground.module.css";
import { jsxSnippet, type PropKinds, type PropValues } from "./usage";

type Control = { name: string; options: readonly string[] };

interface Config {
  controls: Control[];
  kinds: PropKinds;
  initial: PropValues;
  children: string;
  render: (values: PropValues, content: string) => ReactNode;
}

const aligns = ["start", "center", "end"];
const boolean = ["true"];
const chips = ["uno", "dos", "tres", "cuatro"];
const cells = [1, 2, 3, 4, 5, 6];

// Las props llegan como cadenas desde los selectores; el componente real las tipa de forma estricta.
type Loose = Record<string, never>;
const loose = (values: PropValues) => values as unknown as Loose;

const cell = (key: string | number, label: string | number) => (
  <Box key={key} px="3" py="2" bg="surface" border="default" radius="control">
    <Text as="span" size="2">
      {label}
    </Text>
  </Box>
);

const configs = {
  Text: {
    controls: [
      { name: "variant", options: textVariants },
      {
        name: "as",
        options: ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "label"],
      },
      { name: "size", options: fontSizes },
      { name: "weight", options: fontWeights },
      { name: "color", options: textColors },
      { name: "leading", options: lineHeights },
      { name: "align", options: aligns },
    ],
    kinds: {},
    initial: { variant: "heading-3" },
    children: "Asesoramiento genético",
    render: (values, content) => <Text {...loose(values)}>{content}</Text>,
  },
  Box: {
    controls: [
      { name: "as", options: ["div", "section", "aside", "article", "span"] },
      { name: "p", options: spaceSteps },
      { name: "px", options: spaceSteps },
      { name: "py", options: spaceSteps },
      { name: "pt", options: spaceSteps },
      { name: "pr", options: spaceSteps },
      { name: "pb", options: spaceSteps },
      { name: "pl", options: spaceSteps },
      { name: "bg", options: bgRoles },
      { name: "border", options: borderRoles },
      { name: "radius", options: radii },
    ],
    kinds: {},
    initial: { p: "4", bg: "surface", border: "default", radius: "surface" },
    children: "Contenido",
    render: (values) => (
      <Box {...loose(values)}>
        <Text as="span">Contenido</Text>
      </Box>
    ),
  },
  Flex: {
    controls: [
      {
        name: "direction",
        options: ["row", "column", "row-reverse", "column-reverse"],
      },
      {
        name: "align",
        options: ["start", "center", "end", "stretch", "baseline"],
      },
      {
        name: "justify",
        options: ["start", "center", "end", "between", "around"],
      },
      { name: "wrap", options: boolean },
      { name: "inline", options: boolean },
      { name: "gap", options: spaceSteps },
      { name: "gapX", options: spaceSteps },
      { name: "gapY", options: spaceSteps },
      { name: "p", options: spaceSteps },
      { name: "bg", options: bgRoles },
      { name: "radius", options: radii },
    ],
    kinds: { wrap: "boolean", inline: "boolean" },
    initial: { gap: "2", justify: "between", align: "center" },
    children: "…",
    render: (values) => (
      <Flex
        {...loose({ ...values, wrap: undefined, inline: undefined })}
        wrap={values.wrap === "true"}
        inline={values.inline === "true"}
      >
        {chips.map((chip) => cell(chip, chip))}
      </Flex>
    ),
  },
  Grid: {
    controls: [
      { name: "columns", options: ["1", "2", "3", "4", "5", "6", "12"] },
      { name: "minColumn", options: spaceSteps },
      { name: "align", options: ["start", "center", "end", "stretch"] },
      { name: "gap", options: spaceSteps },
      { name: "gapX", options: spaceSteps },
      { name: "gapY", options: spaceSteps },
      { name: "p", options: spaceSteps },
    ],
    kinds: { columns: "number" },
    initial: { columns: "3", gap: "3" },
    children: "…",
    render: (values) => (
      <Grid
        {...loose({ ...values, columns: undefined })}
        columns={
          values.columns
            ? (Number(values.columns) as 1 | 2 | 3 | 4 | 5 | 6 | 12)
            : undefined
        }
      >
        {cells.map((n) => cell(n, `celda ${n}`))}
      </Grid>
    ),
  },
  Icon: {
    controls: [
      { name: "name", options: iconNames },
      { name: "iconSize", options: spaceSteps },
      { name: "color", options: textColors },
    ],
    kinds: {},
    initial: { name: "check", iconSize: "8" },
    children: "",
    render: (values) => <Icon {...(loose(values) as { name: never })} />,
  },
} satisfies Record<string, Config>;

export type PlaygroundComponent = keyof typeof configs;

/** Probador de un primitivo: eligiendo props se ve el resultado y el código para copiarlo. */
export function Playground({ component }: { component: PlaygroundComponent }) {
  const config: Config = configs[component];
  const [values, setValues] = useState<PropValues>(config.initial);
  const [content, setContent] = useState(config.children);
  const snippet = jsxSnippet(component, values, content, config.kinds);
  const set = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value || undefined }));

  return (
    <div className={styles.playground}>
      <div className={styles.controls}>
        {config.controls.map(({ name, options }) => (
          <label key={name} className={styles.field}>
            <span>{name}</span>
            <select
              value={values[name] ?? ""}
              onChange={(event) => set(name, event.target.value)}
            >
              <option value="">—</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
        {component === "Text" && (
          <label className={styles.field}>
            <span>contenido</span>
            <input
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>
        )}
      </div>
      <div className={styles.preview}>{config.render(values, content)}</div>
      <div className={styles.code}>
        <code>{snippet}</code>
        <button
          type="button"
          className={styles.copy}
          data-copy={snippet}
          aria-label="Copiar el código"
        >
          Copiar
        </button>
      </div>
    </div>
  );
}

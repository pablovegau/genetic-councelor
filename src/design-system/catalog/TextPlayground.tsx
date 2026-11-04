import { useState } from "react";
import { Text } from "../primitives";
import {
  fontSizes,
  fontWeights,
  lineHeights,
  textColors,
  textVariants,
} from "../style-props.generated";
import styles from "./TextPlayground.module.css";
import { jsxSnippet, type PropValues } from "./usage";

const tags = ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "label"];
const aligns = ["start", "center", "end"];

const controls: { name: string; options: readonly string[] }[] = [
  { name: "variant", options: textVariants },
  { name: "as", options: tags },
  { name: "size", options: fontSizes },
  { name: "weight", options: fontWeights },
  { name: "color", options: textColors },
  { name: "leading", options: lineHeights },
  { name: "align", options: aligns },
];

/** Probador del componente Text: eligiendo props se ve el resultado y el código para copiarlo. */
export function TextPlayground() {
  const [values, setValues] = useState<PropValues>({ variant: "heading-3" });
  const [content, setContent] = useState("Asesoramiento genético");
  const snippet = jsxSnippet("Text", values, content);
  const set = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value || undefined }));

  return (
    <div className={styles.playground}>
      <div className={styles.controls}>
        {controls.map(({ name, options }) => (
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
        <label className={styles.field}>
          <span>contenido</span>
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>
      </div>
      <div className={styles.preview}>
        <Text
          {...(values as Record<string, never>)}
          as={(values.as as "p" | undefined) ?? undefined}
        >
          {content}
        </Text>
      </div>
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

/**
 * Valor calculado que el navegador da a `property: value`, p. ej. `padding-top: var(--space-4)`.
 * Sirve de expectativa independiente del componente: pasa por el mismo CSS y los mismos tokens,
 * pero sin usar los atributos `data-*` que se están probando.
 *
 * `context` añade declaraciones a la sonda cuando el valor calculado depende de otras:
 * el ancho de un borde necesita `border-style`, y un interlineado sin unidad, un `font-size`.
 */
export function computed(
  property: string,
  value: string,
  context: Record<string, string> = {}
) {
  const probe = document.createElement("div");
  for (const [name, contextValue] of Object.entries(context))
    probe.style.setProperty(name, contextValue);
  probe.style.setProperty(property, value);
  document.body.append(probe);
  const result = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return result;
}

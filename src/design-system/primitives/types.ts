import type { ComponentPropsWithRef, ElementType } from "react";

/** Props propios del componente más los atributos del elemento elegido con `as`. */
export type PolymorphicProps<T extends ElementType, Own = object> = Own & {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithRef<T>, keyof Own | "as" | "className">;

export type Locale = "es" | "ca" | "en";

export interface TreeNodeCopy {
  /** Nombre accesible del símbolo. */
  label: string;
  /** Explicación que se muestra al pasar el ratón, enfocar o tocar. */
  text: string;
}

export interface Copy {
  meta: { title: string; description: string };
  site: {
    brand: string;
    mainNav: string;
    nav: { about: string; contact: string };
    book: string;
    languages: string;
    openMenu: string;
    closeMenu: string;
    toDark: string;
    toLight: string;
  };
  hero: {
    title: string;
    text: string;
    role: string;
    confidential: string;
  };
  tree: {
    ariaLabel: string;
    caption: string;
    man: TreeNodeCopy;
    woman: TreeNodeCopy;
    manAffected: TreeNodeCopy;
    womanAffected: TreeNodeCopy;
    carrier: TreeNodeCopy;
  };
  situations: {
    title: string;
    lead: string;
    items: { title: string; text: string }[];
  };
  process: {
    title: string;
    lead: string;
    steps: {
      when: string;
      title: string;
      text: string;
      key: string;
      value: string;
    }[];
  };
  about: {
    imageAlt: string;
    text: [string, string];
    link: string;
  };
  closing: { title: string; lead: string };
  footer: {
    tagline: string;
    pages: string;
    home: string;
    legal: string;
    legalLinks: string[];
    contact: string;
    email: string;
    copyright: string;
  };
}

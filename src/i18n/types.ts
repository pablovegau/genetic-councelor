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
    generation: string;
    ariaLabel: string;
    caption: string;
    man: TreeNodeCopy;
    woman: TreeNodeCopy;
    manCarrier: TreeNodeCopy;
    womanCarrier: TreeNodeCopy;
    manAffected: TreeNodeCopy;
    womanAffected: TreeNodeCopy;
    manOther: TreeNodeCopy;
    womanOther: TreeNodeCopy;
    proband: TreeNodeCopy;
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
  legal: {
    updated: string;
    onlySpanish: string;
    /** Descripción de cada página legal, en el orden de `footer.legalLinks`. */
    descriptions: [string, string, string, string];
  };
  closing: { title: string; lead: string };
  booking: {
    meta: { title: string; description: string };
    title: string;
    lead: string;
    visitsTitle: string;
    first: { name: string; description: string };
    followup: { name: string; description: string };
    terms: { text: string; link: string };
    choose: string;
    /** Mientras carga el calendario de Cal.com. */
    loading: string;
    /** Si el calendario no carga; junto al enlace de respaldo. */
    error: string;
    /** Con las reservas desactivadas; va seguido del correo de contacto. */
    soon: string;
    embedTitle: string;
    embedHint: string;
    fallback: string;
    privacy: string;
    thirdParty: string;
  };
  aboutPage: {
    meta: { title: string; description: string };
    lead: string;
    careerTitle: string;
    career: string[];
    pressTitle: string;
    press: string[];
    publicationsTitle: string;
    publicationsLead: string;
    /** Con `{count}`: el número de publicaciones. */
    total: string;
    /** Con `{count}`: las que quedan por ver. */
    more: string;
    newTab: string;
  };

  footer: {
    tagline: string;
    pages: string;
    home: string;
    legal: string;
    legalLinks: string[];
    contact: string;
    copyright: string;
  };
}

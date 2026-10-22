/* ==========================================================================
   Footer : toutes les informations modifiables.
   Règle : une valeur vide ("") masque l'élément. Rien n'est inventé.
   ========================================================================== */

export type FooterLink = { label: string; href: string };

export const footerConfig = {
  /** Identité affichée dans la barre inférieure (© année — nom). */
  name: "Arel",

  /** Phrase principale. Un point final est rendu en vert citron. */
  statement: ["Built with intention.", "Shipped with purpose."],

  description:
    "Full Stack Developer crafting thoughtful digital experiences with modern web technologies.",

  /** Adresse email (lien mailto). À renseigner : vide = masquée. */
  email: "areltohoubi@gmail.com",

  /** Profils. Un href vide masque le lien. Renseigne uniquement des URL réelles. */
  socials: [
    { label: "GitHub", href: "https://github.com/areltohoubi" }, // ex. "https://github.com/ton-pseudo"
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/arel-tohoubi-934a122b6",
    }, // ex. "https://www.linkedin.com/in/ton-profil"
  ] satisfies FooterLink[],

  /** Affiché uniquement si renseigné. Garde-le cohérent avec la navbar. */
  availability: "Available for opportunities",

  tagline: "Designed & developed with care.",

  /**
   * Navigation : mêmes identifiants de sections que la navbar.
   * Les liens utilisent "/#id" pour fonctionner aussi depuis /projects/[slug].
   */
  nav: [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "stack", label: "Stack" },
    { id: "contact", label: "Contact" },
  ],
} as const;

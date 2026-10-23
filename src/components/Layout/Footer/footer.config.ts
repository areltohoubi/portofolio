/* ==========================================================================
   Footer : toutes les informations modifiables.
   Règle : une valeur vide ("") masque l'élément. Rien n'est inventé.
   ========================================================================== */

import { contactConfig } from "@/components/Section/Contact/contact.config";


export type FooterLink = { label: string; href: string };

export const footerConfig = {
  /** Identité affichée dans la barre inférieure (© année — nom). */
  name: "Arel",

  /** Phrase principale. Un point final est rendu en vert citron. */
  statement: ["Built with intention.", "Shipped with purpose."],

  description:
    "Full Stack Developer crafting thoughtful digital experiences with modern web technologies.",

  /** Email, profils et disponibilité viennent de contact.config.ts (source unique). */
  email: contactConfig.email,
  socials: contactConfig.socials,
  availability: contactConfig.availability,

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

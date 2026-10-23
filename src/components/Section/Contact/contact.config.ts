/**
 * Toutes les informations personnelles de la section Contact.
 * Rien n'est inventé : une valeur vide masque l'élément correspondant.
 * Renseigne les variables dans .env.local (voir .env.contact.example).
 */

export type SocialLink = { label: string; href: string };

export const contactConfig = {
  /** Numéro affiché dans l'indicateur éditorial : adapte-le à l'ordre réel des sections. */
  sectionNumber: "04",
  eyebrow: "GET IN TOUCH",

  /** Titre : la partie `highlight` est affichée en vert citron. */
  title: {
    line1: "Have a good project?",
    line2Before: "Let's make it",
    highlight: "happen",
    line2After: ".",
  },

  intro:
    "Have an idea, a project to build, or an opportunity to discuss? I'm always interested in meaningful conversations about web development and digital products.",

  /** Adresse affichée, cliquable (mailto:) et copiable. Vide = bloc masqué. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /** Mets `show: true` uniquement si l'information est confirmée. */
  availability: {
    show: process.env.NEXT_PUBLIC_AVAILABLE === "true",
    label: "Open to opportunities",
  },

  /** Les liens sans URL sont masqués automatiquement. */
  socials: [
    { label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL ?? "" },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "" },
    { label: "Website", href: process.env.NEXT_PUBLIC_WEBSITE_URL ?? "" },
  ] satisfies SocialLink[],
};

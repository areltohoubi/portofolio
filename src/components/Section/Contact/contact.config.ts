/* ==========================================================================
   Contact : toutes les informations personnelles et textes modifiables.
   Règle : une valeur vide ("") masque l'élément. Rien n'est inventé.
   Cette config alimente aussi le footer (email, profils, disponibilité) :
   une seule source à renseigner.
   ========================================================================== */

export type ContactLink = { label: string; href: string };

export const contactConfig = {
  /** Numéro affiché dans « 04 / GET IN TOUCH » : adapte-le à l'ordre réel. */
  sectionNumber: "04",
  eyebrow: "GET IN TOUCH",

  /** Titre sur deux lignes ; `accent` est le mot mis en vert citron. */
  titleLines: ["Have a project in mind?", "Let’s make it happen."],
  accent: "happen",

  intro:
    "Have an idea, a project to build, or an opportunity to discuss? I’m always interested in meaningful conversations about web development and digital products.",

  /** À renseigner. Vide : l'adresse et le bouton « copier » sont masqués. */
  email: "areltohoubi@gmail.com",

  /** Réseaux professionnels. Un href vide masque la ligne. URL réelles uniquement. */
  socials: [
    { label: "GitHub", href: "https://github.com/areltohoubi" }, // ex. "https://github.com/ton-pseudo"
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arel-tohoubi-934a122b6" }, // ex. "https://www.linkedin.com/in/ton-profil"
    { label: "Website", href: "https://www.areltohoubi.com" }, // site personnel complémentaire, si tu en as un
  ] as ContactLink[],

  /** Affiché uniquement si renseigné (vide = masqué). À ne laisser que si c'est vrai. */
  availability: "Open to opportunities",

  /** Signature de fin de section. */
  closing: "Thanks for stopping by.",
  signature: "Arel.",
};

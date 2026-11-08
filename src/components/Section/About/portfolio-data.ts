export const bioKeys = ["p1", "p2"] as const;

/* -------------------------------------------------------------------------
   Tech stack
   Les noms de technologies restent ici ; les descriptions et les listes
   traduisibles sont dans locales/*.ts (scope "Stack").
   ------------------------------------------------------------------------- */
export const contactHref = "#contact";

/** A. Core stack : au premier plan (l'id sert de clé pour la note traduite) */
export const coreStack = [
  { id: "nextjs", name: "Next.js" },
  { id: "react", name: "React" },
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "laravel", name: "Laravel" },
  { id: "php", name: "PHP" },
  { id: "tailwind", name: "Tailwind CSS" },
  { id: "mysql", name: "MySQL" },
] as const;

/** B → F */
export const stackCategoryIds = [
  "frontend",
  "backend",
  "data",
  "tools",
  "concepts",
] as const;

/** Un champ dont la valeur traduite est vide ("") est masqué. */
export const profileKeys = [
  "currentFocus",
  "mainStack",
  "interestedIn",
  "learning",
  "workPreference",
  "availability",
  "languages",
  "location",
  "openTo",
] as const;

export const expertiseIds = [
  "frontend",
  "backend",
  "data",
  "integration",
  "ui",
  "workflow",
] as const;

export const methodologyIds = [
  "understand",
  "design",
  "build",
  "connect",
  "refine",
] as const;

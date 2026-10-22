/* ==========================================================================
   Données de la section About + Stack
   Tout ce qui est affiché vient d'ici : supprime une ligne pour la masquer.
   Rien ici n'est une affirmation de niveau : ce sont des technologies
   que tu choisis d'afficher.
   ========================================================================== */

/* -------------------------------------------------------------------------
   About : en-tête et présentation
   ------------------------------------------------------------------------- */
export const intro =
  "I build digital products that combine thoughtful interfaces, solid architecture and reliable functionality. From the first component to the underlying API, I care about how every part works together.";

/** Premier paragraphe = texte d'accroche (grand). Les suivants = corps. */
export const bio: string[] = [
  "I’m a Full Stack Developer who enjoys building modern web applications, from refined user interfaces to the systems that power them. I like turning ideas into practical digital products, exploring new technologies and finding the right balance between user experience, maintainability and performance.",
  // Paragraphe optionnel : reformule-le ou supprime-le. Il décrit des centres
  // d'intérêt, pas des faits de parcours.
  "I’m drawn to both sides of an application: the interface people touch and the structure that keeps it dependable. I care about consistent interfaces, well-organized code and products that stay useful and maintainable, and I keep learning by solving concrete problems.",
];

/**
 * Informations de profil. Un champ avec une valeur vide ("") est masqué.
 * « Work preference » est volontairement vide : choisis Remote, Hybrid ou On-site.
 */
export type ProfileField = { label: string; value: string };

export const profileInfo: ProfileField[] = [
  { label: "Current focus", value: "Full Stack Development" },
  { label: "Main stack", value: "Next.js, React, Laravel" },
  {
    label: "Interested in",
    value: "UI engineering, software architecture, APIs",
  },
  { label: "Learning mindset", value: "Continuous improvement" },
  { label: "Work preference", value: "" }, // ex. "Remote / Hybrid"
  { label: "Availability", value: "Open to opportunities" },
  { label: "Languages", value: "French, English" },
  { label: "Location", value: "Benin" },
  {
    label: "Open to",
    value: "Freelance projects, internships, collaborations",
  },
];

/* -------------------------------------------------------------------------
   Domaines d'expertise (la numérotation est générée automatiquement)
   ------------------------------------------------------------------------- */
export type Expertise = {
  id: string;
  title: string;
  description: string;
  tech: string[];
};

export const expertise: Expertise[] = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    description:
      "Modern, responsive and accessible interfaces, with attention to visual hierarchy, interaction and performance.",
    tech: [
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    description:
      "API design, data handling and business logic, and the integration between frontend and backend services.",
    tech: [
      "PHP",
      "Laravel",
      "REST APIs",
      "Node.js",
      "Authentication",
      "Authorization",
      "Data validation",
    ],
  },
  {
    id: "data",
    title: "Database & Data Modeling",
    description:
      "Structuring data, designing schemas and connecting them to web applications.",
    tech: [
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "SQL",
      "Database migrations",
      "Relations and constraints",
      "Indexing and queries",
    ],
  },
  {
    id: "integration",
    title: "Full Stack Integration",
    description:
      "Connecting interfaces to APIs and handling state, forms, sessions, errors and data flow.",
    tech: [
      "Next.js App Router",
      "Server Components",
      "Client Components",
      "API integration",
      "Form validation",
      "Authentication flows",
      "State management",
    ],
  },
  {
    id: "ui",
    title: "UI Engineering & Motion",
    description:
      "Detailed interfaces, consistent interactions and smooth, purposeful animation.",
    tech: [
      "Motion (Framer Motion)",
      "GSAP",
      "CSS animations",
      "Responsive design",
      "Accessibility",
      "Component architecture",
    ],
  },
  {
    id: "workflow",
    title: "Development Workflow",
    description:
      "Organizing code, managing versions and preparing applications for deployment.",
    tech: [
      "Git",
      "GitHub",
      "npm",
      "Vite",
      "ESLint",
      "Prettier",
      "Vercel",
      "Linux",
      "Environment variables",
    ],
  },
];

/* -------------------------------------------------------------------------
   Méthodologie (5 étapes, descriptions modifiables)
   ------------------------------------------------------------------------- */
export const methodology: { title: string; description: string }[] = [
  {
    title: "Understand the problem",
    description:
      "Clarify the goal, the people using it and the constraints before writing code.",
  },
  {
    title: "Design the structure",
    description:
      "Shape the data, routes and components so the system stays easy to reason about.",
  },
  {
    title: "Build the interface",
    description:
      "Turn the structure into responsive, accessible and well-composed screens.",
  },
  {
    title: "Connect the logic",
    description:
      "Wire interfaces to APIs, state, forms and authentication flows.",
  },
  {
    title: "Refine and optimize",
    description:
      "Test, polish and improve performance until the details hold together.",
  },
];

/* -------------------------------------------------------------------------
   Tech stack
   - `note` (optionnel) : courte description neutre de l'outil.
   - `hidden: true` : masque l'élément sans le supprimer.
   ------------------------------------------------------------------------- */
export type Tech = { name: string; note?: string; hidden?: boolean };

const list = (...names: string[]): Tech[] => names.map((name) => ({ name }));

export const contactHref = "#contact";

export const stackIntro =
  "A selection of technologies I use to design, develop and connect modern web applications.";

/** A. Core stack : au premier plan */
export const coreStack: Tech[] = [
  { name: "Next.js", note: "App Router, Server and Client Components" },
  { name: "React", note: "Component-driven interfaces" },
  { name: "TypeScript", note: "Typed JavaScript" },
  { name: "JavaScript", note: "The language of the web" },
  { name: "Laravel", note: "PHP framework for web apps and APIs" },
  { name: "PHP", note: "Server-side language" },
  { name: "Tailwind CSS", note: "Utility-first styling" },
  { name: "MySQL", note: "Relational database" },
];

/** B → F */
export type StackCategory = {
  id: string;
  title: string;
  blurb: string;
  items: Tech[];
};

export const stackCategories: StackCategory[] = [
  {
    id: "frontend",
    title: "Frontend ecosystem",
    blurb: "Interfaces, styling and motion.",
    items: list(
      "Vue.js",
      "Pinia",
      "HTML5",
      "CSS3",
      "Sass",
      "Motion (Framer Motion)",
      "GSAP",
      "Lucide",
      "shadcn/ui",
    ),
  },
  {
    id: "backend",
    title: "Backend ecosystem",
    blurb: "APIs, authentication and server logic.",
    items: list(
      "Laravel",
      "PHP",
      "Node.js",
      "Express",
      "REST APIs",
      "Laravel Sanctum",
      "Authentication",
      "Authorization",
      "Middleware",
      "API Resources",
    ),
  },
  {
    id: "data",
    title: "Databases & services",
    blurb: "Storing, modeling and securing data.",
    items: list(
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "Redis",
      "SQLite",
      "Database migrations",
      "Row Level Security",
    ),
  },
  {
    id: "tools",
    title: "Tools & workflow",
    blurb: "Day-to-day tooling and delivery.",
    items: list(
      "Git",
      "GitHub",
      "VS Code",
      "Linux",
      "npm",
      "Composer",
      "Postman",
      "Vercel",
      "Docker",
      "Figma",
    ),
  },
  {
    id: "concepts",
    title: "Concepts & engineering",
    blurb: "The practices behind the code.",
    items: list(
      "Responsive design",
      "Component architecture",
      "State management",
      "API integration",
      "Authentication flows",
      "Database modeling",
      "Error handling",
      "Performance optimization",
      "Accessibility",
      "SEO fundamentals",
      "Clean code",
      "Version control",
      "Testing",
      "Deployment",
      "Security fundamentals",
    ),
  },
];

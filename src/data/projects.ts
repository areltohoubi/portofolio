/* ==========================================================================
   Source unique des projets
   --------------------------------------------------------------------------
   Alimente : la section horizontale, le compteur, la progression, les pages
   d'études de cas (/projects/[slug]), la navigation précédent/suivant et les
   métadonnées.

   AJOUTER un projet   → ajouter un objet dans `projects` (+ ses images dans /public).
   SUPPRIMER un projet → supprimer l'objet. Rien d'autre à modifier.

   Les 4 entrées ci-dessous sont des DONNÉES DE DÉMONSTRATION (`demo: true`).
   Ce sont des modèles à remplacer : elles n'affirment aucune réalisation,
   aucun client, aucun chiffre. Elles affichent un repère « Demo content »
   tant que `demo` est présent. Aucune URL n'est fournie volontairement.
   ========================================================================== */

export type ProjectStatus = "live" | "development" | "archived" | "concept";

export type ProjectImage = {
  src: string; // chemin local dans /public, ex. "/projects/finance/overview.png"
  alt: string; // texte alternatif obligatoire
  caption?: string;
};

export type ArchitectureLayer = {
  label: string; // ex. "Frontend", "Backend", "Database", "Auth", "Deployment"
  value: string;
};

export type CaseStudy = {
  context: string; // contexte et problème (séparer les paragraphes par une ligne vide)
  objectives: string[];
  challenges: string[];
  approach: string;
  features: string[];
  architecture?: {
    summary?: string;
    layers?: ArchitectureLayer[];
  };
  results?: string[]; // uniquement des résultats vérifiés
  learnings?: string[];
  nextSteps?: string[];
};

export type Project = {
  slug: string; // unique et stable : utilisé dans l'URL
  title: string;
  subtitle: string;
  description: string; // 2 à 3 lignes, affichée dans la liste horizontale
  longDescription?: string;
  category: string;
  year?: number;
  status?: ProjectStatus;
  featured?: boolean;
  /** Retire ce champ dès que l'entrée est remplacée par un vrai projet. */
  demo?: boolean;

  image?: string; // capture principale ; sans image, un visuel de remplacement est affiché
  imageAlt?: string;
  gallery?: ProjectImage[];

  liveUrl?: string; // si absent, l'action est masquée
  githubUrl?: string; // si absent, l'action est masquée

  technologies: string[];
  role?: string;

  caseStudy: CaseStudy;
};

/* ==========================================================================
   Données
   ========================================================================== */
export const projects: Project[] = [
  {
    slug: "soclick-ai",
    title: "Soclick",
    subtitle:
      "L'assistant IA pour simplifier la création de contenu social media",

    description:
      "Un assistant intelligent qui transforme une simple idée en contenu prêt à publier sur les réseaux sociaux. Soclick adapte le ton, la structure et le format des publications à chaque plateforme pour simplifier la création de contenu.",

    longDescription:
      "Soclick est une application web conçue pour aider les créateurs de contenu, les indépendants et les entreprises à simplifier leur communication sur les réseaux sociaux. Grâce à l'intelligence artificielle, l'utilisateur peut partir d'une idée brute et générer une publication adaptée à sa plateforme cible, à son ton et à ses objectifs de communication.",

    category: "SaaS / Intelligence artificielle",
    year: 2026,
    status: "live",
    featured: true,

    image: "/projects/soclick-ai/cover.webp",
    imageAlt:
      "Aperçu de l’interface de Zenvy, plateforme de billetterie événementielle",

    liveUrl: "https://soclick-ai.vercel.app/",
    githubUrl: "https://github.com/areltohoubi/soclik",

    technologies: [
      "Next.js",
      "Supabase",
      "OpenAI API",
      "Motion",
      "shadcn/ui",
      "Vercel",
    ],

    role: "Conception et développement full-stack",

    caseStudy: {
      context: `Créer régulièrement du contenu pour les réseaux sociaux demande du temps, de l'inspiration et une bonne compréhension des codes de chaque plateforme. Une idée pertinente pour LinkedIn ne se présente pas nécessairement de la même manière sur Instagram, TikTok ou X.

Pour les indépendants, les créateurs et les petites entreprises, cette adaptation peut rapidement devenir une contrainte et rendre leur communication difficile à maintenir dans la durée.

J'ai conçu Soclick pour simplifier ce processus en proposant un outil capable de transformer une idée exprimée naturellement en une publication structurée, adaptée au réseau ciblé et au ton souhaité.`,

      objectives: [
        "Simplifier la création de publications grâce à l'intelligence artificielle.",
        "Permettre de générer du contenu à partir d'une simple idée, sans maîtriser les techniques de rédaction de prompts.",
        "Adapter les publications aux formats et aux codes des différentes plateformes sociales.",
        "Permettre de personnaliser le ton et la manière de communiquer.",
        "Concevoir une expérience utilisateur fluide, moderne et accessible.",
      ],

      challenges: [
        "Concevoir un parcours de génération simple tout en permettant une personnalisation suffisante du résultat.",
        "Adapter le contenu généré au contexte et aux spécificités de chaque réseau social.",
        "Intégrer l'API OpenAI dans un parcours applicatif cohérent.",
        "Organiser le code en composants réutilisables pour faciliter la maintenance et l'évolution du produit.",
        "Créer une interface soignée avec des animations qui enrichissent l'expérience sans distraire l'utilisateur.",
      ],

      approach: `J'ai développé Soclick avec Next.js pour structurer l'application et construire son interface. L'intégration d'OpenAI permet de transformer les idées fournies par l'utilisateur en contenus générés par l'intelligence artificielle, en tenant compte de la plateforme et du ton sélectionnés.

Supabase complète cette architecture pour les services backend et les données de l'application. Pour l'interface, j'ai utilisé shadcn/ui afin de construire une base de composants cohérente et réutilisable, tandis que Motion permet d'ajouter des animations et des transitions aux interactions.

J'ai privilégié une expérience centrée sur l'essentiel : renseigner une idée, choisir les paramètres de publication, générer le contenu puis récupérer un texte prêt à être utilisé. Cette approche vise à réduire les étapes inutiles et à rendre l'outil accessible même aux utilisateurs peu familiers avec les outils d'IA.`,

      features: [
        "Génération de publications à partir d'une idée ou d'un brief en langage naturel.",
        "Sélection de la plateforme cible : LinkedIn, Instagram, TikTok ou X.",
        "Personnalisation du ton éditorial : professionnel, énergique, humoristique ou éducatif.",
        "Adaptation de la structure, de la longueur et de la présentation du contenu au réseau ciblé.",
        "Génération de différents formats éditoriaux : carrousels, stories, threads, scripts vidéo, publications promotionnelles et contenus éducatifs.",
        "Mise en forme des publications avec des sauts de ligne, des emojis et des hashtags adaptés.",
        "Présentation d'un aperçu du contenu généré et possibilité de le copier pour le publier.",
        "Interface moderne conçue avec des composants réutilisables et des animations.",
      ],

      architecture: {
        summary:
          "Application web full-stack associant Next.js pour le développement de l'application, Supabase pour les services backend et les données, et l'API OpenAI pour la génération de contenu. L'interface s'appuie sur shadcn/ui et Motion, avec un déploiement public sur Vercel.",

        layers: [
          {
            label: "Frontend",
            value: "Next.js",
          },
          {
            label: "Backend & données",
            value: "Supabase",
          },
          {
            label: "Intelligence artificielle",
            value: "API OpenAI",
          },
          {
            label: "Interface utilisateur",
            value: "shadcn/ui",
          },
          {
            label: "Animations",
            value: "Motion",
          },
          {
            label: "Déploiement",
            value: "Vercel",
          },
        ],
      },

      results: [
        "Une version publique du projet est accessible en ligne à l'adresse https://soclick-ai.vercel.app/.",
        "La page de présentation expose le parcours de génération de contenu, les plateformes ciblées et les principaux cas d'utilisation du produit.",
      ],

      learnings: [
        "Intégrer une API d'intelligence artificielle dans une application web orientée produit.",
        "Concevoir des instructions de génération adaptées à différents contextes éditoriaux.",
        "Organiser une application full-stack en séparant l'interface, les services backend et la génération de contenu.",
        "Construire une interface réutilisable avec shadcn/ui et enrichir les interactions avec Motion.",
        "Penser une fonctionnalité d'IA à partir du besoin réel de l'utilisateur plutôt que de la seule technologie.",
      ],

      nextSteps: [
        "Enrichir la personnalisation de la voix de marque pour conserver une ligne éditoriale cohérente.",
        "Développer un historique des générations permettant de retrouver et de réutiliser les publications.",
        "Ajouter des modèles de contenu personnalisables selon les secteurs d'activité et les objectifs de communication.",
        "Explorer la planification des publications et les intégrations avec les réseaux sociaux.",
        "Ajouter des tests automatisés et renforcer le suivi des erreurs et des performances.",
      ],
    },
  },

  {
    slug: "zenvy",
    title: "Zenvy",
    subtitle: "Une expérience moderne de billetterie événementielle",

    description:
      "Une plateforme web dédiée à la découverte d’événements et à la billetterie au Bénin. Zenvy permet aux visiteurs de découvrir des événements et aux organisateurs de créer les leurs, grâce à une interface moderne et intuitive.",

    longDescription:
      "Zenvy est une plateforme web événementielle conçue pour simplifier la découverte et la gestion des événements au Bénin. Elle offre aux visiteurs une expérience de navigation moderne pour explorer les événements, tout en permettant aux organisateurs de créer et de présenter leurs propres événements. Le projet associe une interface responsive à un backend Supabase pour la gestion des données.",

    category: "Application web / Événementiel",
    year: 2026,
    status: "live",
    featured: true,

    image: "/projects/zenvy/cover.png",
    imageAlt:
      "Aperçu de l’interface de Zenvy, plateforme de découverte et de billetterie événementielle",

    liveUrl: "https://zenvy-self.vercel.app/",
    githubUrl: "https://github.com/areltohoubi/zenvy",

    technologies: [
      "Vue 3",
      "JavaScript",
      "Supabase",
      "Tailwind CSS v4",
      "Motion",
      "shadcn-vue",
      "Vercel",
    ],

    role: "Conception UI et développement full-stack",

    caseStudy: {
      context: `La découverte d’événements et l’accès à la billetterie représentent une opportunité de proposer une expérience numérique plus simple et plus agréable. Les visiteurs doivent pouvoir découvrir les événements facilement, tandis que les organisateurs ont besoin d’un moyen pratique pour présenter et promouvoir leurs activités.

Zenvy répond à ces besoins en proposant une plateforme événementielle destinée au marché béninois. Le projet vise à réunir la découverte d’événements et leur création au sein d’une expérience web cohérente, tout en associant une interface moderne à un backend permettant de gérer les données de l’application.`,

      objectives: [
        "Concevoir une interface moderne et cohérente avec le positionnement événementiel de Zenvy.",
        "Faciliter la découverte et la consultation des événements.",
        "Permettre aux organisateurs de créer et de présenter leurs propres événements.",
        "Mettre en place un backend avec Supabase pour gérer les données de l’application.",
        "Créer une expérience responsive adaptée aux différents formats d’écran.",
        "Utiliser les animations pour enrichir l’expérience utilisateur sans nuire à la lisibilité.",
      ],

      challenges: [
        "Concevoir une interface adaptée aux besoins des visiteurs comme à ceux des organisateurs.",
        "Organiser les informations d’un événement de manière claire et cohérente.",
        "Connecter l’interface Vue 3 au backend Supabase pour gérer les données.",
        "Structurer les composants afin de faciliter la maintenance et les évolutions du projet.",
        "Maintenir une expérience fluide et cohérente sur ordinateur comme sur mobile.",
      ],

      approach: `J’ai conçu Zenvy en privilégiant une interface moderne, une hiérarchie visuelle claire et une navigation intuitive. L’objectif est de faciliter la découverte des événements pour les visiteurs tout en proposant aux organisateurs un moyen de créer et de présenter leurs propres événements.

Le développement Front-End s’appuie sur Vue 3 et une approche par composants réutilisables. Tailwind CSS permet de construire une interface cohérente et responsive, tandis que shadcn-vue fournit des composants d’interface et que Motion enrichit les interactions avec des animations ciblées.

Pour la partie backend, j’utilise Supabase afin de gérer les données de l’application et de connecter les fonctionnalités métier à l’interface. Cette séparation entre la présentation et les données permet de structurer le projet de manière évolutive.

Le déploiement sur Vercel rend l’application accessible en ligne et facilite la mise à disposition du projet.`,

      features: [
        "Présentation de la plateforme et de son offre événementielle.",
        "Découverte et consultation des événements proposés.",
        "Possibilité pour les organisateurs de créer et de renseigner leurs événements.",
        "Gestion des données de l’application à l’aide de Supabase.",
        "Interface moderne et responsive adaptée aux différentes tailles d’écran.",
        "Composants d’interface réutilisables pour assurer la cohérence visuelle.",
        "Animations et transitions pour enrichir les interactions.",
      ],

      architecture: {
        summary:
          "Architecture web full-stack associant Vue 3 pour l’interface, Supabase pour le backend et la gestion des données, Tailwind CSS et shadcn-vue pour l’interface utilisateur, Motion pour les animations et Vercel pour le déploiement.",

        layers: [
          {
            label: "Frontend",
            value: "Vue 3 et composants réutilisables",
          },
          {
            label: "Langage",
            value: "JavaScript",
          },
          {
            label: "Backend & données",
            value: "Supabase",
          },
          {
            label: "Styling",
            value: "Tailwind CSS v4",
          },
          {
            label: "Composants UI",
            value: "shadcn-vue",
          },
          {
            label: "Animations",
            value: "Motion",
          },
          {
            label: "Déploiement",
            value: "Vercel",
          },
        ],
      },

      results: [
        "Une version du site est accessible publiquement à l’adresse https://zenvy-self.vercel.app/.",
        "Le projet associe une interface de découverte d’événements à une fonctionnalité de création d’événements destinée aux organisateurs.",
      ],

      learnings: [
        "Développer une application full-stack en reliant une interface Vue 3 à un backend Supabase.",
        "Structurer les données d’une application événementielle pour répondre aux besoins des visiteurs et des organisateurs.",
        "Concevoir des composants réutilisables pour améliorer la maintenabilité du code.",
        "Combiner une interface responsive, des composants UI et des animations au sein d’une expérience cohérente.",
        "Organiser les différentes couches d’une application web pour faciliter son évolution.",
      ],

      nextSteps: [
        "Enrichir les fonctionnalités de gestion des événements destinées aux organisateurs.",
        "Améliorer les outils de recherche et de filtrage des événements.",
        "Approfondir les parcours de réservation et de billetterie.",
        "Renforcer les tests fonctionnels, l’accessibilité et les performances.",
      ],
    },
  },

  // {
  //   slug: "admin-dashboard",
  //   title: "Admin Dashboard",
  //   subtitle: "Demo entry: internal tooling.",
  //   description:
  //     "Demo entry for an administrative back-office with tables, filters and role-based access.",
  //   category: "Dashboard",
  //   status: "development",
  //   demo: true,
  //   technologies: [
  //     "Vue.js",
  //     "Pinia",
  //     "Laravel",
  //     "MySQL",
  //     "Laravel Sanctum",
  //     "Tailwind CSS",
  //   ],
  //   caseStudy: {
  //     context: "Placeholder context for an internal tool.",
  //     objectives: ["Describe the main goal."],
  //     challenges: [],
  //     approach: "Placeholder approach.",
  //     features: ["Describe a key feature."],
  //     architecture: {
  //       layers: [
  //         { label: "Frontend", value: "Vue.js with Pinia" },
  //         { label: "Backend", value: "Laravel API" },
  //         { label: "Authentication", value: "Laravel Sanctum" },
  //       ],
  //     },
  //   },
  // },
  // {
  //   slug: "booking-platform",
  //   title: "Booking Platform",
  //   subtitle: "Demo entry with only the required fields.",
  //   description:
  //     "Demo entry showing how a project renders with the minimum amount of data.",
  //   category: "Web application",
  //   demo: true,
  //   technologies: ["Next.js", "TypeScript"],
  //   caseStudy: {
  //     context: "Placeholder context.",
  //     objectives: [],
  //     challenges: [],
  //     approach: "Placeholder approach.",
  //     features: [],
  //   },
  // },

  /* ---------------------------------------------------------------------
     Modèle pour un vrai projet (à copier, décommenter et remplir) :

  {
    slug: "my-project",                       // unique, minuscules, tirets
    title: "My Project",
    subtitle: "One-line hook.",
    description: "Two or three lines for the horizontal list.",
    category: "SaaS",
    year: 2025,
    status: "live",
    image: "/projects/my-project/cover.png",    // fichier dans /public
    imageAlt: "Dashboard of My Project showing …",
    liveUrl: "https://…",                       // seulement si l'URL est réelle
    githubUrl: "https://github.com/…",          // seulement si le dépôt est réel
    technologies: ["Next.js", "Laravel"],
    role: "Full Stack Developer",
    caseStudy: { context: "…", objectives: ["…"], challenges: ["…"], approach: "…", features: ["…"] },
  },
  --------------------------------------------------------------------- */
];

/* ==========================================================================
   Helpers : l'ordre du tableau fait foi (aucun ordre codé en dur ailleurs)
   ========================================================================== */
export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  development: "In development",
  archived: "Archived",
  concept: "Concept",
};

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous?: Project;
  next?: Project;
} {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { previous: projects[i - 1], next: projects[i + 1] };
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

/* Garde-fou en développement : slugs dupliqués ou invalides */
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const { slug } of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      console.warn(
        `[projects] Invalid slug "${slug}": use lowercase letters, digits and hyphens.`,
      );
    }
    if (seen.has(slug)) console.warn(`[projects] Duplicate slug "${slug}".`);
    seen.add(slug);
  }
}

import { MetadataRoute } from "next";

// Exemple si vous récupérez vos slugs dynamiques depuis votre dossier data/
const locales = ["fr", "en"];
const projectSlugs = ["soclick-ai", "zenvy"]; // À remplacer par vos données réelles

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://areltohoubi.com";

  // 1. Pages statiques (Accueil, etc.)
  const staticRoutes = locales.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1.0,
  }));

  // 2. Pages dynamiques de projets
  const projectRoutes = locales.flatMap((lang) =>
    projectSlugs.map((slug) => ({
      url: `${baseUrl}/${lang}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticRoutes, ...projectRoutes];
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://votre-domaine.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"], // Masque vos routes API si nécessaire
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

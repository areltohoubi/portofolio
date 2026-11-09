import type { Metadata } from "next";
import { neueMontreal } from "../fonts";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar/Navbar";
import Footer from "@/components/Layout/Footer/Footer";
import { ReactNode } from "react";
import { getStaticParams } from "../../../locales/server";
import { I18nProviderClient } from "../../../locales/client";

// Définissez le domaine de votre site (à adapter avec votre URL réelle)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://areltohoubi.com";

export function generateStaticParams() {
  return getStaticParams(); // [{ locale: 'en' }, { locale: 'fr' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFrench = locale === "fr";

  const title = isFrench
    ? "Arel Tohoubi — Développeur Fullstack (Next.js & Laravel)"
    : "Arel Tohoubi — Fullstack Developer (Next.js & Laravel)";

  const description = isFrench
    ? "Développeur Fullstack spécialisé dans la conception d'applications web performantes avec Next.js, Laravel et TypeScript. Interfaces épurées et architectures robustes."
    : "Fullstack Developer specialized in building high-performance web applications using Next.js, Laravel, and TypeScript. Clean interfaces and robust architectures.";

  const keywords = isFrench
    ? [
        "Développeur Fullstack",
        "Arel Tohoubi",
        "Next.js",
        "Laravel",
        "React",
        "TypeScript",
        "PHP",
        "API REST",
        "UI/UX",
        "Portfolio",
      ]
    : [
        "Fullstack Developer",
        "Arel Tohoubi",
        "Next.js",
        "Laravel",
        "React",
        "TypeScript",
        "PHP",
        "REST API",
        "UI/UX",
        "Portfolio",
      ];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Arel Tohoubi",
    },
    description,
    keywords,
    authors: [{ name: "Arel Tohoubi", url: SITE_URL }],
    creator: "Arel Tohoubi",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Arel Tohoubi Portfolio",
      locale: isFrench ? "fr_FR" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@areltohoubi",
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`antialiased ${neueMontreal.variable} bg-background font-sans`}
      >
        <I18nProviderClient locale={locale}>
          <Navbar />
          {children}
          <Footer />
        </I18nProviderClient>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { neueMontreal } from "../fonts";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar/Navbar";
import Footer from "@/components/Layout/Footer/Footer";
import { ReactNode } from "react";
import { getStaticParams } from "../../../locales/server";
import { I18nProviderClient } from "../../../locales/client";

export function generateStaticParams() {
  return getStaticParams(); // Retourne [{ locale: 'en' }, { locale: 'fr' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFrench = locale === "fr";

  const titles = {
    fr: "Arel Tohoubi | Portfolio",
    en: "Arel Tohoubi | Portfolio",
  };

  const descriptions = {
    fr: "Développeur Frontend spécialisé dans la création d'interfaces épurées et d'expériences numériques mémorables.",
    en: "Frontend Developer specialized in creating clean interfaces and memorable digital experiences.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
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

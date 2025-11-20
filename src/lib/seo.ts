// SEO utilities for dynamic meta tags
import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

export function generateSEO(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = "/og-image.png",
    url = "https://brinde.ai",
    type = "website",
  } = config;

  const fullTitle = `${title} | Brinde.AI`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, "jogos de bebida", "drinks", "IA", "festas"],
    authors: [{ name: "Brinde.AI" }],
    creator: "Brinde.AI",
    publisher: "Brinde.AI",
    robots: "index, follow",
    openGraph: {
      type,
      locale: "pt_BR",
      url,
      title: fullTitle,
      description,
      siteName: "Brinde.AI",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@brindeai",
    },
    alternates: {
      canonical: url,
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    themeColor: "#00FF00",
  };
}

// Structured data for rich snippets
export function generateStructuredData(type: "WebSite" | "WebApplication" | "Game") {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    name: "Brinde.AI",
    description: "A plataforma definitiva para jogos de bebida inteligentes com IA",
    url: "https://brinde.ai",
    image: "https://brinde.ai/og-image.png",
    author: {
      "@type": "Organization",
      name: "Brinde.AI",
    },
  };

  if (type === "WebSite") {
    return {
      ...baseData,
      potentialAction: {
        "@type": "SearchAction",
        target: "https://brinde.ai/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };
  }

  return baseData;
}

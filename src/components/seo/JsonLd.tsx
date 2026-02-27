import { siteConfig } from "@/config/site";
import type { Product } from "@/types/product";
import { getItemCondition, getItemAvailability } from "@/lib/product-utils";

/** Escape </script> sequences to prevent XSS in JSON-LD blocks */
function safeJsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/<\/script>/gi, "<\\/script>");
}

export const OrganizationJsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mehmet Akif, Kılıç Ali Sk. No:32",
      addressLocality: "Küçükçekmece/İstanbul",
      postalCode: "34000",
      addressCountry: "TR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

export const WebSiteJsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/urunler?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

interface ProductJsonLdProps {
  product: Product;
  description: string;
  status?: string | null;
}

export const ProductJsonLd = ({ product, description, status }: ProductJsonLdProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: product.images[0] ?? undefined,
    sku: product.code ?? undefined,
    brand: { "@type": "Brand", name: product.brand },
    url: `${siteConfig.url}/urun/${product.slug}`,
    category: product.categories?.name ?? undefined,
    itemCondition: getItemCondition(status ?? null),
    seller: { "@type": "Organization", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      availability: getItemAvailability(status ?? null),
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbJsonLd = ({ items }: { items: BreadcrumbItem[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

interface FAQItem {
  q: string;
  a: string;
}

export const FAQPageJsonLd = ({ faqs }: { faqs: FAQItem[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
};

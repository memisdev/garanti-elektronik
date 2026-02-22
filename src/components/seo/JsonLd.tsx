import { siteConfig } from "@/config/site";

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

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand: string;
  url: string;
}

export const ProductJsonLd = ({ name, description, image, sku, brand, url }: ProductJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: { "@type": "Brand", name: brand },
    url,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      price: "0",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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

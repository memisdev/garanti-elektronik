"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/lib/product-utils";

interface ProductFAQProps {
  faqs: FAQItem[];
}

export default function ProductFAQ({ faqs }: ProductFAQProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Sıkça Sorulan Sorular
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-sm text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

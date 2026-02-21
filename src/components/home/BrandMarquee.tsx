"use client";

import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface BrandMarqueeProps {
  brands: Brand[];
}

const BrandMarquee = ({ brands }: BrandMarqueeProps) => {
  return (
    <section className="bg-foreground border-t border-primary-foreground/[0.08] py-10 overflow-hidden">
      <div className="marquee-container relative overflow-hidden">
        <div className="marquee-track flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              to={`/marka/${brand.slug}`}
              className="text-primary-foreground/40 hover:text-primary-foreground/70 text-sm sm:text-[15px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300 shrink-0"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
ALTER TABLE public.products ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN featured_order integer NOT NULL DEFAULT 0;
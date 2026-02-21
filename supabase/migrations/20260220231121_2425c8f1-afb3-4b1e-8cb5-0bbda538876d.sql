
-- TV Models table
CREATE TABLE public.tv_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_number text NOT NULL UNIQUE,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  screen_size text,
  year text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Junction table
CREATE TABLE public.model_product_compatibility (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tv_model_id uuid NOT NULL REFERENCES public.tv_models(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tv_model_id, product_id)
);

-- Enable RLS
ALTER TABLE public.tv_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_product_compatibility ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read tv_models" ON public.tv_models FOR SELECT USING (true);
CREATE POLICY "Public can read compatibility" ON public.model_product_compatibility FOR SELECT USING (true);

-- Admin write policies for tv_models
CREATE POLICY "Admins can insert tv_models" ON public.tv_models FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tv_models" ON public.tv_models FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tv_models" ON public.tv_models FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin write policies for model_product_compatibility
CREATE POLICY "Admins can insert compatibility" ON public.model_product_compatibility FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update compatibility" ON public.model_product_compatibility FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete compatibility" ON public.model_product_compatibility FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger for tv_models
CREATE TRIGGER update_tv_models_updated_at
BEFORE UPDATE ON public.tv_models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

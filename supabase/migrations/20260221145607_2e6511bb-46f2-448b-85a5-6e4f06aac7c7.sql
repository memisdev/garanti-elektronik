
-- Create page_contents table for editable page texts
CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page_key, section_key)
);

-- Enable RLS
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can read page contents"
ON public.page_contents FOR SELECT
USING (true);

-- Admins can insert
CREATE POLICY "Admins can insert page contents"
ON public.page_contents FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update page contents"
ON public.page_contents FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete page contents"
ON public.page_contents FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Auto-update timestamp
CREATE TRIGGER update_page_contents_updated_at
BEFORE UPDATE ON public.page_contents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

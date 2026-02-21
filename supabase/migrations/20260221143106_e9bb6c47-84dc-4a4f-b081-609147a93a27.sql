
-- Fix: All public read policies are RESTRICTIVE, need to be PERMISSIVE to grant access

-- products
DROP POLICY "Public can read products" ON public.products;
CREATE POLICY "Public can read products" ON public.products FOR SELECT USING (true);

-- brands
DROP POLICY "Public can read brands" ON public.brands;
CREATE POLICY "Public can read brands" ON public.brands FOR SELECT USING (true);

-- categories
DROP POLICY "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);

-- model_product_compatibility
DROP POLICY "Public can read compatibility" ON public.model_product_compatibility;
CREATE POLICY "Public can read compatibility" ON public.model_product_compatibility FOR SELECT USING (true);

-- site_settings
DROP POLICY "Public can read settings" ON public.site_settings;
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);

-- tv_models
DROP POLICY "Public can read tv_models" ON public.tv_models;
CREATE POLICY "Public can read tv_models" ON public.tv_models FOR SELECT USING (true);

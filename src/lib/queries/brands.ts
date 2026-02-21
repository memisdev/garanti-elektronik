import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  return data ?? [];
}

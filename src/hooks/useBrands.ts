import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("brands")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setBrands(data ?? []);
        setLoading(false);
      });
  }, []);

  return { brands, loading };
}

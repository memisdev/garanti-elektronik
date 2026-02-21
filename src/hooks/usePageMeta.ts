import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
}

export const usePageMeta = ({ title, description }: PageMeta) => {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);
};

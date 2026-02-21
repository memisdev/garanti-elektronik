/**
 * Optimizes Supabase Storage image URLs by appending width and resize parameters.
 * Non-Supabase URLs are returned unchanged.
 */
export const optimizeImageUrl = (url: string, width: number): string => {
  if (url.includes('supabase.co/storage')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&resize=contain`;
  }
  return url;
};

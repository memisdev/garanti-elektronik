import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

interface SearchBarProps {
  onNavigate?: () => void;
}

const SearchBar = ({ onNavigate }: SearchBarProps) => {
  const { query, setQuery, suggestions } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isFocused && suggestions.length > 0;

  const handleSelect = (slug: string) => {
    navigate(`/urun/${slug}`);
    setQuery("");
    setIsFocused(false);
    onNavigate?.();
  };

  const handleViewAll = () => {
    navigate(`/urunler?q=${encodeURIComponent(query)}`);
    setQuery("");
    setIsFocused(false);
    onNavigate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleViewAll();
    }
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Parça kodu / model / anakart kodu ara"
          className="w-full h-13 pl-11 pr-4 text-sm bg-surface border-0 rounded-2xl placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.slug)}
              className="w-full text-left px-6 py-4 hover:bg-accent/60 transition-colors border-b border-border/30 last:border-b-0"
            >
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.brand} · {item.category === "tv-parca" ? "TV Parça" : "Anakart"}</p>
            </button>
          ))}
          <button
            onClick={handleViewAll}
            className="w-full text-center px-6 py-4 text-sm font-medium text-foreground hover:bg-accent/40 transition-colors"
          >
            Tüm sonuçları gör →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

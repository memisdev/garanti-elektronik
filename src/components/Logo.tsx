const Logo = ({ className = "w-8 h-8", darkInner = false }: { className?: string; darkInner?: boolean }) => {
  const innerFill = darkInner ? "fill-foreground" : "fill-background";
  const innerStroke = darkInner ? "stroke-foreground" : "stroke-background";

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" className="fill-current" />

      <g className={innerFill}>
        <rect x="0" y="11" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="0" y="18.75" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="0" y="26.5" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="34" y="11" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="34" y="18.75" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="34" y="26.5" width="6" height="2.5" rx="0.6" opacity="0.7" />
        <rect x="12" y="0" width="2.5" height="6" rx="0.6" opacity="0.7" />
        <rect x="18.75" y="0" width="2.5" height="6" rx="0.6" opacity="0.7" />
        <rect x="25.5" y="0" width="2.5" height="6" rx="0.6" opacity="0.7" />
        <rect x="12" y="34" width="2.5" height="6" rx="0.6" opacity="0.7" />
        <rect x="18.75" y="34" width="2.5" height="6" rx="0.6" opacity="0.7" />
        <rect x="25.5" y="34" width="2.5" height="6" rx="0.6" opacity="0.7" />
      </g>

      <rect x="8.5" y="8.5" width="23" height="23" rx="2" className={innerStroke} strokeWidth="0.7" opacity="0.12" fill="none" />
      <path d="M8.5 12 L12 8.5" className={innerStroke} strokeWidth="0.7" opacity="0.18" />

      <text
        x="20"
        y="24.5"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="14.5"
        className={innerFill}
        letterSpacing="1"
      >
        GE
      </text>
    </svg>
  );
};

export default Logo;

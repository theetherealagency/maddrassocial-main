const GoldOrnament = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="60"
        height="20"
        viewBox="0 0 60 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="10" x2="18" y2="10" stroke="hsl(44, 50%, 63%)" strokeWidth="1" />
        <circle cx="5" cy="10" r="1.5" fill="hsl(44, 50%, 63%)" />
        <circle cx="12" cy="10" r="1" fill="hsl(44, 50%, 63%)" />
        <path d="M30 2 L38 10 L30 18 L22 10 Z" fill="hsl(44, 50%, 63%)" />
        <path d="M30 5 L35 10 L30 15 L25 10 Z" fill="hsl(41, 38%, 89%)" />
        <circle cx="30" cy="10" r="2" fill="hsl(44, 50%, 63%)" />
        <line x1="42" y1="10" x2="60" y2="10" stroke="hsl(44, 50%, 63%)" strokeWidth="1" />
        <circle cx="55" cy="10" r="1.5" fill="hsl(44, 50%, 63%)" />
        <circle cx="48" cy="10" r="1" fill="hsl(44, 50%, 63%)" />
      </svg>
    </div>
  );
};

export default GoldOrnament;

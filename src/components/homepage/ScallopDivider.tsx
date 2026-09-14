const ScallopDivider = ({ 
  color = "#F2EBD6", 
  direction = "down",
  className = "" 
}: { 
  color?: string; 
  direction?: "down" | "up";
  className?: string;
}) => {
  const transform = direction === "up" ? "scaleY(-1)" : undefined;

  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`} style={{ transform }}>
      <svg
        viewBox="0 0 1920 14"
        preserveAspectRatio="none"
        className="w-full h-[14px] block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: Math.ceil(1920 / 28) }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 28},14 Q${i * 28 + 14},0 ${(i + 1) * 28},14 L${(i + 1) * 28},14 L${i * 28},14 Z`}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
};

export default ScallopDivider;

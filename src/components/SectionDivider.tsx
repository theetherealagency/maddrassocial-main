const SectionDivider = () => {
  return (
    <div className="relative py-0 overflow-visible">
      <div className="flex items-center justify-center gap-4">
        <span className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent to-accent/30" />
        <div className="w-1.5 h-1.5 rotate-45 bg-accent/30" />
        <div className="relative">
          <div className="w-3 h-3 rotate-45 border border-accent/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-accent/40 rounded-full" />
          </div>
        </div>
        <div className="w-1.5 h-1.5 rotate-45 bg-accent/30" />
        <span className="w-12 md:w-24 h-px bg-gradient-to-l from-transparent to-accent/30" />
      </div>
    </div>
  );
};

export default SectionDivider;

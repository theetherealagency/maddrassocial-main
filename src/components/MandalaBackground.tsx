import mandalaPattern from '@/assets/mandala-pattern.png';

interface MandalaBackgroundProps {
  position?: 'center' | 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right' | 'center-left' | 'center-right';
  opacity?: number;
  scale?: number;
  rotate?: number;
  className?: string;
}

const positionStyles: Record<string, React.CSSProperties> = {
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  'top-right': { top: '-5%', right: '-10%' },
  'bottom-left': { bottom: '-5%', left: '-10%' },
  'top-left': { top: '-5%', left: '-10%' },
  'bottom-right': { bottom: '-5%', right: '-10%' },
  'center-left': { top: '50%', left: '-10%', transform: 'translateY(-50%)' },
  'center-right': { top: '50%', right: '-10%', transform: 'translateY(-50%)' },
};

const MandalaBackground = ({
  position = 'center',
  opacity = 0.08,
  scale = 1,
  rotate = 0,
  className = '',
}: MandalaBackgroundProps) => {
  const baseSize = 280; // halved from 600
  const pos = positionStyles[position] ?? positionStyles.center;
  const existingTransform = pos.transform ?? '';

  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        ...pos,
        width: `${scale * baseSize}px`,
        height: `${scale * baseSize}px`,
        opacity: Math.min(opacity, 0.20),
        zIndex: 0,
        transform: `${existingTransform} rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      <img
        src={mandalaPattern}
        alt=""
        className="w-full h-full object-contain"
        style={{
          filter: 'sepia(1) saturate(3) brightness(0.85) hue-rotate(10deg)',
        }}
        loading="lazy"
      />
    </div>
  );
};

export default MandalaBackground;

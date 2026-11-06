import React from 'react';

interface MomentumRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  variant?: 'indigo' | 'emerald' | 'amber';
  centerLabel?: string;
  subLabel?: string;
}

export const MomentumRing: React.FC<MomentumRingProps> = ({
  value,
  size = 76,
  strokeWidth = 6,
  variant = 'emerald',
  centerLabel,
  subLabel,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const strokeColor =
    variant === 'indigo'
      ? '#4F46E5'
      : variant === 'amber'
      ? '#F59E0B'
      : '#10B981';

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[16px] font-bold leading-none tracking-[-0.01em] text-[#0F172A] tabular-nums">
          {centerLabel ?? `${Math.round(clamped)}%`}
        </span>
        {subLabel && (
          <span className="mt-0.5 text-[10px] font-semibold text-[#64748B] tabular-nums">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};

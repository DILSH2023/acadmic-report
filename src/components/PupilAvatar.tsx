import React from 'react';

interface PupilAvatarProps {
  seed: number;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
}

const PALETTES = [
  { bg: '#EEF2FF', shirt: '#4F46E5', skin: '#F3C6A5', hair: '#1E293B' },
  { bg: '#ECFDF5', shirt: '#047857', skin: '#8D5524', hair: '#0F172A' },
  { bg: '#FFFBEB', shirt: '#B45309', skin: '#F7D7C4', hair: '#451A03' },
  { bg: '#F0F9FF', shirt: '#0369A1', skin: '#C68642', hair: '#1E1B4B' },
  { bg: '#F5F3FF', shirt: '#6D28D9', skin: '#E0AC69', hair: '#27272A' },
  { bg: '#FDF2F8', shirt: '#BE185D', skin: '#F1C27D', hair: '#3F2E21' },
  { bg: '#ECFDF5', shirt: '#059669', skin: '#D2996C', hair: '#18181B' },
  { bg: '#EEF2FF', shirt: '#3730A3', skin: '#FFDBAC', hair: '#78350F' },
];

export const PupilAvatar: React.FC<PupilAvatarProps> = ({
  seed,
  firstName,
  lastName,
  size = 'md',
}) => {
  const palette = PALETTES[(seed - 1) % PALETTES.length];
  const dimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  const hasGlasses = seed % 3 === 1;
  const hairStyle = seed % 3; // 0: short wave, 1: bun/long, 2: curly crop

  return (
    <div
      className={`${dimensions} relative rounded-full overflow-hidden border border-[#E2E8F0] shrink-0 select-none flex items-center justify-center`}
      style={{ backgroundColor: palette.bg }}
      title={`${firstName} ${lastName}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        role="img"
        aria-label={`${firstName} ${lastName} portrait`}
      >
        {/* Shoulders / Academic Collar */}
        <path
          d="M12 64 C12 48, 52 48, 52 64 Z"
          fill={palette.shirt}
        />
        <path
          d="M25 50 L32 58 L39 50 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* Neck */}
        <rect x="27" y="40" width="10" height="10" rx="4" fill={palette.skin} />

        {/* Back Hair for Long Style */}
        {hairStyle === 1 && (
          <path
            d="M17 26 C15 36, 17 48, 22 48 L42 48 C47 48, 49 36, 47 26 Z"
            fill={palette.hair}
          />
        )}

        {/* Head */}
        <rect x="19" y="16" width="26" height="28" rx="13" fill={palette.skin} />

        {/* Ears */}
        <circle cx="19" cy="30" r="3" fill={palette.skin} />
        <circle cx="45" cy="30" r="3" fill={palette.skin} />

        {/* Eyes */}
        <circle cx="26.5" cy="29" r="1.6" fill="#0F172A" />
        <circle cx="37.5" cy="29" r="1.6" fill="#0F172A" />

        {/* Eyebrows */}
        <path
          d="M24 25.5 Q26.5 24 29 25.5"
          stroke={palette.hair}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M35 25.5 Q37.5 24 40 25.5"
          stroke={palette.hair}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Glasses if applicable */}
        {hasGlasses && (
          <g stroke="#334155" strokeWidth="1.4" fill="none">
            <rect x="22.5" y="26" width="8" height="6" rx="2" />
            <rect x="33.5" y="26" width="8" height="6" rx="2" />
            <line x1="30.5" y1="28.5" x2="33.5" y2="28.5" />
          </g>
        )}

        {/* Warm encouraging smile */}
        <path
          d="M28 36 Q32 39.2 36 36"
          stroke="#7C2D12"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Hair Crown */}
        {hairStyle === 0 && (
          <path
            d="M18 26 C18 14, 46 14, 46 26 C42 20, 24 20, 18 26 Z"
            fill={palette.hair}
          />
        )}
        {hairStyle === 1 && (
          <>
            <circle cx="32" cy="12" r="5.5" fill={palette.hair} />
            <path
              d="M18 27 C18 14, 46 14, 46 27 C40 19, 24 19, 18 27 Z"
              fill={palette.hair}
            />
          </>
        )}
        {hairStyle === 2 && (
          <g fill={palette.hair}>
            <circle cx="23" cy="18" r="5" />
            <circle cx="29" cy="16" r="5.5" />
            <circle cx="35" cy="16" r="5.5" />
            <circle cx="41" cy="18" r="5" />
            <circle cx="20" cy="22" r="4" />
            <circle cx="44" cy="22" r="4" />
          </g>
        )}
      </svg>
    </div>
  );
};

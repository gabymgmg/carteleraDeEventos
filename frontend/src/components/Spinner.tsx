// src/components/common/Spinner.tsx
interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md';
}

const Spinner = ({ message, size = 'md' }: SpinnerProps) => {
  const isSmall = size === 'sm';
  const iconSize = isSmall ? '40' : '64';

  return (
    <div className="flex flex-col items-center justify-center gap-3" data-testid="loading-spinner">
      <svg
        className="animate-spin"
        width={iconSize}
        height={iconSize}
        viewBox={`0 0 ${iconSize} ${iconSize}`}
        fill="none"
      >
        <circle
          cx={Number(iconSize) / 2}
          cy={Number(iconSize) / 2}
          r={isSmall ? '15' : '24'}
          stroke="#E5E7EB"
          strokeWidth={isSmall ? '2' : '6'}
        />
        <path
          d={
            isSmall
              ? 'M13.6 6.3C17.2 4.6 21.4 4.4 25.1 5.8'
              : 'M21.8 10.1C24.7 8.7 27.8 8 30.9 7.8'
          }
          stroke="url(#spinner_gradient)"
          strokeWidth={isSmall ? '2' : '6'}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="spinner_gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="rgb(38, 127, 235)" />
            <stop offset="1" stopColor="rgb(34, 36, 202)" />
          </linearGradient>
        </defs>
      </svg>
      {message && (
        <span className="text-gray-500 text-sm animate-pulse">{message}</span>
      )}
    </div>
  );
};

export default Spinner;

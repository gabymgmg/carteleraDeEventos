interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md';
}

const Spinner = ({ message, size = 'md' }: SpinnerProps) => {
  const isSmall = size === 'sm';

  // h-5 = 20px (botones)
  // h-16 = 64px (pantallas de carga)
  const sizeClass = isSmall ? 'h-5 w-5' : 'h-16 w-16';

  return (
    <div
      className={`flex flex-col items-center justify-center ${isSmall ? 'gap-0' : 'gap-3'}`}
      data-testid="loading-spinner"
    >
      <svg
        className={`animate-spin ${sizeClass}`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo de fondo (gris claro) */}
        <circle cx="32" cy="32" r="24" stroke="#E5E7EB" strokeWidth="6" />
        {/* El arco con gradiente */}
        <path
          d="M21.8 10.1C24.7 8.7 27.8 8 30.9 7.8"
          stroke="url(#spinner_gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="spinner_gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="rgb(38, 127, 235)" />
            <stop offset="1" stopColor="rgb(34, 36, 202)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Solo muestra mensaje si NO es para un botón */}
      {!isSmall && message && (
        <span className="text-gray-500 text-sm animate-pulse">{message}</span>
      )}
    </div>
  );
};

export default Spinner;

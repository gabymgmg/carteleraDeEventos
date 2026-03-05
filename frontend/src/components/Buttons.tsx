import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
  to?: string; // Si existe, se renderiza un Link
}

const Button = ({
  variant = 'primary',
  isLoading,
  children,
  className = '',
  to,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'px-4 py-2 rounded-md font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  // Contenido interno del botón que muestra un spinner si está cargando
  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? 'Procesando...' : children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;

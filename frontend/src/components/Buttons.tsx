import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'; // Asegúrate de que la ruta sea correcta

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
  to?: string; 
}

const Button = ({
  variant = 'primary',
  isLoading = false,
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

  // Si es un Link, sin spinner
  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  // Si es un botón normal, se usa Spinner manteniendo el texto original
  return (
    <button
      className={combinedClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-2">
          <Spinner size="sm" />
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
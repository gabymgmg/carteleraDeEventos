import React from 'react';

type CombinedElementProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface InputProps extends CombinedElementProps {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

const Input = ({
  label,
  isTextArea,
  className,
  error,
  ...props
}: InputProps) => {
  const inputId =
    props.id || props.name || label.toLowerCase().replace(/\s+/g, '-');
  const baseClasses = `w-full px-3 py-2 border rounded-lg outline-none transition-all text-sm ${
    error
      ? 'border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:ring-blue-500'
  }`;

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      {isTextArea ? (
        <textarea
          id={inputId}
          className={`${baseClasses} ${className || ''}`}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          className={`${baseClasses} ${className || ''}`}
          {...props}
        />
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

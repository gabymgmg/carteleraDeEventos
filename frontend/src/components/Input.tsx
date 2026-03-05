import React from 'react';

type CombinedElementProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface InputProps extends CombinedElementProps {
  label: string;
  isTextArea?: boolean;
}

const Input = ({ label, isTextArea, className, ...props }: InputProps) => {
  const baseClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-300 outline-none transition-all text-sm placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500';

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {isTextArea ? (
        <textarea className={`${baseClasses} ${className || ''}`} {...props} />
      ) : (
        <input className={`${baseClasses} ${className || ''}`} {...props} />
      )}
    </div>
  );
};

export default Input;

'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export default function AuthButton({ 
  children, 
  variant = 'primary', 
  loading = false,
  className,
  disabled,
  ...props 
}: AuthButtonProps) {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 bg-white/50 backdrop-blur-sm"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}
      <span>{children}</span>
    </button>
  );
}
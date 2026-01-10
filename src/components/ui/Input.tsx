'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        type = 'text',
        className = '',
        ...props
    }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        const inputStyles = `
      w-full px-4 py-3 text-base
      bg-background-elevated text-foreground
      border border-border rounded-xl
      placeholder:text-foreground-subtle
      transition-all duration-200
      hover:border-border-hover
      focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${leftIcon ? 'pl-11' : ''}
      ${rightIcon || isPassword ? 'pr-11' : ''}
      ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
    `;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground-muted mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={isPassword && showPassword ? 'text' : type}
                        className={`${inputStyles} ${className}`}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}

                    {rightIcon && !isPassword && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 text-sm text-error">{error}</p>
                )}

                {helperText && !error && (
                    <p className="mt-2 text-sm text-foreground-subtle">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

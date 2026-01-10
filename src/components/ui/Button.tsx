'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        disabled,
        className = '',
        ...props
    }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    `;

        const variantStyles = {
            primary: `
        bg-accent-primary text-white
        hover:bg-accent-primary-hover hover:translate-y-[-1px] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]
        focus:ring-accent-primary
        active:translate-y-0
      `,
            secondary: `
        bg-background-elevated text-foreground border border-border
        hover:bg-background-hover hover:border-border-hover
        focus:ring-border
      `,
            ghost: `
        bg-transparent text-foreground-muted
        hover:bg-background-hover hover:text-foreground
        focus:ring-border
      `,
            danger: `
        bg-error text-white
        hover:bg-red-600 hover:translate-y-[-1px]
        focus:ring-error
      `,
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
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
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

'use client';

import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    autoResize?: boolean;
    maxHeight?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        label,
        error,
        helperText,
        autoResize = false,
        maxHeight = 200,
        className = '',
        onChange,
        ...props
    }, ref) => {
        const internalRef = useRef<HTMLTextAreaElement>(null);
        const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (autoResize && textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
            }
            onChange?.(e);
        };

        useEffect(() => {
            if (autoResize && textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
            }
        }, [autoResize, maxHeight, textareaRef]);

        const textareaStyles = `
      w-full px-4 py-3 text-base
      bg-background-elevated text-foreground
      border border-border rounded-xl
      placeholder:text-foreground-subtle
      transition-all duration-200
      hover:border-border-hover
      focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-none
      ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
    `;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground-muted mb-2">
                        {label}
                    </label>
                )}

                <textarea
                    ref={textareaRef}
                    onChange={handleChange}
                    className={`${textareaStyles} ${className}`}
                    {...props}
                />

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

Textarea.displayName = 'Textarea';

export default Textarea;

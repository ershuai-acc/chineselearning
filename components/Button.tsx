import React from 'react';
import { cn } from '@/lib/utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'option';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  selected?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, selected = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-success-btn text-white shadow-[0_4px_0_var(--color-success-btn-shadow)] hover:bg-opacity-90 hover:translate-y-[1px] hover:shadow-[0_3px_0_var(--color-success-btn-shadow)] active:translate-y-[4px] active:shadow-none",
      secondary: "bg-white text-primary-blue border-2 border-gray-200 border-b-4 hover:bg-gray-50 hover:border-gray-300 active:border-b-2 active:translate-y-[2px]",
      danger: "bg-error-btn text-white shadow-[0_4px_0_var(--color-error-btn-shadow)] hover:bg-opacity-90 hover:translate-y-[1px] hover:shadow-[0_3px_0_var(--color-error-btn-shadow)] active:translate-y-[4px] active:shadow-none",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100/50 hover:text-gray-900",
      option: cn(
        "bg-white text-gray-700 border-2 border-gray-200 border-b-4 hover:bg-gray-50 hover:border-primary-blue/30 text-lg normal-case font-medium active:border-b-2 active:translate-y-[2px]",
        selected && "bg-option-selected-bg border-option-selected-border text-primary-blue border-b-4"
      )
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "soft";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.99]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[40px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px]",
    };

    const variantStyles = {
      primary:
        "bg-[#B91C3C] text-white hover:bg-[#9F1239] shadow-sm hover:shadow focus:ring-[#B91C3C]",
      secondary:
        "bg-[#701A32] text-white hover:bg-[#581427] shadow-sm focus:ring-[#701A32]",
      soft:
        "bg-[#FFF1F2] text-[#B91C3C] hover:bg-[#FFE4E6] border border-[#FECDD3] focus:ring-[#B91C3C]",
      outline:
        "bg-white text-[#18181B] border border-[#E4E4E7] hover:bg-[#F4F4F5] hover:border-[#D4D4D8] focus:ring-[#18181B]",
      ghost:
        "bg-transparent text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] focus:ring-[#18181B]",
      danger:
        "bg-[#B91C1C] text-white hover:bg-[#991B1B] shadow-sm focus:ring-[#B91C1C]",
      success:
        "bg-[#15803D] text-white hover:bg-[#166534] shadow-sm focus:ring-[#15803D]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

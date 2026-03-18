import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const { theme } = useTheme();
  
  const glassEffect = theme === "glassmorphic" ? "glass shadow-md hover:shadow-lg" : "";
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main disabled:opacity-50 disabled:pointer-events-none ring-offset-base-bg",
        variant === "default" && "bg-accent-main text-white hover:bg-accent-hover",
        variant === "outline" && "border border-border-main hover:bg-base-surface hover:text-text-main",
        variant === "ghost" && "hover:bg-base-surface hover:text-text-main",
        variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
        size === "default" && "h-10 py-2 px-4",
        size === "sm" && "h-9 px-3 rounded-md",
        size === "lg" && "h-11 px-8 rounded-md",
        size === "icon" && "h-10 w-10",
        glassEffect,
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };

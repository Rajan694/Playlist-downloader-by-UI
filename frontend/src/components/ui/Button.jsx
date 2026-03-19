import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const { themeConfig } = useTheme();
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        themeConfig.buttonFocus,
        variant === "default" && themeConfig.buttonPrimary,
        variant === "outline" && themeConfig.buttonOutline,
        variant === "ghost" && themeConfig.buttonGhost,
        variant === "destructive" && themeConfig.buttonDestructive,
        size === "default" && "h-10 py-2 px-4",
        size === "sm" && "h-9 px-3 rounded-md",
        size === "lg" && "h-11 px-8 rounded-md",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

const Input = forwardRef(({ className, type, ...props }, ref) => {
  const { theme } = useTheme();
  const glassEffect = theme === "glassmorphic" ? "glass placeholder:text-text-muted" : "";

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-border-main bg-base-bg px-3 py-2 text-sm text-text-main ring-offset-base-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        glassEffect,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };

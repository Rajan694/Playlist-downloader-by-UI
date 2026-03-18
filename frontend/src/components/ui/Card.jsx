import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

const Card = forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  const glassEffect = theme === "glassmorphic" ? "glass shadow-xl backdrop-blur-xl" : "bg-base-surface text-text-main shadow-sm border border-border-main";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl",
        glassEffect,
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";

const Card = forwardRef(({ className, ...props }, ref) => {
  const { themeConfig } = useTheme();

  return (
    <div
      ref={ref}
      className={cn(
        themeConfig.card,
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  const { themeConfig } = useTheme();
  return (
    <div
      ref={ref}
      className={cn(themeConfig.cardHeader, className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  const { themeConfig } = useTheme();
  return (
    <h3
      ref={ref}
      className={cn(themeConfig.cardTitle, className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  const { themeConfig } = useTheme();
  return <div ref={ref} className={cn(themeConfig.cardContent, className)} {...props} />;
});
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => {
  const { themeConfig } = useTheme();
  return (
    <div
      ref={ref}
      className={cn(themeConfig.cardFooter, className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };

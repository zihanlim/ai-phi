interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className = "" }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex gap-1 items-center justify-center ${className}`}>
      <span className={`font-label text-primary ${sizeClasses[size]} blinking-cursor`}>_</span>
      <span className={`font-label text-primary ${sizeClasses[size]} opacity-40`}>_</span>
      <span className={`font-label text-primary ${sizeClasses[size]} opacity-20`}>_</span>
    </div>
  );
}
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`w-full rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 p-8 md:p-10 shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

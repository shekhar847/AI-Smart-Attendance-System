import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  children,
}: PageTitleProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

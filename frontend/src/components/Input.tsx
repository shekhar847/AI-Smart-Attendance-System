import React, { forwardRef, InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", placeholder, icon: Icon, className = "", ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 ${
          Icon ? "pl-12" : "pl-4"
        } pr-4 text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#c8f135] focus:ring-4 focus:ring-[#c8f135]/20 ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;

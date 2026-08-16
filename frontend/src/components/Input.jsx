import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { type = "text", placeholder, icon: Icon, ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-12 pr-4 text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40"
        {...props}
      />
    </div>
  );
});

export default Input;
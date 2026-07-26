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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        {...props}
      />
    </div>
  );
});

export default Input;
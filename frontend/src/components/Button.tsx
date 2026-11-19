import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-xl bg-[#c8f135] py-3 font-bold text-slate-950 shadow-md shadow-[#c8f135]/20 transition-all duration-300 hover:bg-[#b5e028] hover:shadow-lg hover:shadow-[#c8f135]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

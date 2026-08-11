function Button({ children, ...props }) {
  return (
    <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]" {...props}>
      {children}
    </button>
  );
}

export default Button;
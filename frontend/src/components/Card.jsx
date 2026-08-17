function Card({ children }) {
  return (
    <div className="w-full rounded-3xl glass-card border border-white/40 dark:border-slate-800/80 p-8 md:p-10 shadow-2xl transition-all duration-300">
      {children}
    </div>
  );
}

export default Card;
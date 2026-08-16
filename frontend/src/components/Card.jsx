function Card({ children }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 shadow-2xl transition-colors duration-300">
      {children}
    </div>
  );
}

export default Card;
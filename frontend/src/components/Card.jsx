function Card({ children }) {
  return (
    <div className="rounded-3xl bg-white p-10 shadow-2xl">
      {children}
    </div>
  );
}

export default Card;
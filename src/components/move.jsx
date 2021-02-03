const Move = ({ move }) => {
  return (
    <section>
      <header>
        <strong className="font-mono">{move.name}</strong>
      </header>
      <ul>
        {Object.entries(move).map(([k, v], i) => (
          <li key={`${k}-${i}`} className="font-light text-xs">
            <span>{k}: </span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Move;

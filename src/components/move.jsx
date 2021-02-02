const Move = ({ move }) => {
  return (
    <section>
      <header>
        <strong>{move.name}</strong>
      </header>
      <ul>
        {Object.entries(move).map(([k, v], i) => (
          <li key={`${k}-${i}`}>
            <span>{k}: </span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Move;

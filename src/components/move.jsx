const Move = ({ move }) => {
  return (
    <section style={{ border: "1px solid pink" }}>
      <header>
        <strong>{move.name}</strong>
      </header>
      <ul>
        {Object.values(move)
          .filter((m) => !!m)
          .map((m, i) => (
            <li key={`${m}-${i}`}>{m}</li>
          ))}
      </ul>
    </section>
  );
};

export default Move;

const Move = ({ move }) => {
  return (
    <section>
      <header>
        <strong className="font-mono">{move.name}</strong>
      </header>
      <ul>
        {Object.entries(move)
          .filter(([_, v]) => !!v)
          .map(([k, v], i) => (
            <li
              key={`${k}-${i}`}
              className="font-light text-xs whitespace-nowrap"
            >
              <span>{k}: </span>
              <span>{v}</span>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Move;

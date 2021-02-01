import styles from "../../styles/Move.module.css";

const Move = ({ move }) => {
  const manyCards = [
    move,
    move,
    move,
    move,
    move,
    move,
    move,
    move,
    move,
    move,
    move,
  ];
  return (
    <section style={{ border: "1px solid pink" }}>
      <header>
        <strong>{move.name}</strong>
      </header>
      <ul
        //   style={styles.ul}
        className={styles.ul}
      >
        {manyCards.map((move) => {
          return Object.values(move)
            .filter((m) => !!m)
            .map((m, i) => (
              <li className={styles.li} key={`${m}-${i}`}>
                {m}
              </li>
            ));
        })}
      </ul>
    </section>
  );
};

export default Move;

import styles from "../../styles/Move.module.css";

const Move = ({ move }) => {
  return (
    <section style={{ border: "1px solid pink" }}>
      <header>
        <strong>{move.name}</strong>
      </header>
      <ul className={styles.ul}>
        {Object.entries(move).map(([k, v], i) => (
          <li className={styles.li} key={`${k}-${i}`}>
            <span className={styles.moveName}>{k}</span>
            <span className={styles.min}>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Move;

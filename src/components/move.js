import styles from "./move.module.css";

const Move = ({ move, onClick, tags }) => {
  // arbitrary for testing
  const bgStyle =
    move.name && move.name.charAt(0) < "m" ? styles.bg0 : styles.bg1;

  return (
    <ul className={`p-3 relative ${styles.test} ${bgStyle}`} onClick={onClick}>
      {Object.entries(move)
        .filter(([_, v]) => !!v)
        .map(([k, v], i) => (
          <li key={`${k}-${i}`} className="text-xs whitespace-nowrap">
            <span>{k}: </span>
            <span>{v}</span>
          </li>
        ))}
      {tags &&
        tags.length > 0 &&
        tags.map((t, i) => (
          <div
            key={i}
            className="absolute -bottom-1.5 -right-0.5 text-xs bg-purple-900 text-white p-0 font-light font-sans"
          >
            {t}
          </div>
        ))}
    </ul>
  );
};

export default Move;

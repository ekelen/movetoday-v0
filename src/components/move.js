import { Fragment } from "react";
import styles from "./move.module.css";

const Move = ({ move, onClick, tags, editMode = true, done = null }) => {
  return (
    <div className="relative">
      <button
        className={`m-1 p-3 relative text-yellow-100 font-bold font-mono ${
          editMode
            ? styles.bg1
            : done
            ? "bg-green-900 bg-opacity-50"
            : "bg-blue-900"
        }`}
        onClick={onClick}
      >
        {Object.entries(move)
          .filter(([_, v]) => !!v)
          .map(([k, v], i) => (
            <span key={`${k}-${i}`} className="text-xs whitespace-nowrap">
              <span>{k}: </span>
              <span>{v}</span>
            </span>
          ))}
        {tags &&
          tags.length > 0 &&
          tags.map((t, i) => (
            <div
              key={`${t}-${i}`}
              className="absolute -bottom-1.5 -right-0.5 text-xs bg-purple-900 text-white p-0 font-light font-sans"
            >
              {t}
            </div>
          ))}
      </button>
    </div>
  );
};

export default Move;

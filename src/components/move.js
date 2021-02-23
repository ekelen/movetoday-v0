import { memo } from "react";

const selectedMoveCn =
  "bg-primary-700 text-primary-100 opacity-50 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-600";
const unselectedMoveCn =
  "bg-primary-900 text-primary-100 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-900";

const Move = memo(({ move = {}, selected = true, onClick = () => {} }) => {
  const { name, focus } = move;
  // console.log("rendering move " + name);
  const _onClick = () => {
    return onClick(move, !selected);
  };
  return (
    <button
      aria-label={selected ? `unselect ${name}` : `select ${name}`}
      onClick={_onClick}
      className={selected ? selectedMoveCn : unselectedMoveCn}
    >
      <div className="mr-2">{name}</div>
      <div className="tag">{focus}</div>
    </button>
  );
});

export default Move;

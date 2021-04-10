import { memo } from "react";

// Todo: More graceful way to handle purgeable CSS
const selectedMoveCn =
  "bg-primary-700 flex focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 font-mono hover:bg-primaryAction-600 items-center justify-between opacity-50 px-2 py-2 rounded-md text-primary-100 text-sm";
const unselectedMoveCn =
  "bg-primary-900 border border-primary-700 flex focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 font-mono hover:bg-primaryAction-900 items-center justify-between px-2 py-2 rounded-md text-primary-100 text-sm";

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
      <div className={selected ? "tag" : "tag tag-outline"}>{focus}</div>
    </button>
  );
});

export default Move;

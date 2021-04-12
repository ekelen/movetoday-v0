import { memo } from "react";

// Todo: More graceful way to handle purgeable CSS
const selectedMoveCn =
  "group border border-primaryAction-600 flex focus:outline-none focus:ring-2 focus:ring-red-600 font-mono hover:border-red-600 items-center justify-between px-2 py-2 relative rounded-md text-primary-100 text-xs md:text-sm whitespace-nowrap";

const unselectedMoveCn =
  "group border border-primary-700 flex focus:outline-none focus:ring-2 focus:ring-primaryAction-600 font-mono items-center hover:border-primaryAction-600 justify-between px-2 py-2 relative rounded-md text-primary-100 text-xs md:text-sm whitespace-nowrap";

const indicatorAddCn =
  "bg-primary-900 h-4 w-4 hidden group-hover:flex items-center justify-center absolute text-md font-bold -left-2 rounded-lg text-primaryAction-600";
const indicatorRmCn =
  "bg-primary-900 h-4 w-4 hidden group-hover:flex items-center justify-center absolute text-md font-bold -left-2 rounded-lg text-red-600 ";

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
      <div className={"tag tag-on-dark"}>{focus}</div>
      <div className={selected ? indicatorRmCn : indicatorAddCn}>
        {selected ? "-" : "+"}
      </div>
    </button>
  );
});

export default Move;

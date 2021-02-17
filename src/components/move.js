const selectedMoveCn =
  "bg-primary-700 text-primary-100 opacity-50 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-600";
const unselectedMoveCn =
  "bg-primary-900 text-primary-100 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-900";
const FilteredInMove = ({ move, onClick, selected }) => {
  const { name, focus } = move;
  // Todo: More graceful way to handle purgeable CSS
  // const selectedCn =
  //   "bg-primary-700 text-primary-100 opacity-50 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300";
  // const unselectedCn =
  //   "bg-primary-900 text-primary-100 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300";
  return (
    <button
      aria-label={`select ${name}`}
      onClick={onClick}
      className={selected ? selectedMoveCn : unselectedMoveCn}
    >
      <div className="mr-2 text-xs">{name}</div>
      <div className="text-primary-200 bg-primary-800 text-xs px-2 py-1 rounded">
        {focus}
      </div>
    </button>
  );
};

const SelectedMove = ({ move, onClick }) => {
  const { name, focus } = move;
  return (
    <button
      aria-label={`unselect ${name}`}
      onClick={onClick}
      className={selectedMoveCn}
      // className="font-mono bg-primary-600 flex text-sm items-center py-2 px-2 rounded-md focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300"
    >
      <div className="mr-2">{name}</div>
      <div className="text-primary-100 bg-primary-800 text-xs px-2 py-1 rounded">
        {focus}
      </div>
    </button>
  );
};

const MoveBlock = ({ onClick, move }) => {
  const {
    name,
    focus,
    repsMin,
    repsMax,
    durationMin,
    durationMax,
    sets,
    setsDone,
    source,
    history = null,
  } = move;
  // Todo: More graceful way to handle purgeable CSS
  const containerCn =
    "bg-primary-800 relative py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 focus:bg-primary-600";
  const containerCnDone =
    "bg-primary-500 relative py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 focus:bg-primary-600";

  const inProgressLabelCn =
    "absolute right-2 center bg-primary-300 rounded-md p-1 text-primary-700 font-bold";
  const done = setsDone === sets;
  const inProgress = setsDone > 0 && !done;

  return (
    <button
      onClick={() => onClick(move)}
      className={done ? containerCnDone : containerCn}
    >
      {!!done && <div className="absolute right-2 center text-lg">☑️</div>}
      {inProgress && (
        <div className={inProgressLabelCn}>{`${setsDone} / ${sets}`}</div>
      )}
      <header className="text-primary-400 text-sm sm:text-sm md:text-lg font-display w-full">
        <span>{name}</span>
      </header>
      {/* TODO: Why group-hover not working..? */}
      <div className="group hover:text-primary-800 ml-0 text-primary-200 flex flex-wrap text-sm">
        {repsMin && (
          <div className="group-hover:text-primary-800 mr-2 mb-2 ">
            {repsMin && repsMin}
            {repsMax && `-${repsMax}`}
            {sets && ` x ${sets}`}
          </div>
        )}
        {durationMin && (
          <div className="group-hover:text-primary-800 mr-2 mb-2">
            {durationMin && durationMin}
            {durationMax && `-${durationMax}`}
            {sets && ` x ${sets}`}
          </div>
        )}
        {focus && (
          <div className="mr-2 mb-2 text-secondary-200 bg-primary-700 text-xs leading-relaxed px-2 rounded">
            {focus}
          </div>
        )}
        {source && (
          <div className="mr-2 mb-2 text-secondary-200 bg-primary-700 text-xs leading-relaxed px-2 rounded">
            {source}
          </div>
        )}
        {history && history.length > 0 ? (
          <div className="mr-2 mb-2 text-secondary-200 bg-primary-700 text-xs leading-relaxed px-2 rounded">
            last done: {history[history.length - 1].date}
          </div>
        ) : (
          ""
        )}
      </div>
    </button>
  );
};

const Move = ({
  selected = false,
  area = "available",
  move = {},
  onClick = () => {},
  order = -1,
}) => {
  return area === "available" ? (
    <FilteredInMove selected={selected} move={move} onClick={onClick} />
  ) : area === "sequenceDisplay" ? (
    <MoveBlock order={order} onClick={onClick} move={move} />
  ) : (
    <SelectedMove move={move} onClick={onClick} />
  );
};

export default Move;

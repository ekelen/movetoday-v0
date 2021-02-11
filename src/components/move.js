const FilteredInMove = ({ move, onClick, selected }) => {
  const { name, focus } = move;
  // Todo: More graceful way to handle purgeable CSS
  const selectedCn =
    "bg-primary-700 text-primary-100 opacity-50 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono";
  const unselectedCn =
    "bg-primary-900 text-primary-100 flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono";
  return (
    <button
      aria-label={`select ${name}`}
      onClick={onClick}
      className={selected ? selectedCn : unselectedCn}
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
      className="font-mono bg-primary-600 flex text-sm items-center py-2 px-2 rounded-md"
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
  } = move;
  // Todo: More graceful way to handle purgeable CSS
  const containerCn =
    "bg-primary-800 relative py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start";
  const containerCnDone =
    "bg-primary-500 relative py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start";

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
      <div className="ml-0 text-primary-200 flex flex-wrap text-sm">
        {repsMin && (
          <div className="mr-2 mb-2">
            {repsMin && repsMin}
            {repsMax && `-${repsMax}`}
            {sets && ` x ${sets}`}
          </div>
        )}
        {durationMin && (
          <div className="mr-2 mb-2">
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
          <div className="mb-2 text-secondary-200 bg-primary-700 text-xs leading-relaxed px-2 rounded">
            {source}
          </div>
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
}) => {
  return area === "available" ? (
    <FilteredInMove selected={selected} move={move} onClick={onClick} />
  ) : area === "sequenceDisplay" ? (
    <MoveBlock onClick={onClick} move={move} />
  ) : (
    <SelectedMove move={move} onClick={onClick} />
  );
};

export default Move;

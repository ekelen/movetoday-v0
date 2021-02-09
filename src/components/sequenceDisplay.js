const Back = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-primaryAction-600 text-black font-display ml-4 py-1 px-3 rounded-full flex items-center hover:bg-yellow-500 focus:outline-none focus:bg-yellow-400"
  >
    {`◀ back`}
  </button>
);

const MoveBlock = ({ onClick, move }) => {
  const {
    name,
    focus,
    repsMin,
    repsMax,
    durationMin,
    durationMax,
    sets,
    source,
  } = move;
  return (
    <button className="bg-primary-800 py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start">
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

const SequenceDisplay = ({
  children,
  selectedMoves,
  onToggleDone,
  onEdit,
  ...props
}) => {
  return (
    <div className="bg-primary-900 h-screen overflow-y-auto p-5 pt-0 flex flex-wrap space-y-4 space-x-4 pr-4 items-stretch content-start">
      <div className="w-full p-2">
        <Back onClick={onEdit} />
      </div>

      {selectedMoves.map((move, i) => (
        <MoveBlock key={`${move.id}-${i}`} move={move} onClick={onToggleDone} />
      ))}
    </div>
  );
};

export default SequenceDisplay;

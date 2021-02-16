import { useEffect, useState } from "react";

import Move from "./move";

const Back = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-primaryAction-600 text-black font-display ml-4 py-1 px-3 rounded-full flex items-center hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300"
  >
    {`◀ back`}
  </button>
);

const SequenceDisplay = ({
  children,
  selectedMoves,
  onToggleDone,
  onEdit,
  ...props
}) => {
  const [displayMessage, setDisplayMessage] = useState(
    "💡 Click a move when you've completed a set."
  );
  useEffect(() => {
    let timer;
    if (!timer)
      timer = setTimeout(() => setDisplayMessage(`${"🤸‍♀️🤸‍♀️🤸‍♀️"}`), 3000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-primary-900 h-screen overflow-y-auto p-5 pt-0 flex flex-wrap space-y-4 space-x-4 pr-4 items-stretch content-start">
      <div className="w-full p-2">
        <Back onClick={onEdit} />
      </div>
      <div className="w-full p-2 pt-0 text-primary-300 text-bold">
        {displayMessage}
      </div>

      {selectedMoves.map((move, i) => (
        <Move
          area="sequenceDisplay"
          key={`${move.id}-${i}`}
          move={move}
          onClick={onToggleDone}
          order={i}
        />
      ))}
    </div>
  );
};

export default SequenceDisplay;

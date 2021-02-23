import { Fragment, useEffect, useRef, useState } from "react";

import Move from "./move";

const SelectedMoves = ({
  toggleOneSelected,
  selectedMoves,
  onClearSelected,
  onFinalize,
}) => {
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    setDisabled(!selectedMoves || selectedMoves.length < 1);
  }, [selectedMoves]);
  const clearRef = useRef(null);
  useEffect(() => {
    if (clearRef.current) {
      clearRef.current.disabled = disabled;
      clearRef.current.className = disabled
        ? "w-min bg-primary-200 text-primary-700 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 opacity-30 cursor-default"
        : "w-min bg-primaryAction-400 text-primary-700 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 hover:bg-primaryAction-200 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300";
    }
  }, [disabled]);
  return (
    <div className="p-5 w-full min-h-3/6 h-3/6 flex flex-wrap overflow-y-scroll scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900">
      <div className="border-primary-400 border-2 mb-5 w-full p-3 rounded-md flex flex-wrap space-y-4 space-x-4 items-start flex-start content-start">
        <div className="text-primary-400 text-xs  uppercase">
          2. Review and done!
        </div>
        <header className="w-full flex p-2 items-center space-x-4">
          <h3 className="text-primary-200 font-display">
            {selectedMoves.length} selected
          </h3>
          <button onClick={onClearSelected} ref={clearRef}>
            clear
          </button>
          <button onClick={onFinalize} disabled={disabled} className="btn-pill">
            {"done! ▶"}
          </button>
        </header>

        <Fragment>
          {selectedMoves.map((m) => {
            return (
              <Move
                key={`${m.name}-${m.idx}`}
                onClick={toggleOneSelected}
                move={m}
                selected={true}
              />
            );
          })}
        </Fragment>
      </div>
    </div>
  );
};

export default SelectedMoves;

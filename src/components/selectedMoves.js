import { Fragment, useEffect, useRef, useState } from "react";

const SelectedMoves = ({
  nSelectedMoves,
  onClearSelected,
  onFinalize,
  selectedMovesDisplay,
}) => {
  const disabled = nSelectedMoves < 1;

  return (
    <div className="p-5 w-full min-h-3/6 h-3/6 flex flex-wrap overflow-y-scroll scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900">
      <div className="border-primary-400 border-2 mb-5 w-full p-3 rounded-md flex flex-wrap space-y-4 space-x-4 items-start flex-start content-start">
        <div className="text-primary-400 text-xs  uppercase">
          2. Review and done!
        </div>
        <header className="w-full flex p-2 items-center space-x-4">
          <h3 className="text-primary-200 font-display">
            {nSelectedMoves} selected
          </h3>
          <button
            className="btn-pill"
            onClick={onClearSelected}
            disabled={disabled}
          >
            clear
          </button>
          <button onClick={onFinalize} disabled={disabled} className="btn-pill">
            {"done! ▶"}
          </button>
        </header>

        <Fragment>{selectedMovesDisplay}</Fragment>
      </div>
    </div>
  );
};

export default SelectedMoves;

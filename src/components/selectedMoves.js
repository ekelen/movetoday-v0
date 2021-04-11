import { Fragment, useEffect, useRef, useState } from "react";
import { Play, X } from "react-feather";

const SelectedMoves = ({
  nSelectedMoves,
  onClearSelected,
  onFinalize,
  selectedMovesDisplay,
}) => {
  const disabled = nSelectedMoves < 1;

  return (
    <div className="content-start flex flex-start flex-wrap h-full items-start overflow-y-scroll p-3 relative scrollbar scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-primary-900 space-x-4 space-y-4 w-full">
      <div className="text-primary-400 text-xs uppercase">
        2. Review and done!
      </div>
      <header className="w-full flex p-2 items-center space-x-4">
        <h3 className="text-primary-200 font-display">
          {nSelectedMoves} selected
        </h3>
        <button
          className="btn-pill btn-primary"
          onClick={onClearSelected}
          disabled={disabled}
        >
          <X size={16} />
          <p className="ml-2">clear</p>
        </button>
        <button
          onClick={onFinalize}
          disabled={disabled}
          className="btn-pill btn-primary"
        >
          <p className="mr-2">go!</p>
          <Play size={16} />
        </button>
      </header>
      <Fragment>{selectedMovesDisplay}</Fragment>
    </div>
  );
};

export default SelectedMoves;

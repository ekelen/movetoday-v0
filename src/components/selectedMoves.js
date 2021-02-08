import { Fragment } from "react";
import { foci } from "../data/constants";
import Move from "./move";

const SelectedMoves = ({
  availableMoves,
  setFocusFilter,
  focusFilter,
  setSearchFilter,
  searchFilter,
  initialMoveList,
  toggleMove,
  selectedMoves,
  setSelectedMoves,
  onChange,
  onSearch,
  editMode,
  setEditMode,
  onSelectDefault,
  chooseRandom,
  onFinalize,
}) => {
  return (
    <div
      className={`${
        editMode
          ? "p-5 w-full min-h-3/6 h-3/6 flex flex-wrap overflow-y-auto scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900"
          : // : "fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll space-y-3 bg-primary-900"
            "hidden"
      }`}
    >
      <div className="bg-primary-800 mb-5 w-full p-2 rounded-md flex flex-wrap space-y-4 space-x-4 items-start flex-start content-start">
        <header className="w-full flex p-2 items-center space-x-4 space-y-2">
          <h3 className="text-primary-100 font-display">
            {selectedMoves.length} selected
          </h3>

          <button
            onClick={onSelectDefault}
            className="shadow-lg w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            default
          </button>
          <button
            onClick={chooseRandom}
            className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            random
          </button>
          <button
            onClick={() => setSelectedMoves([])}
            className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            clear
          </button>
          <button
            onClick={onFinalize}
            className="bg-primary-600 text-primary-900 font-display py-1 px-3 rounded-full flex items-center hover:bg-primary-500 focus:outline-none focus:bg-primary-400"
          >
            {"done! ▶"}
          </button>
        </header>

        <Fragment>
          {selectedMoves.map((m, i) => {
            return (
              <Move
                key={`${m.name}-${i}`}
                onClick={() => toggleMove(m)}
                move={m}
                area="selected"
              />
            );
          })}
        </Fragment>
      </div>
    </div>
  );
};

export default SelectedMoves;

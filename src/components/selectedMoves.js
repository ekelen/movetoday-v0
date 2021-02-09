import { Fragment } from "react";
import Move from "./move";

const SelectedMoves = ({
  onToggleMove,
  selectedMoves,
  setSelectedMoves,
  onSelectDefault,
  onSelectRandom,
  onFinalize,
}) => {
  return (
    <div className="p-5 w-full min-h-3/6 h-3/6 flex flex-wrap overflow-y-auto scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900">
      <div className="border-primary-400 border-2 mb-5 w-full p-3 rounded-md flex flex-wrap space-y-4 space-x-4 items-start flex-start content-start">
        <div className="text-primary-400 text-xs  uppercase">
          2. Review and done!
        </div>
        <header className="w-full flex p-2 items-center space-x-4">
          <h3 className="text-primary-200 font-display">
            {selectedMoves.length} selected
          </h3>

          {/* <button
            onClick={onSelectDefault}
            className="shadow-lg w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            default
          </button>
          <button
            onClick={onSelectRandom}
            className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            random
          </button> */}
          <button
            onClick={() => setSelectedMoves([])}
            className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
          >
            clear
          </button>
          <button
            onClick={onFinalize}
            disabled={selectedMoves.length < 1}
            className="bg-primaryAction-600 disabled:opacity-50 disabled:cursor-default text-primary-900 font-display py-1 px-3 rounded-full flex items-center focus:outline-none focus:bg-primary-400"
          >
            {"done! ▶"}
          </button>
        </header>

        <Fragment>
          {selectedMoves.map((m, i) => {
            return (
              <Move
                key={`${m.name}-${i}`}
                onClick={() => onToggleMove(m)}
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

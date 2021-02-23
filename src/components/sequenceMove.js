import { memo, useState } from "react";
import { Check, RotateCcw, Trash, X } from "react-feather";

const SequenceMove = memo(
  ({ move, setsDone, toggleOneSelected, setOneProgress }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const {
      name,
      focus,
      repsMin,
      repsMax,
      durationMin,
      durationMax,
      sets,
      source,
      isPerSide,
      // history = null,
    } = move;

    const done = setsDone === sets;
    const inProgress = setsDone > 0 && !done;

    // Todo: More graceful way to handle purgeable CSS
    const containerCn =
      "bg-primary-800 relative my-2 mx-2 py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 focus:bg-primary-600 cursor-pointer";
    const containerCnDone =
      "bg-primary-500 relative my-2 mx-2 py-2 px-2 flex-auto w-1/4 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 focus:bg-primary-600 cursor-pointer";

    const inProgressLabelCn =
      "absolute right-2 center bg-primary-300 rounded-md p-1 text-primary-700 font-bold";

    const onRemoveMoveFromSequence = (e) => {
      setShowConfirmDelete(true);
      e.stopPropagation();
    };

    const onConfirmRemoveMoveFromSequence = (e) => {
      toggleOneSelected(move, false);
      e.stopPropagation();
    };

    const onCancelRemove = (e) => {
      setShowConfirmDelete(false);
      e.stopPropagation();
    };

    const onIncrementSetsDone = (e) => {
      setOneProgress(move.slug, (setsDone + 1) % (sets + 1));
    };

    const onZeroProgress = (e) => {
      setOneProgress(move.slug, 0);
      e.stopPropagation();
    };

    return (
      <div
        onClick={onIncrementSetsDone}
        className={done ? containerCnDone : containerCn}
      >
        {!!done && <div className="absolute right-2 center text-lg">☑️</div>}
        {(inProgress || !done) && (
          <div className={inProgressLabelCn}>{`${setsDone} / ${sets}`}</div>
        )}
        <header className="text-primary-400 text-sm sm:text-sm md:text-lg font-display w-full">
          <span>{name}</span>
        </header>
        {/* TODO: Why group-hover not working..? */}
        <div className="group ml-0 text-primary-200 flex flex-wrap text-sm">
          {repsMin && (
            <div className="group-hover:text-primary-800 mr-2 mb-2 ">
              {repsMin && repsMin}
              {repsMax && `-${repsMax}`}
              {isPerSide && `per side`}
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
          {focus && <div className="tag mr-2">{focus}</div>}
          {source && <div className="tag">{source}</div>}
          {
            <button
              onClick={onZeroProgress}
              className="flex absolute bottom-1 right-1"
            >
              <RotateCcw size={16} />
            </button>
          }
          {!showConfirmDelete && (
            <button
              className="flex absolute bottom-1 right-6"
              onClick={onRemoveMoveFromSequence}
            >
              <Trash size={16} />
            </button>
          )}
          {showConfirmDelete && (
            <div className="flex absolute bottom-1 right-6 rounded-md px-1.5 py-1 bg-primary-900">
              <p>Remove?</p>
              <button
                onClick={onConfirmRemoveMoveFromSequence}
                className="hover:text-primaryAction-300"
              >
                <Check size={16} />
              </button>
              <button
                onClick={onCancelRemove}
                className="hover:text-primaryAction-300"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {/* {history && history.length > 0 ? (
          <div className="tag">last done: {history[history.length - 1]}</div>
        ) : (
          ""
        )} */}
        </div>
      </div>
    );
  }
);

export default SequenceMove;

import { memo, useState } from "react";
import { Check, RotateCcw, Trash, X } from "react-feather";
import { daysAgo } from "../util/util";

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
      isPerSide,
      // history = null,
    } = move;

    const done = setsDone === sets;
    const inProgress = setsDone > 0 && !done;

    // Todo: More graceful way to handle purgeable CSS
    const containerCn =
      "bg-primary-800 relative my-2 mx-2 pt-2 px-2 pb-8 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 cursor-pointer";
    const containerCnDone =
      "bg-primary-500 relative my-2 mx-2 pt-2 px-2 pb-8 rounded-md flex flex-wrap items-center text-left content-start focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primary-600 cursor-pointer";

    const tagCn = "tag mr-2 mt-2";
    const tagCnDone = "tag mr=2 mt-2 opacity-50";

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
        <div className="absolute bottom-1 flex h-6">
          {Array.from(Array(sets).keys()).map((set) => {
            return (
              <div
                className={
                  done
                    ? "bg-heartFilled h-5 w-5 bg-size-cover mr-1 filter hue-rotate-90 brightness-200 opacity-40"
                    : set < setsDone
                    ? "bg-heartFilled h-5 w-5 bg-size-cover mr-1"
                    : "bg-heart h-5 w-5 bg-size-cover mr-1"
                }
              />
            );
          })}
        </div>
        <header className="text-primary-400 text-sm sm:text-sm md:text-lg font-display w-full">
          <span>{name}</span>
        </header>
        <div
          className={
            !done
              ? "ml-0 mb-2 flex flex-wrap text-sm"
              : "ml-0 mb-2 flex flex-wrap text-sm opacity-50"
          }
        >
          {repsMin && (
            <div className="tag mr-2 mt-2">
              {repsMin && repsMin}
              {repsMax && `-${repsMax}`}
              {isPerSide && `per side`}
              {sets && ` x ${sets}`}
            </div>
          )}
          {durationMin && (
            <div className="tag mr-2 mt-2">
              {durationMin && durationMin}
              {durationMax && `-${durationMax}`}
              {sets && ` x ${sets}`}
            </div>
          )}
          {focus && <div className="tag mr-2 mt-2">{focus}</div>}
        </div>
        {/* {!!done && <div className="absolute bottom-1 right-12">☑️</div>} */}

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
            <div className="tag">{daysAgo(history[history.length - 1])}</div>
          ) : (
            ""
          )} */}
      </div>
    );
  }
);

export default SequenceMove;

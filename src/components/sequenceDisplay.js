import SequenceHeader from "./sequenceHeader";
import SequenceMove from "./sequenceMove";

const SequenceDisplay = ({
  children,
  movesProgress,
  onEdit,
  selectedMoves,
  zeroAllProgress,
  toggleOneSelected,
  setOneProgress,
  moveListStatic,
}) => {
  return (
    <div className="space-y-4 items-stretch content-start w-full text-primary-300 bg-primary-900 h-screen overflow-y-auto p-5 pt-0 flex flex-wrap ">
      <SequenceHeader
        onEdit={onEdit}
        zeroAllProgress={zeroAllProgress}
        movesProgress={movesProgress}
        moveListStatic={moveListStatic}
        selectedMoves={selectedMoves}
      />
      <div className="flex flex-wrap w-full">
        {selectedMoves.map((move) => {
          return (
            <SequenceMove
              key={`${move.name}-${move.idx}`}
              move={move}
              setsDone={movesProgress[move.slug]}
              toggleOneSelected={toggleOneSelected}
              setOneProgress={setOneProgress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SequenceDisplay;

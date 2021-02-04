import { sampleSize, xorBy } from "lodash";
import { useEffect, useState } from "react";
import Move from "../src/components/move";
import meta from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
  const allMoves =
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList;

  const [selectedMoves, setSelectedMoves] = useState(
    meta.defaults.map((slug) => allMoves.find((mv) => mv.slug === slug))
  );

  const [editMode, setEditMode] = useState(true);

  const toggleMove = (move) =>
    editMode && setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  const chooseRandom = () => {
    const randomMoves = sampleSize(moveList, 10);
    setSelectedMoves(randomMoves);
    onFinalize();
  };

  useEffect(() => {
    console.log(`selectedMoves:`, selectedMoves);
  }, [selectedMoves]);
  const onFinalize = () => {
    // router.push(`/?editmode=false`, undefined, { shallow: true });
    setEditMode(false);
  };

  const onEdit = () => {
    // router.push(`/?editmode=true`, undefined, { shallow: true });
    setEditMode(true);
  };

  return (
    <div className="h-screen relative overflow-hidden border-2 border-gray-600">
      <button
        onClick={chooseRandom}
        className="w-min bg-yellow-700 text-yellow-100 text-sm py-3 px-4 rounded font-bold flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
      >
        random!
      </button>
      <div
        className={`${
          editMode
            ? "relative overflow-x-scroll scrollbar scrollbar-thumb-yellow-900 scrollbar-track-yellow-600"
            : "relative overflow-hidden"
        }  p-5 grid grid-rows-3 grid-flow-col auto-cols-max gap-2`}
      >
        {/* All */}
        {allMoves.map((m, i) => {
          return (
            <Move
              key={`${m.name}-${i}`}
              onClick={() => toggleMove(m)}
              move={{ name: m.name }}
              tags={[m.focus]}
            />
          );
        })}
      </div>

      {/* Selected */}
      <div
        className={`${
          editMode
            ? "w-full h-4/6 flex flex-wrap space-y-3 space-x-2 items-start flex-start content-start"
            : "fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll bg-gray-900"
        }`}
      >
        <h3 className="text-yellow-100 pt-7 p-3 font-display w-full">
          Selected moves (n = {selectedMoves.length})
        </h3>

        {selectedMoves.map((m, i) => {
          const { name, repsMin, repsMax, durationMin, durationMax, sets } = m;

          return (
            <Move
              key={`${m.name}-${i}`}
              onClick={() => toggleMove(m)}
              move={{
                name,
              }}
              tags={m.focus.split(",")}
            />
          );
        })}
      </div>
      {true && (
        <button
          onClick={editMode ? onFinalize : onEdit}
          className="absolute bottom-0 right-0 bg-yellow-800 text-yellow-100 text-sm py-3 px-4 rounded font-bold flex items-center mr-4 hover:bg-yellow-500 focus:outline-none focus:bg-yellow-400"
        >
          {editMode ? "done!" : "x"}
        </button>
      )}
    </div>
  );
};

export default Home;

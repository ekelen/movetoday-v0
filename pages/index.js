import { xorBy } from "lodash";
import { Fragment, useEffect, useState } from "react";
import Move from "../src/components/move";
import { foci } from "../src/data/constants";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";
import { randInt } from "../src/util/util";

import { useRouter } from "next/router";

const Home = ({ content }) => {
  // const router = useRouter();
  const allMoves =
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList;
  const [selectedMoves, setSelectedMoves] = useState([allMoves[0]]);
  const [editMode, setEditMode] = useState(true);

  const toggleMove = (move) =>
    editMode && setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  const getMovesForFocus = (focus) =>
    allMoves.filter((m) => m.focus.includes(focus));

  const chooseRandom = () => {
    const randomMoves = foci
      .map((focus) => getMovesForFocus(focus))
      .filter((movesByFocus) => movesByFocus.length)
      .map((movesByFocus) => movesByFocus[randInt(movesByFocus.length)]);
    setSelectedMoves(randomMoves);
  };

  const onFinalize = () => {
    // router.push(`/?editmode=false`, undefined, { shallow: true });
    setEditMode(false);
  };

  const onEdit = () => {
    // router.push(`/?editmode=true`, undefined, { shallow: true });
    setEditMode(true);
  };

  return (
    <div className="h-screen overflow-hidden border-2 border-gray-600">
      <button
        onClick={chooseRandom}
        className="bg-gray-800 text-white text-sm py-3 px-4 rounded font-bold flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
      >
        move!
      </button>

      <div
        className={`${
          editMode
            ? "overflow-x-scroll scrollbar scrollbar-thumb-yellow-900 scrollbar-track-yellow-600"
            : "relative overflow-hidden"
        }  p-5 grid grid-rows-3 grid-flow-col auto-cols-max gap-2`}
      >
        {/* All */}
        {allMoves.map((m, i) => {
          return (
            <Move
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
            : "fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll bg-blue-700"
        }`}
      >
        <h3 className="font-display w-full">
          Selected moves (n = {selectedMoves.length})
        </h3>
        {foci
          .filter((focus) => selectedMoves.some((m) => m.focus.includes(focus)))
          .map((focus, i) => {
            return (
              <div
                key={`${focus}-${i}`}
                className="flex flex-wrap space-x-2 space-y-2 items-start"
              >
                <h4 className="font-display bg-blue-600 bg-opacity-60 w-min">
                  {focus}
                </h4>
                {selectedMoves
                  .filter((m) => m.focus.includes(focus))
                  .map((m, i) => {
                    const {
                      name,
                      repsMin,
                      repsMax,
                      durationMin,
                      durationMax,
                      sets,
                    } = m;
                    return (
                      <Move
                        key={`${m.name}-${i}`}
                        onClick={() => toggleMove(m)}
                        move={{
                          name,
                        }}
                      />
                    );
                  })}
              </div>
            );
          })}
      </div>
      {true && (
        <button
          onClick={editMode ? onFinalize : onEdit}
          //
          className="sticky bottom-0 right-0 bg-gray-800 text-white text-sm py-3 px-4 rounded font-bold flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
        >
          {editMode ? "done!" : "x"}
        </button>
      )}
    </div>
  );
};

export default Home;

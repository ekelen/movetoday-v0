import { useEffect, useMemo, useState } from "react";
import { areaNames } from "../src/util/util";
import { xorBy, uniqBy, flatten } from "lodash";
import Move from "../src/components/move";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
  const allMoves =
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList;
  const [selectedMoves, setSelectedMoves] = useState([]);

  const toggleMove = (move) =>
    setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  const chooseRandom = () =>
    setSelectedMoves(
      flatten(
        areaNames.map(
          (a) =>
            allMoves.filter((m) => m.focus.includes(a))[
              Math.floor(
                Math.random() *
                  Math.floor(allMoves.filter((m) => m.focus.includes(a)).length)
              )
            ]
        )
      )
    );

  return (
    <div className="w-full flex p-5">
      <button onClick={chooseRandom}>Choose</button>
      {/* All */}
      <div className="w-1/2">
        <div className="w-full flex flex-wrap flex-grow flex-shrink-0 space-x-1 space-y-2">
          <h3 className="font-display w-full">
            All moves (n = {allMoves.length})
          </h3>
          {areaNames.map((area, i) => {
            return (
              <div
                key={`${area}-${i}`}
                className="flex flex-wrap space-x-2 space-y-2 items-start"
              >
                <h4 className="font-display bg-blue-600 bg-opacity-30 w-min">
                  {area}
                </h4>
                {allMoves
                  .filter((m) => m.focus.includes(area))
                  .map((m, i) => {
                    return (
                      <div
                        className="pt-2 p-1 bg-blue-200 bg-opacity-20 border-black border-b-2"
                        onClick={() => toggleMove(m)}
                        key={`${m.name}-${i}`}
                      >
                        <Move move={{ name: m.name }} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-1/2 flex flex-wrap space-y-3 space-x-2 items-start flex-start content-start">
        <h3 className="font-display w-full">
          Selected moves (n = {selectedMoves.length})
        </h3>
        {areaNames
          .filter((a) => selectedMoves.some((m) => m.focus.includes(a)))
          .map((area, i) => {
            return (
              <div className="flex flex-wrap space-x-2 space-y-2 items-start">
                <h4 className="font-display bg-blue-600 bg-opacity-60 w-min">
                  {area}
                </h4>
                {selectedMoves
                  .filter((m) => m.focus.includes(area))
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
                      <div
                        className="pt-3 p-2 w-min bg-yellow-200"
                        onClick={() => toggleMove(m)}
                        key={`${m.name}-${i}`}
                      >
                        <Move
                          move={{
                            name,
                            repsMin,
                            repsMax,
                            durationMax,
                            durationMin,
                            sets,
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;

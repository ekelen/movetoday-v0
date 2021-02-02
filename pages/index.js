import { useEffect, useMemo, useState } from "react";
import { areaNames } from "../src/util/util";
import { xorBy, uniqBy } from "lodash";
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

  return (
    <div className="w-screen flex p-5">
      <div className="w-1/2">
        <h3 className="font-display">All moves (n = {allMoves.length})</h3>
        {areaNames.map((area, i) => {
          return (
            <div>
              <h4 className="font-display bg-blue-600 bg-opacity-30 w-min">
                {area}
              </h4>
              {allMoves
                .filter((m) => m.focus.includes(area))
                .map((m, i) => {
                  return (
                    <div
                      className="pt-10 p-5 bg-blue-200 bg-opacity-20 border-black border-b-2"
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

      <div className="w-1/2">
        <h3 className="font-display">
          Selected moves (n = {selectedMoves.length})
        </h3>
        {areaNames
          .filter((a) => selectedMoves.some((m) => m.focus.includes(a)))
          .map((area, i) => {
            return (
              <div>
                <h4 className="font-display bg-blue-600 bg-opacity-60 w-min">
                  {area}
                </h4>
                {selectedMoves
                  .filter((m) => m.focus.includes(area))
                  .map((m, i) => {
                    return (
                      <div
                        className="pt-10 p-5 bg-yellow-200"
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
  );
};

export default Home;

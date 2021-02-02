import { useEffect, useMemo, useState } from "react";
import Areas from "../src/components/areas";
import { areaNames } from "../src/util/util";
import { xorBy } from "lodash";
import MovesArea from "../src/components/movesArea";
import Move from "../src/components/move";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
  const allMoves =
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList;
  const [selectedMoves, setSelectedMoves] = useState([]);
  const selectedAreas = useMemo(() => {
    [...new Set(...selectedMoves.map((m) => m.focus.split(",")))];
  }, [selectedMoves]);

  const toggleMove = (move) =>
    setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  return (
    <div>
      <Areas>
        <div className="allMovesArea">
          <h4>All moves (n = {allMoves.length})</h4>
          {areaNames.map((area, i) => {
            return (
              <MovesArea key={`${area}-${i}`} areaTitle={area}>
                {allMoves
                  .filter((m) => m.focus.includes(area))
                  .map((m, i) => {
                    return (
                      <div onClick={() => toggleMove(m)} key={`${m.name}-${i}`}>
                        <Move move={m} />
                      </div>
                    );
                  })}
              </MovesArea>
            );
          })}
        </div>

        <div className="selectedMovesArea">
          <h2>Selected moves (n = {selectedMoves.length})</h2>
          {areaNames.map((area, i) => {
            return (
              <MovesArea key={`${area}-${i}`} areaTitle={area}>
                {selectedMoves
                  .filter((m) => m.focus.includes(area))
                  .map((move, i) => {
                    return (
                      <div
                        onClick={() => toggleMove(move)}
                        key={`${move.name}-${i}`}
                      >
                        <Move move={move} />
                      </div>
                    );
                  })}
              </MovesArea>
            );
          })}
        </div>
      </Areas>
    </div>
  );
};

export default Home;

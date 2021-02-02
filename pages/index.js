import { useEffect, useMemo, useState } from "react";
import Areas from "../src/components/areas";
import { areaNames } from "../src/util/util";
import { xorBy } from "lodash";
import MovesArea from "../src/components/movesArea";
import Move from "../src/components/move";
import allMoves from "../src/data/cleanData.json";
import { bloatStaticData } from "../src/util/test.js";

console.log(
  `process.env.NEXT_PUBLIC_LIGHTHOUSE:`,
  process.env.NEXT_PUBLIC_LIGHTHOUSE
);

const moves =
  process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
    ? bloatStaticData(allMoves)
    : allMoves;

const Home = ({ content }) => {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const selectedAreas = useMemo(() => {
    [...new Set(...selectedMoves.map((m) => m.focus.split(",")))];
  }, [selectedMoves]);

  const toggleMove = (move) =>
    setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  return (
    <div>
      {/* <div sx={{ display: "flex", alignItems: "center", height: "100%" }}> */}
      {/* <div sx={{ display: "flex", alignItems: "center", height: "100%" }}> */}
      <Areas>
        <div className="allMovesArea">
          <h4>All moves (n = {moves.length})</h4>
          {areaNames.map((area) => {
            return (
              <MovesArea key={area} areaTitle={area}>
                {moves
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
          {areaNames.map((area) => {
            return (
              <MovesArea key={area} areaTitle={area}>
                {selectedMoves
                  .filter((m) => m.focus.includes(area))
                  .map((move) => {
                    return (
                      <div
                        onClick={() => toggleMove(move)}
                        key={`${move.name}`}
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

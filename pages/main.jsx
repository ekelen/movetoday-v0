import { useEffect, useMemo, useState } from "react";
import Areas from "../src/components/areas";
import allMoves from "../src/data/cleanData.json";
import { areaNames } from "../src/util";
import { xorBy } from "lodash";
import MovesArea from "../src/components/movesArea";
import Move from "../src/components/move";

export default ({ content }) => {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const selectedAreas = useMemo(() => {
    [...new Set(...selectedMoves.map((m) => m.focus.split(",")))];
  }, [selectedMoves]);

  const toggleMove = (move) =>
    setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  return (
    <div sx={{ height: `calc(100vh - 60px)` }}>
      <div sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <h1 sx={{ fontSize: 8, my: 0 }}>Move Today</h1>
        <pre>{JSON.stringify(selectedMoves.map((m) => m.name))}</pre>
        <aside>
          <Areas moves={allMoves}>
            {areaNames.map((area) => {
              return (
                <MovesArea key={area} areaTitle={area}>
                  {allMoves
                    .filter((m) => m.focus.includes(area))
                    .map((move) => {
                      console.log(`move:`, move);
                      return (
                        <div onClick={() => toggleMove(move)}>
                          <Move move={move} />
                        </div>
                      );
                    })}
                </MovesArea>
              );
            })}
          </Areas>
        </aside>
        <aside>
          <header>
            <h2>
              Today's Plan -{" "}
              {new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h2>
          </header>
          <section>
            {areaNames.map((area) => {
              return (
                <MovesArea key={area} areaTitle={area}>
                  {selectedMoves
                    .filter((m) => m.focus.includes(area))
                    .map((move) => {
                      console.log(`move:`, move);
                      return (
                        <div onClick={() => toggleMove(move)}>
                          <Move move={move} />
                        </div>
                      );
                    })}
                </MovesArea>
              );
            })}
          </section>
        </aside>
      </div>
    </div>
  );
};
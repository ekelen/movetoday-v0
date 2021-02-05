import { sampleSize, xorBy, sortBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import Move from "../src/components/move";
import meta from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

import Head from "next/head";

const Home = ({ content }) => {
  const SORTKEY = "name";
  const [initialMoveList] = useState(
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList
  );
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedMoves, setSelectedMoves] = useState(
    meta.defaults.map((slug) => initialMoveList.find((mv) => mv.slug === slug))
  );
  const [allMoves, setAllMoves] = useState(initialMoveList);

  const onSearch = (e) => {
    const {
      target: { value },
    } = e;
    setSearchFilter(value);
    setAllMoves(
      !value
        ? allMoves
        : allMoves.filter((move) => move.name.includes(searchFilter))
    );
    // e.preventDefault();
  };

  const [editMode, setEditMode] = useState(true);

  const toggleMove = (move) =>
    editMode && setSelectedMoves(xorBy(selectedMoves, [move], "id"));

  const chooseRandom = () => {
    const randomMoves = sampleSize(allMoves, 10);
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

  const onSelectDefault = () =>
    setSelectedMoves(
      meta.defaults.map((slug) =>
        initialMoveList.find((mv) => mv.slug === slug)
      )
    );

  return (
    <Fragment>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="h-screen relative overflow-hidden border-2 border-gray-600">
        <header className="flex wrap p-2 items-center w-full text-yellow-100 font-mono space-x-2 space-y-2">
          <input
            type="text"
            placeholder="🔎 search!"
            onChange={onSearch}
            value={searchFilter}
            className="w-min bg-yellow-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold flex items-center self-bottom mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 placeholder-yellow-100"
          ></input>
          <div className="flex space-x-2 items-center">
            <button className="w-min py-2 px-4 bg-gray-700 rounded-full">
              flow
            </button>
            <button className="w-min py-2 px-4 bg-gray-700 rounded-full">
              handstand
            </button>
            <button className="w-min py-2 px-4 bg-gray-700 rounded-full">
              warmup
            </button>
            <button className="w-min py-2 px-4 bg-gray-700 rounded-full whitespace-nowrap">
              challenge pose
            </button>
          </div>
          <button
            onClick={() => {
              setSearchFilter("");
            }}
            className="w-min bg-yellow-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            reset!
          </button>
        </header>
        <div
          className={`${
            editMode
              ? "relative overflow-x-scroll scrollbar scrollbar-thumb-yellow-900 scrollbar-track-yellow-600"
              : "relative overflow-hidden"
          }  p-5 grid grid-rows-3 grid-flow-col auto-cols-max gap-2`}
        >
          {/* All */}

          {sortBy(allMoves, SORTKEY).map((m, i) => {
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
          <header className="w-full flex p-2 items-center space-x-2">
            <h3 className="text-yellow-100 font-display">
              Selected moves (n = {selectedMoves.length})
            </h3>
            <button
              onClick={onSelectDefault}
              className="w-min bg-yellow-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              default!
            </button>
            <button
              onClick={chooseRandom}
              className="w-min bg-yellow-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              random!
            </button>
            <button
              onClick={() => setSelectedMoves([])}
              className="w-min bg-yellow-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              clear!
            </button>
            <button
              onClick={editMode ? onFinalize : onEdit}
              className="bg-yellow-800 text-yellow-100 text-sm py-2 px-3 rounded font-bold flex items-center hover:bg-yellow-500 focus:outline-none focus:bg-yellow-400"
            >
              {editMode ? "done!" : "x"}
            </button>
          </header>

          {selectedMoves.map((m, i) => {
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
                tags={m.focus.split(",")}
              />
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;

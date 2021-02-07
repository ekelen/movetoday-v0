import {
  intersectionBy,
  omit,
  omitBy,
  pick,
  pickBy,
  sample,
  sampleSize,
  sortBy,
  uniqBy,
  xorBy,
} from "lodash";
import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";

import Move from "../src/components/move";
import { foci } from "../src/data/constants";
import meta from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
  const SORTKEY = "name";
  const [initialMoveList] = useState(
    process.env.NEXT_PUBLIC_LIGHTHOUSE === "on"
      ? bloatDataInMemory(moveList)
      : moveList
  );
  const [searchFilter, setSearchFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [selectedMoves, setSelectedMoves] = useState(
    meta.defaults.map((slug) => initialMoveList.find((mv) => mv.slug === slug))
  );
  const [allMoves, setAllMoves] = useState(initialMoveList);
  // const [availableMoves, setAvailableMoves] = useState();

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  const availableMoves = useMemo(() => {
    const containsQuery = !searchFilter
      ? initialMoveList
      : initialMoveList.filter(
          (m) => m.name.includes(searchFilter) || m.focus.includes(searchFilter)
        );
    const hasFocus = !focusFilter
      ? initialMoveList
      : initialMoveList.filter((m) => m.focus === focusFilter);
    // setAllMoves(uniqBy(containsQuery.concat(hasFocus)), 'id')
    // setAvailableMoves(uniqBy(containsQuery.concat(hasFocus)), "id");
    return intersectionBy(containsQuery, hasFocus, "id");
  }, [searchFilter, focusFilter]);

  const onToggleDone = (move) =>
    // todo
    {
      move.done = !move.done;
      setAllMoves([...allMoves.filter((m) => m.id !== move.id), move]);
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
      <div className="h-screen relative overflow-hidden border-2 border-gray-600 flex flex-wrap items-center">
        <header className="flex flex-wrap p-2 items-center w-full text-yellow-100 font-mono space-x-2 space-y-2">
          <input
            type="text"
            aria-label="search"
            placeholder="🔎 search!"
            onChange={onSearch}
            value={searchFilter}
            className={`w-min text-yellow-100 bg-gray-700 text-sm py-2 px-3 rounded font-bold flex items-center self-bottom mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 placeholder-yellow-100`}
          ></input>
          <div className="flex space-x-2 items-center">
            {[...foci, "any"].map((focus, i) => (
              <button
                key={`${focus}-${i}`}
                aria-label={`moves with ${focus} focus`}
                className={`${
                  focus === focusFilter || (!focusFilter && focus === "any")
                    ? "bg-indigo-600"
                    : "bg-gray-700"
                }  whitespace-nowrap text-xs w-min py-2 px-4 rounded-full`}
                onClick={() => setFocusFilter(focus === "any" ? "" : focus)}
              >
                {focus}
              </button>
            ))}
          </div>
          <button
            aria-label="clear filters"
            onClick={() => {
              setSearchFilter("");
              setFocusFilter("");
            }}
            className="w-min bg-purple-700 text-yellow-100 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
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

          {availableMoves.map((m, i) => {
            return (
              <Move
                key={`${m.name}-${i}`}
                onClick={() => toggleMove(m)}
                move={{ name: m.name }}
                tags={[m.focus]}
                editMode={true}
              />
            );
          })}
        </div>

        {/* Selected */}
        <div
          className={`${
            editMode
              ? "w-full h-4/6 flex flex-wrap space-y-3 space-x-2 items-start flex-start content-start"
              : "fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll space-y-3 bg-gray-900"
          }`}
        >
          <header className="w-full flex p-2 items-center space-x-2">
            <h3 className="text-yellow-100 font-display">
              Selected moves (n = {selectedMoves.length})
            </h3>
            {editMode && (
              <Fragment>
                <button
                  onClick={onSelectDefault}
                  className="w-min bg-purple-800 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                >
                  default
                </button>
                <button
                  onClick={chooseRandom}
                  className="w-min bg-purple-800 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                >
                  random
                </button>
                <button
                  onClick={() => setSelectedMoves([])}
                  className="w-min bg-purple-800 text-yellow-100 text-sm py-2 px-3 rounded font-bold font-mono flex items-center mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                >
                  clear
                </button>
              </Fragment>
            )}
            <button
              onClick={editMode ? onFinalize : onEdit}
              className="bg-yellow-600 text-yellow-100 text-sm py-2 px-3 rounded-full font-bold flex items-center hover:bg-yellow-500 focus:outline-none focus:bg-yellow-400"
            >
              {editMode ? "done! ▶" : "x"}
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
                onClick={editMode ? () => toggleMove(m) : () => onToggleDone(m)}
                move={{
                  name,
                }}
                editMode={!!editMode}
                done={!editMode && !!m.done}
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

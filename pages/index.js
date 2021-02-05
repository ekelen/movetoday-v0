import {
  sampleSize,
  sample,
  xorBy,
  sortBy,
  pickBy,
  pick,
  omit,
  omitBy,
  uniqBy,
  intersectionBy,
} from "lodash";
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
      : initialMoveList.filter((m) => m.focus.includes(focusFilter));
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
      <div className="h-screen relative overflow-hidden border-2 border-gray-600">
        <header className="flex wrap p-2 items-center w-full text-yellow-100 font-mono space-x-2 space-y-2">
          <input
            type="text"
            aria-label="search"
            placeholder="🔎 search!"
            onChange={onSearch}
            value={searchFilter}
            className={`w-min text-yellow-100 bg-gray-700 text-sm py-2 px-3 rounded font-bold flex items-center self-bottom mr-4 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 placeholder-yellow-100`}
          ></input>
          <div className="flex space-x-2 items-center">
            <button
              aria-label="flow-focus"
              className={`${
                focusFilter === "flow" ? "bg-yellow-700" : "bg-gray-700"
              }  w-min py-2 px-4 rounded-full`}
              onClick={() => setFocusFilter("flow")}
            >
              flow
            </button>
            <button
              aria-label="handstand-focus"
              className={`${
                focusFilter === "handstand" ? "bg-yellow-700" : "bg-gray-700"
              }  w-min py-2 px-4 rounded-full`}
              onClick={() => setFocusFilter("handstand")}
            >
              handstand
            </button>
            <button
              aria-label="warmup focus"
              className={`${
                focusFilter === "warmup" ? "bg-yellow-700" : "bg-gray-700"
              }  w-min py-2 px-4 rounded-full`}
              onClick={() => setFocusFilter("warmup")}
            >
              warmup
            </button>
            <button
              aria-label="challenge pose focus"
              className={`${
                focusFilter === "challenge pose"
                  ? "bg-yellow-700"
                  : "bg-gray-700"
              }  w-min py-2 px-4 rounded-full whitespace-nowrap`}
              onClick={() => setFocusFilter("challenge pose")}
            >
              challenge pose
            </button>
            <button
              aria-label="no focus filter"
              className={`${
                focusFilter === "all" || !focusFilter
                  ? "bg-yellow-700"
                  : "bg-gray-700"
              }  w-min py-2 px-4 rounded-full whitespace-nowrap`}
              onClick={() => setFocusFilter("")}
            >
              all
            </button>
          </div>
          <button
            aria-label="clear filters"
            onClick={() => {
              setSearchFilter("");
              setFocusFilter("");
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
              </Fragment>
            )}
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

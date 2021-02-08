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

import Header from "../src/components/header";
import Move from "../src/components/move";
import SequenceDisplay from "../src/components/sequenceDisplay";
import { foci } from "../src/data/constants";
import meta from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
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
  const [editMode, setEditMode] = useState(true);

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
    return intersectionBy(containsQuery, hasFocus, "id");
  }, [searchFilter, focusFilter]);

  const onToggleDone = (move) =>
    // todo
    {
      move.done = !move.done;
      setAllMoves([...allMoves.filter((m) => m.id !== move.id), move]);
    };

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

  const onChange = (e) => {
    setFocusFilter(e.target.value === "any" ? "" : e.target.value);
  };
  return (
    <Fragment>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {editMode && (
        <Fragment>
          <Header></Header>
          <div className="bg-primary-900 h-screen relative overflow-hidden border-2 border-gray-600 flex flex-wrap items-center">
            <div className="flex items-center w-full space-x-3 px-3">
              <input
                type="text"
                aria-label="search"
                placeholder="🔎 search!"
                onChange={onSearch}
                value={searchFilter}
                className={`w-min text-primary-100 bg-primary-700 text-sm py-2 px-3 rounded font-bold flex items-center self-bottom mr-4 hover:bg-primary-100`}
              ></input>
              {/* Dropdown */}
              <select
                className="px-2 py-1 rounded-full flex lg:hidden"
                value={focusFilter}
                onChange={onChange}
                autoComplete="on"
              >
                {[...foci, "any"].map((focus, i) => {
                  return (
                    <option
                      key={focus + `${i}`}
                      disabled={focusFilter === focus}
                      value={focus}
                    >
                      {focus}
                    </option>
                  );
                })}
              </select>

              {/* Tags */}
              <div className="hidden lg:flex space-x-2 items-center">
                {[...foci, "any"].map((focus, i) => (
                  <button
                    key={`${focus}-${i}`}
                    aria-label={`moves with ${focus} focus`}
                    className={`${
                      focus === focusFilter || (!focusFilter && focus === "any")
                        ? "bg-primaryAction-500"
                        : "bg-primary-400 opacity-60"
                    }  whitespace-nowrap uppercase text-xs w-min py-1 px-2 rounded-full`}
                    onClick={() => setFocusFilter(focus === "any" ? "" : focus)}
                  >
                    {focus}
                  </button>
                ))}
              </div>

              {/* Clear filters */}
              <button
                aria-label="clear filters"
                disabled={
                  !searchFilter && (!focusFilter || focusFilter === "any")
                }
                onClick={() => {
                  setSearchFilter("");
                  setFocusFilter("");
                }}
                className="w-min bg-primary-200 text-primary-700 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 hover:bg-primary-500 disabled:opacity-30 disabled:hover:cursor-not-allowed"
              >
                reset
              </button>
            </div>
            <div
              className={`${
                editMode
                  ? "relative overflow-x-scroll scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900"
                  : "relative hidden"
              }  p-5 grid grid-rows-3 grid-flow-col auto-cols-max gap-2`}
            >
              {/* All */}

              {availableMoves.map((m, i) => {
                return (
                  <Move
                    key={`${m.name}-${i}`}
                    onClick={() => toggleMove(m)}
                    move={m}
                    selected={selectedMoves.map((m) => m.id).includes(m.id)}
                  />
                );
              })}
            </div>

            {/* Selected */}
            <div
              className={`${
                editMode
                  ? "p-5 w-full min-h-3/6 h-3/6 flex flex-wrap overflow-y-auto scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900"
                  : // : "fixed top-0 left-0 right-0 bottom-0 overflow-y-scroll space-y-3 bg-primary-900"
                    "hidden"
              }`}
            >
              <div className="bg-primary-800 mb-5 w-full p-2 rounded-md flex flex-wrap space-y-4 space-x-4 items-start flex-start content-start">
                <header className="w-full flex p-2 items-center space-x-4 space-y-2">
                  <h3 className="text-primary-100 font-display">
                    {selectedMoves.length} selected
                  </h3>

                  <button
                    onClick={onSelectDefault}
                    className="shadow-lg w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
                  >
                    default
                  </button>
                  <button
                    onClick={chooseRandom}
                    className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
                  >
                    random
                  </button>
                  <button
                    onClick={() => setSelectedMoves([])}
                    className="w-min bg-primary-300 text-primary-800 text-sm py-2 px-3 rounded font-mono flex items-center mr-4 hover:bg-primary-400 focus:outline-none focus:bg-primary-300"
                  >
                    clear
                  </button>
                  <button
                    onClick={onFinalize}
                    className="bg-primary-600 text-primary-900 font-display py-1 px-3 rounded-full flex items-center hover:bg-primary-500 focus:outline-none focus:bg-primary-400"
                  >
                    {"done! ▶"}
                  </button>
                </header>

                <Fragment>
                  {selectedMoves.map((m, i) => {
                    return (
                      <Move
                        key={`${m.name}-${i}`}
                        onClick={() => toggleMove(m)}
                        move={m}
                        area="selected"
                      />
                    );
                  })}
                </Fragment>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {!editMode && (
        <SequenceDisplay
          selectedMoves={selectedMoves}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
        />
      )}
    </Fragment>
  );
};

export default Home;

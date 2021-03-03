import { Fragment, useEffect, useRef, useState } from "react";
import { foci } from "../data/meta.json";
import Move from "./move";

const AllMoves = ({
  moveListStatic,
  movesProgress, // aka selected
  onSelectDefault,
  onSelectRandom,
  onSetOneSelected,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const disabled = !searchFilter && (!focusFilter || focusFilter === "any");

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  const onEnterSearchText = (e) => {
    setFocusFilter(e.target.value === "any" ? "" : e.target.value);
  };

  const presetTextCn =
    "inline-block uppercase text-primary-100 bg-primary-800 text-xs px-2 py-1 rounded focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300";

  const tagButtonCnDisabled =
    "bg-primaryAction-500 text-primary-800 whitespace-nowrap uppercase text-xs w-min py-1 px-2 rounded-full cursor-default focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-primary-300 active:ring-4 active:ring-offset-1 active:ring-primary-300";
  const tagButtonCn =
    "bg-primary-400 text-primary-800 whitespace-nowrap uppercase text-xs w-min py-1 px-2 rounded-full focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-400";
  return (
    <Fragment>
      <div className="text-primary-400 text-xs uppercase">
        1. Choose moves or use{" "}
        <button className={presetTextCn} onClick={onSelectDefault}>
          default
        </button>{" "}
        or{" "}
        <button className={presetTextCn} onClick={onSelectRandom}>
          random
        </button>
      </div>

      <div className="flex items-center w-full space-x-3 px-3 p-4">
        <input
          type="text"
          aria-label="search"
          placeholder="🔎 search!"
          onChange={onSearch}
          value={searchFilter}
          className={`w-min text-sm py-2 px-3 rounded font-bold flex items-center self-bottom mr-4 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 text-primary-100 placeholder-gray-100 bg-primary-700 hover:bg-primary-600`}
        ></input>

        {/* Dropdown */}
        <select
          className="px-2 py-1 rounded-full flex lg:hidden"
          value={focusFilter}
          onChange={onEnterSearchText}
          autoComplete="on"
        >
          {[...foci, ""].map((focus, i) => {
            return (
              <option
                key={`key-${focus || "any"}`}
                disabled={focusFilter === focus}
                value={focus}
              >
                {focus || "any"}
              </option>
            );
          })}
        </select>

        {/* Tags */}
        <div className="hidden lg:flex space-x-2 items-center">
          {[...foci, "any"].map((focus, i) => {
            const tagDisabled =
              focus === focusFilter || (!focusFilter && focus === "any");
            return (
              <button
                key={`${focus}-${i}`}
                aria-label={`moves with ${focus} focus`}
                disabled={!!tagDisabled}
                className={tagDisabled ? tagButtonCnDisabled : tagButtonCn}
                onClick={() => setFocusFilter(focus === "any" ? "" : focus)}
              >
                {focus}
              </button>
            );
          })}
        </div>

        {/* Clear filters */}
        <button
          aria-label="clear filters"
          onClick={() => {
            setSearchFilter("");
            setFocusFilter("");
          }}
          className="btn-pill"
          disabled={disabled}
        >
          reset
        </button>
      </div>
      <div className="grid grid-rows-moveHeight grid-flow-col auto-cols-max gap-2 w-screen relative overflow-x-scroll scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900 p-5 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300">
        {moveListStatic
          .filter((mv) => {
            const filteredIn =
              mv.focus.includes(focusFilter) &&
              mv.name.toLowerCase().includes(searchFilter);
            return filteredIn;
          })
          .map((m) => {
            return (
              <Move
                key={`${m.name}-${m.idx}`}
                onClick={onSetOneSelected}
                move={m}
                selected={Object.keys(movesProgress).includes(m.slug)}
              />
            );
          })}
      </div>
    </Fragment>
  );
};

export default AllMoves;

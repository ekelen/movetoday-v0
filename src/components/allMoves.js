import { Fragment, useEffect, useRef, useState } from "react";
import { Search, X } from "react-feather";
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

  return (
    <Fragment>
      <div className="mt-2 px-3 text-primary-400 text-xs uppercase">
        1. Choose moves or use{" "}
        <button className={presetTextCn} onClick={onSelectDefault}>
          default
        </button>{" "}
        or{" "}
        <button className={presetTextCn} onClick={onSelectRandom}>
          random
        </button>
      </div>

      <div className="flex items-center w-full space-x-4 px-3 py-4">
        <input
          type="text"
          aria-label="search"
          placeholder={"🔎   search!"}
          onChange={onSearch}
          value={searchFilter}
          className={`bg-primary-700 flex focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 font-bold hover:bg-primary-600 items-center placeholder-opacity-75 placeholder-primary-100 px-3 py-2 relative rounded self-bottom text-primary-100 text-sm w-min`}
        ></input>

        {/* Dropdown */}

        <select
          className="bg-primary-700 flex font-bold font-sans lg:hidden opacity-75 px-2 py-1 rounded-full text-primary-100 text-sm"
          value={focusFilter}
          onChange={onEnterSearchText}
          autoComplete="on"
          type="text"
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
                className={"tag tag-on-dark tag-btn"}
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
          className="btn-pill btn-primary"
          disabled={disabled}
        >
          <X size={16} />
          <p className="ml-1">reset filters</p>
        </button>
      </div>
      <div className="grid grid-rows-moveHeight grid-flow-col auto-cols-max gap-2 relative overflow-x-scroll scrollbar-thin scrollbar-thumb-primary-700 scrollbar-track-primary-900 p-5 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300">
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

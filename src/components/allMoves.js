import { Fragment } from "react";
import { foci } from "../data/constants";
import Move from "./move";

const AllMovesHeader = ({
  onSearch,
  searchFilter,
  focusFilter,
  onChange,
  setSearchFilter,
  setFocusFilter,
}) => {
  return (
    <div className="flex items-center w-full space-x-3 px-3 p-4">
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
            disabled={
              focus === focusFilter || (!focusFilter && focus === "any")
            }
            className={
              focus === focusFilter || (!focusFilter && focus === "any")
                ? "bg-primaryAction-500 text-primary-800 whitespace-nowrap uppercase text-xs w-min py-1 px-2 rounded-full cursor-default"
                : "bg-primary-400 text-primary-800 whitespace-nowrap uppercase text-xs w-min py-1 px-2 rounded-full"
            }
            onClick={() => setFocusFilter(focus === "any" ? "" : focus)}
          >
            {focus}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      <button
        aria-label="clear filters"
        disabled={!searchFilter && (!focusFilter || focusFilter === "any")}
        onClick={() => {
          setSearchFilter("");
          setFocusFilter("");
        }}
        className="w-min bg-primary-200 text-primary-700 text-sm py-2 px-3 rounded font-bold flex items-center mr-4 focus:ring-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        reset
      </button>
    </div>
  );
};

const AllMoves = ({
  availableMoves,
  setFocusFilter,
  focusFilter,
  setSearchFilter,
  searchFilter,
  onToggleMove,
  selectedMoves,
  onChange,
  onSearch,
  onSelectDefault,
  onSelectRandom,
}) => {
  const presetText =
    "inline-block uppercase text-primary-100 bg-primary-800 text-xs px-2 py-1 rounded";
  return (
    <div className="relative overflow-hidden mx-5 my-2 p-3 rounded border-primary-400 border-2">
      <div className="text-primary-400 text-xs uppercase">
        1. Choose moves or use{" "}
        <button className={presetText} onClick={onSelectDefault}>
          default
        </button>{" "}
        or{" "}
        <button className={presetText} onClick={onSelectRandom}>
          random
        </button>
      </div>
      <AllMovesHeader
        {...{
          setFocusFilter,
          setSearchFilter,
          onChange,
          onSearch,
          searchFilter,
          focusFilter,
        }}
      />
      <div className="grid grid-rows-moveHeight grid-flow-col auto-cols-max gap-2 w-screen relative overflow-x-scroll scrollbar scrollbar-thumb-primary-800 scrollbar-track-primary-900 p-5">
        {availableMoves.map((m, i) => {
          return (
            <Move
              key={`${m.name}-${i}`}
              onClick={() => onToggleMove(m)}
              move={m}
              selected={selectedMoves.map((m) => m.id).includes(m.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AllMoves;

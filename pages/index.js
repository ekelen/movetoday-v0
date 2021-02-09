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
import AllMoves from "../src/components/allMoves";

import Header from "../src/components/header";
import Move from "../src/components/move";
import SelectedMoves from "../src/components/selectedMoves";
import SequenceDisplay from "../src/components/sequenceDisplay";
import { defaults, foci } from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const Home = ({ content }) => {
  // TODO: Replace [allMoves, selectedMoves, availableMoves] by one move list, preserving indices, adding 'selected' and 'available' prop
  //    so we don't have to sort every time we update lists of moves
  const defaultSort = (arr) =>
    sortBy(arr, (item) => foci.indexOf(item.focus), ["name"]);

  const [initialMoveList] = useState(
    process.env.NEXT_PUBLIC_HEAVY === "on"
      ? bloatDataInMemory(moveList)
      : moveList
  );
  const [searchFilter, setSearchFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [allMoves, setAllMoves] = useState(initialMoveList);
  const [editMode, setEditMode] = useState(true);

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    setSelectedMoves(
      defaultSort(
        typeof window !== "undefined" && localStorage.getItem("selectedMoves")
          ? JSON.parse(localStorage.getItem("selectedMoves"))
          : defaults.map((slug) =>
              initialMoveList.find((mv) => mv.slug === slug)
            )
      )
    );
  }, []);

  useEffect(() => {
    setEditMode(
      !(
        typeof window !== "undefined" && !!localStorage.getItem("selectedMoves")
      )
    );
  }, []);

  const availableMoves = useMemo(() => {
    const containsQuery = !searchFilter
      ? initialMoveList
      : initialMoveList.filter(
          (m) => m.name.includes(searchFilter) || m.focus.includes(searchFilter)
        );
    const hasFocus = !focusFilter
      ? initialMoveList
      : initialMoveList.filter((m) => m.focus === focusFilter);
    return defaultSort(intersectionBy(containsQuery, hasFocus, "id"));
  }, [searchFilter, focusFilter]);

  const onToggleDone = (move) =>
    // todo
    {
      move.done = !move.done;
      const updatedMoveList = defaultSort([
        ...selectedMoves.filter((m) => m.id !== move.id),
        move,
      ]);
      setSelectedMoves(updatedMoveList);
      localStorage.setItem("selectedMoves", JSON.stringify(updatedMoveList));
    };

  const onToggleMove = (move) =>
    editMode &&
    setSelectedMoves(defaultSort(xorBy(selectedMoves, [move], "id")));

  const onSelectRandom = () => {
    const randomMoves = sampleSize(allMoves, 20);
    setSelectedMoves(defaultSort(randomMoves));
  };

  const onFinalize = () => {
    localStorage.setItem("selectedMoves", JSON.stringify(selectedMoves));
    setEditMode(false);
  };

  const onEdit = () => {
    localStorage.removeItem("selectedMoves");
    setEditMode(true);
  };

  const onSelectDefault = () =>
    setSelectedMoves(
      defaultSort(
        defaults.map((slug) => initialMoveList.find((mv) => mv.slug === slug))
      )
    );

  const onChange = (e) => {
    setFocusFilter(e.target.value === "any" ? "" : e.target.value);
  };

  const appWrapperCn =
    "relative overflow-hidden bg-primary-900 h-screen border-2 border-gray-600 flex flex-wrap";
  return (
    <div className={appWrapperCn}>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {editMode && (
        <Fragment>
          <div className="contents">
            <AllMoves
              {...{
                searchFilter,
                setSearchFilter,
                selectedMoves,
                setSelectedMoves,
                onChange,
                availableMoves,
                focusFilter,
                setFocusFilter,
                onSearch,
                editMode,
                setEditMode,
                onToggleMove,
                onSelectDefault,
                onSelectRandom,
              }}
            />
            <SelectedMoves
              {...{
                searchFilter,
                setSearchFilter,
                selectedMoves,
                setSelectedMoves,
                onChange,
                availableMoves,
                focusFilter,
                setFocusFilter,
                onSearch,
                editMode,
                setEditMode,
                onSelectDefault,
                onSelectRandom,
                onFinalize,
                onToggleMove,
              }}
            />
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
    </div>
  );
};

export default Home;

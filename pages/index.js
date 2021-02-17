import { cloneDeep, sampleSize, sortBy } from "lodash";
import Head from "next/head";
import { Fragment, useEffect, useMemo, useReducer, useState } from "react";

import AllMoves from "../src/components/allMoves";
import Header from "../src/components/header";
import SelectedMoves from "../src/components/selectedMoves";
import SequenceDisplay from "../src/components/sequenceDisplay";
import { defaults, foci } from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const oneTimeMoveListSort = (listOfMoves) =>
  sortBy(listOfMoves, (item) => foci.indexOf(item.focus), ["name"]);

const initialMoveList = oneTimeMoveListSort(
  process.env.NEXT_PUBLIC_HEAVY === "on"
    ? bloatDataInMemory(moveList)
    : moveList
);

const cleanInitialMoveList = initialMoveList.map((m, idx) => ({
  ...m,
  selected: false,
  idx,
  sets: m.sets || 1,
  setsDone: 0,
  filteredIn: true,
  history: [],
}));

const INITIAL_STATE = {
  moveList: cleanInitialMoveList,
};

// Utils for NextJS pre-rendering
const windowCheck = () => typeof window !== "undefined";
const localStorageCheck = (key) =>
  typeof window !== "undefined" && !!localStorage.getItem(key);

// Utils for persisting data in localStorage
const LOCALSTORAGE_DATA_KEY = "LOCALSTORAGE_DATA_KEY";
const getLocalStorageItem = (key) =>
  windowCheck && JSON.parse(localStorage.getItem(key));
const setLocalStorageItem = (key, data) =>
  windowCheck && localStorage.setItem(key, JSON.stringify(data));
const rmLocalStorageItem = (key) => windowCheck && localStorage.removeItem(key);

const init = (initialState) =>
  localStorageCheck(LOCALSTORAGE_DATA_KEY)
    ? { moveList: getLocalStorageItem(LOCALSTORAGE_DATA_KEY) }
    : cloneDeep(initialState);

const moveReducer = (
  state = INITIAL_STATE,
  action = { type: "", payload: {} }
) => {
  const { type, payload } = action;
  const stateCopy = cloneDeep(state);
  console.log(`type:`, type);
  console.log(`action:`, action);
  switch (type) {
    case "TOGGLE_SINGLE_SELECTED":
      stateCopy.moveList[payload.move.idx].selected = !payload.move.selected;
      stateCopy.moveList[payload.move.idx].setsDone = 0;
      return stateCopy;
    case "SET_MULTIPLE_SELECTED_TRUE":
      payload.listOfIdxs.forEach(
        (idx) => (stateCopy.moveList[idx].selected = true)
      );
      return stateCopy;
    case "SET_ALL_SELECTED":
      stateCopy.moveList.forEach((mv) => (mv.setsDone = 0));
      // todo: remove many maps
      stateCopy.moveList.forEach(
        (mv) =>
          (mv.selected = !!payload.listOfMoves
            .map((m) => m.idx)
            .includes(mv.idx))
      );
      return stateCopy;
    case "SET_ALL_SELECTED_BY_IDX":
      stateCopy.moveList.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveList.forEach(
        (mv) => (mv.selected = !!payload.listOfIdxs.includes(mv.idx))
      );
      return stateCopy;
    case "SET_ALL_SELECTED_BY_SLUGS":
      stateCopy.moveList.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveList.forEach(
        (mv) => (mv.selected = payload.listOfSlugs.includes(mv.slug))
      );
      return stateCopy;
    case "CLEAR_ALL_SELECTED":
      stateCopy.moveList.forEach((mv) => (mv.selected = false));
      stateCopy.moveList.forEach((mv) => (mv.setsDone = 0));
      return stateCopy;
    case "CLEAR_ALL_PROGRESS":
      stateCopy.moveList.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveList.forEach((mv) => (mv.history = []));
      return stateCopy;
    case "ADD_SINGLE_SETS_DONE":
      const currentSetsDone = stateCopy.moveList[payload.move.idx].setsDone;
      const sets = stateCopy.moveList[payload.move.idx].sets;
      stateCopy.moveList[payload.move.idx].setsDone =
        currentSetsDone === sets ? 0 : (currentSetsDone % sets) + 1;
      return stateCopy;
    case "SET_MULTIPLE_HISTORY":
      // just need move idxs
      payload.listOfIdxs.forEach((_idx) => {
        const move = stateCopy.moveList[_idx];
        const done = move.setsDone >= move.sets;
        if (done) {
          const previousHistory = cloneDeep(move.history || []);
          const today = new Date().toLocaleDateString();
          const newHistory = { date: today };
          stateCopy.moveList[_idx].history = [...previousHistory, newHistory];
        }
      });
      // console.log(`stateCopy:`, stateCopy);
      return stateCopy;
    case "SET_ALL_FILTERED_IN":
      const hasSearchFilter = !!payload.searchFilter;
      const hasFocusFilter =
        payload.focusFilter && payload.focusFilter !== "any";
      stateCopy.moveList.forEach((mv) => (mv.filteredIn = true));
      if (hasFocusFilter) {
        stateCopy.moveList.forEach(
          (mv) => (mv.filteredIn = mv.focus === payload.focusFilter)
        );
      }
      if (hasSearchFilter) {
        stateCopy.moveList.forEach(
          (mv) =>
            (mv.filteredIn =
              (mv.filteredIn &&
                mv.name
                  .toLowerCase()
                  .includes(payload.searchFilter.toLowerCase())) ||
              mv.focus
                .toLowerCase()
                .includes(payload.searchFilter.toLowerCase()))
        );
      }
      return stateCopy;
    case "RESET":
      return init(action.payload);
    default:
      return INITIAL_STATE;
  }
};

const Home = ({ content }) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  const [editMode, setEditMode] = useState(true);

  const [state, dispatch] = useReducer(moveReducer, INITIAL_STATE, init);

  // =============== handle move list filters (TODO: Codesplit)

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  const onChange = (e) => {
    setFocusFilter(e.target.value === "any" ? "" : e.target.value);
  };

  const selectedMoves = useMemo(
    () => state.moveList.filter((mv) => !!mv.selected),
    [state.moveList]
  );

  useEffect(() => {
    dispatch({
      type: "SET_ALL_FILTERED_IN",
      payload: { searchFilter, focusFilter },
    });
  }, [searchFilter, focusFilter]);

  // =============== control localStorage data (TODO: Codesplit)

  useEffect(() => {
    if (editMode) {
      rmLocalStorageItem(LOCALSTORAGE_DATA_KEY);
    } else {
      setLocalStorageItem(LOCALSTORAGE_DATA_KEY, state.moveList);
    }
  }, [editMode]);

  // =============== action creators (TODO: Codesplit)

  const onSave = () => {
    dispatch({
      type: "SET_MULTIPLE_HISTORY",
      payload: {
        listOfIdxs: state.moveList
          .filter((mv) => mv.sets && mv.setsDone === mv.sets)
          .map((mv) => mv.idx),
      },
    });
  };

  const onDoneSet = (move) => {
    dispatch({
      type: "ADD_SINGLE_SETS_DONE",
      payload: { move },
    });
  };

  const onToggleDone = (move) => {
    onDoneSet(move);
  };

  const onToggleMove = (move) => {
    editMode && dispatch({ type: "TOGGLE_SINGLE_SELECTED", payload: { move } });
  };

  const onSelectRandom = () => {
    dispatch({
      type: "SET_ALL_SELECTED",
      payload: {
        listOfMoves: sampleSize(state.moveList, 20),
      },
    });
  };

  const onClearSelected = () => {
    dispatch("RESET", { payload: { moveList: cleanInitialMoveList } });
  };

  const onSelectDefault = () => {
    dispatch({
      type: "SET_ALL_SELECTED_BY_SLUGS",
      payload: { listOfSlugs: defaults },
    });
  };

  const onClearProgress = () => {
    dispatch({ type: "CLEAR_ALL_PROGRESS" });
  };

  // =============== control current view

  const onFinalize = () => {
    setEditMode(false);
  };

  const onEdit = () => {
    setEditMode(true);
  };

  // =============== class names

  const appWrapperCn =
    "relative overflow-hidden bg-primary-900 h-screen border-2 border-gray-600 flex flex-wrap";

  return (
    <div className={appWrapperCn}>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {(editMode || editMode === null) && (
        <Fragment>
          <div className="contents">
            <AllMoves
              {...{
                allMoves: state.moveList,
                focusFilter,
                onChange,
                onSearch,
                onSelectDefault,
                onSelectRandom,
                onToggleMove,
                searchFilter,
                setFocusFilter,
                setSearchFilter,
              }}
            />
            <SelectedMoves
              {...{
                onClearSelected,
                onFinalize,
                onToggleMove,
                selectedMoves,
              }}
            />
          </div>
        </Fragment>
      )}
      {!editMode && (
        <SequenceDisplay
          {...{
            moveList: state.moveList,
            selectedMoves,
            onToggleDone,
            onEdit,
            onSave,
            onReset: onClearProgress,
          }}
        />
      )}
    </div>
  );
};

export default Home;

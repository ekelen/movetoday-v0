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
  cloneDeep,
} from "lodash";
import Head from "next/head";
import {
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import AllMoves from "../src/components/allMoves";

import Header from "../src/components/header";
import Move from "../src/components/move";
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
}));

const INITIAL_STATE = {
  moveList: cleanInitialMoveList,
};

const LOCALSTORAGE_DATA_KEY = "LOCALSTORAGE_DATA_KEY";

const getLocalStorageItem = (key) => JSON.parse(localStorage.getItem(key));
const setLocalStorageItem = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));
const localStorageCheck = (key) =>
  typeof window !== "undefined" && !!localStorage.getItem(key);

const init = (initialState) =>
  localStorageCheck(LOCALSTORAGE_DATA_KEY)
    ? {
        moveList: getLocalStorageItem(LOCALSTORAGE_DATA_KEY),
      }
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
    case "ADD_SINGLE_SETS_DONE":
      const currentSetsDone = stateCopy.moveList[payload.move.idx].setsDone;
      const sets = stateCopy.moveList[payload.move.idx].sets;
      stateCopy.moveList[payload.move.idx].setsDone =
        currentSetsDone === sets ? 0 : (currentSetsDone % sets) + 1;
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

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
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

  useEffect(() => {
    if (editMode) {
      localStorage.removeItem(LOCALSTORAGE_DATA_KEY);
    } else {
      setLocalStorageItem(LOCALSTORAGE_DATA_KEY, state.moveList);
    }
  }, [editMode]);

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

  const onFinalize = () => {
    setEditMode(false);
  };

  const onEdit = () => {
    setEditMode(true);
  };

  const onSelectDefault = () => {
    dispatch({
      type: "SET_ALL_SELECTED_BY_SLUGS",
      payload: { listOfSlugs: defaults },
    });
  };

  const onChange = (e) => {
    setFocusFilter(e.target.value === "any" ? "" : e.target.value);
  };

  const onClearSelected = () => {
    dispatch("RESET", { payload: { moveList: cleanInitialMoveList } });
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
      {(editMode || editMode === null) && (
        <Fragment>
          <div className="contents">
            <AllMoves
              {...{
                searchFilter,
                setSearchFilter,
                onChange,
                focusFilter,
                setFocusFilter,
                onSearch,
                editMode,
                setEditMode,
                onToggleMove,
                onSelectDefault,
                onSelectRandom,
                allMoves: state.moveList,
              }}
            />
            <SelectedMoves
              {...{
                selectedMoves,
                onClearSelected,
                onFinalize,
                onToggleMove,
              }}
            />
          </div>
        </Fragment>
      )}
      {editMode === false && (
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

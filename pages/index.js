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
import { Fragment, useEffect, useMemo, useReducer, useState } from "react";
import AllMoves from "../src/components/allMoves";

import Header from "../src/components/header";
import Move from "../src/components/move";
import SelectedMoves from "../src/components/selectedMoves";
import SequenceDisplay from "../src/components/sequenceDisplay";
import { defaults, foci } from "../src/data/meta.json";
import moveList from "../src/data/moveList.json";
import { bloatDataInMemory } from "../src/util/test.js";

const defaultSortR = (arr) =>
  sortBy(arr, (item) => foci.indexOf(item.focus), ["name"]);

const initialMoveListR = defaultSortR(
  process.env.NEXT_PUBLIC_HEAVY === "on"
    ? bloatDataInMemory(moveList)
    : moveList
);

const formattedInitialMoveListR = initialMoveListR.map((m, idx) => ({
  ...m,
  selected: false,
  // filteredOut: false,
  idx,
  sets: m.sets || 1,
  setsDone: 0,
  filteredIn: true,
}));

const INITIAL_STATE = {
  moveListR: formattedInitialMoveListR,
};

const moveReducer = (
  state = INITIAL_STATE,
  action = { type: "", payload: {} }
) => {
  console.log(`[state, action]:`, [state, action]);
  const { type, payload } = action;
  const stateCopy = cloneDeep(state);
  console.log(`type:`, type);
  console.log(`action:`, action);
  switch (type) {
    case "TOGGLE_SINGLE_SELECTED":
      stateCopy.moveListR[payload.move.idx].selected = !payload.move.selected;
      stateCopy.moveListR[payload.move.idx].setsDone = 0;
      return stateCopy;
    case "SET_MULTIPLE_SELECTED_TRUE":
      payload.listOfIdxs.forEach(
        (idx) => (stateCopy.moveListR[idx].selected = true)
      );
      return stateCopy;
    case "SET_ALL_SELECTED":
      stateCopy.moveListR.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveListR.forEach(
        (mv) =>
          (mv.selected = !!payload.listOfMoves
            .map((m) => m.idx)
            .includes(mv.idx))
      );
      return stateCopy;
    case "SET_ALL_SELECTED_BY_IDX":
      stateCopy.moveListR.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveListR.forEach(
        (mv) => (mv.selected = !!payload.listOfIdxs.includes(mv.idx))
      );
      return stateCopy;
    case "SET_ALL_SELECTED_BY_SLUGS":
      stateCopy.moveListR.forEach((mv) => (mv.setsDone = 0));
      stateCopy.moveListR.forEach(
        (mv) => (mv.selected = payload.listOfSlugs.includes(mv.slug))
      );
      return stateCopy;
    case "CLEAR_ALL_SELECTED":
      stateCopy.moveListR.forEach((mv) => (mv.selected = false));
      stateCopy.moveListR.forEach((mv) => (mv.setsDone = 0));
      return stateCopy;
    case "ADD_SINGLE_SETS_DONE":
      const currentSetsDone = stateCopy.moveListR[payload.move.idx].setsDone;
      const sets = stateCopy.moveListR[payload.move.idx].sets;
      stateCopy.moveListR[payload.move.idx].setsDone =
        currentSetsDone === sets ? 0 : (currentSetsDone % sets) + 1;
      return stateCopy;
    case "SET_ALL_FILTERED_IN":
      const hasSearchFilter = !!payload.searchFilter;
      const hasFocusFilter =
        payload.focusFilter && payload.focusFilter !== "any";
      stateCopy.moveListR.forEach((mv) => (mv.filteredIn = true));
      if (hasFocusFilter) {
        stateCopy.moveListR.forEach(
          (mv) => (mv.filteredIn = mv.focus === payload.focusFilter)
        );
      }
      if (hasSearchFilter) {
        stateCopy.moveListR.forEach(
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
    default:
      return INITIAL_STATE;
  }
};

const Home = ({ content }) => {
  // TODO: Replace [allMoves, selectedMoves, availableMoves] by one move list, preserving indices, adding 'selected' and 'available' prop
  //    so we don't have to sort every time we update lists of moves
  // const defaultSort = (arr) =>
  //   sortBy(arr, (item) => foci.indexOf(item.focus), ["name"]);

  // const [initialMoveList] = useState(
  //   process.env.NEXT_PUBLIC_HEAVY === "on"
  //     ? bloatDataInMemory(moveList)
  //     : moveList
  // );
  const [searchFilter, setSearchFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");
  // const [selectedMoves, setSelectedMoves] = useState([]);
  // const [allMoves, setAllMoves] = useState(initialMoveList);
  const [editMode, setEditMode] = useState(true);

  const [state, dispatch] = useReducer(moveReducer, INITIAL_STATE);

  const onSearch = (e) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    dispatch({
      type: "SET_ALL_FILTERED_IN",
      payload: { searchFilter, focusFilter },
    });
  }, [searchFilter, focusFilter]);

  // useEffect(() => {
  //   setSelectedMoves(
  //     defaultSort(
  //       typeof window !== "undefined" && localStorage.getItem("selectedMoves")
  //         ? JSON.parse(localStorage.getItem("selectedMoves"))
  //         : []
  //       // : defaults.map((slug) =>
  //       //     initialMoveList.find((mv) => mv.slug === slug)
  //       // )
  //     )
  //   );
  // }, []);

  // useEffect(() => {
  //   setEditMode(
  //     !(
  //       typeof window !== "undefined" && !!localStorage.getItem("selectedMoves")
  //     )
  //   );
  // }, []);

  // const availableMoves = useMemo(() => {
  //   const containsQuery = !searchFilter
  //     ? initialMoveList
  //     : initialMoveList.filter(
  //         (m) => m.name.includes(searchFilter) || m.focus.includes(searchFilter)
  //       );
  //   const hasFocus = !focusFilter
  //     ? initialMoveList
  //     : initialMoveList.filter((m) => m.focus === focusFilter);
  //   return defaultSort(intersectionBy(containsQuery, hasFocus, "id"));
  // }, [searchFilter, focusFilter]);

  const onDoneSet = (move) => {
    dispatch({
      type: "ADD_SINGLE_SETS_DONE",
      payload: { move },
    });
  };

  const onToggleDone = (move) =>
    // todo
    {
      onDoneSet(move);
      // move.done = !move.done;
      // const updatedMoveList = defaultSort([
      //   ...selectedMoves.filter((m) => m.id !== move.id),
      //   move,
      // ]);
      // setSelectedMoves(updatedMoveList);
      // localStorage.setItem("selectedMoves", JSON.stringify(updatedMoveList));
    };

  const onToggleMove = (move) => {
    editMode && dispatch({ type: "TOGGLE_SINGLE_SELECTED", payload: { move } });
    // editMode &&
    //   setSelectedMoves(defaultSort(xorBy(selectedMoves, [move], "id")));
  };

  const onSelectRandom = () => {
    // const randomMoves = sampleSize(allMoves, 20);
    // setSelectedMoves(defaultSort(randomMoves));
    dispatch({
      type: "SET_ALL_SELECTED_BY_IDX",
      payload: {
        listOfIdxs: sampleSize(state.moveListR, 20).map((mv) => mv.idx),
      },
    });
  };

  const onFinalize = () => {
    // localStorage.setItem("selectedMoves", JSON.stringify(selectedMoves));
    // localStorage.setItem(
    //   "selectedMovesR",
    //   JSON.stringify(state.moveListR.filter((mv) => mv.selected))
    // );
    setEditMode(false);
  };

  const onEdit = () => {
    // localStorage.removeItem("selectedMoves");
    setEditMode(true);
  };

  const onSelectDefault = () => {
    dispatch({
      type: "SET_ALL_SELECTED_BY_SLUGS",
      payload: { listOfSlugs: defaults },
    });
    // setSelectedMoves(
    //   defaultSort(
    //     defaults.map((slug) => initialMoveList.find((mv) => mv.slug === slug))
    //   )
    // );
  };

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
            {/* <div className="flex flex-wrap space-x-1 space-y-1 text-primary-300 h-1/5 overflow-y-scroll">
              {state.moveListR.map((mv) => {
                return (
                  <div key={`${mv.name}-${mv.idx}`} className="text-white">
                    <p>{mv.idx}</p>
                    <p>{mv.name}</p>
                    <p>{mv.selected ? "S" : "NS"}</p>
                    <p className={mv.filteredIn ? "opacity-100" : "opacity-50"}>
                      Filtered
                    </p>
                    <p className="bg-blue-300">{`${mv.setsDone} / ${mv.sets}`}</p>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "ADD_SINGLE_SETS_DONE",
                          payload: { move: mv },
                        })
                      }
                    >
                      add set
                    </button>
                  </div>
                );
              })}
              <button className="bg-blue-600" onClick={onSelectDefault}>
                Defaults
              </button>
              <button
                className="bg-blue-600"
                onClick={() => dispatch({ type: "CLEAR_ALL_SELECTED" })}
              >
                clear
              </button>
            </div> */}
            <AllMoves
              {...{
                searchFilter,
                setSearchFilter,
                onChange,
                availableMoves: state.moveListR.filter((mv) => !!mv.filteredIn),
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
                selectedMoves: state.moveListR.filter((mv) => !!mv.selected),
                setSelectedMoves: (listOfMoves) =>
                  dispatch({
                    type: "SET_ALL_SELECTED_BY_IDX",
                    payload: { listOfIdxs: listOfMoves.map((mv) => mv.idx) },
                  }),
                onChange,
                // availableMoves,
                // focusFilter,
                // setFocusFilter,
                // onSearch,
                // editMode,
                // setEditMode,
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
          selectedMoves={state.moveListR.filter((mv) => !!mv.selected)}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default Home;

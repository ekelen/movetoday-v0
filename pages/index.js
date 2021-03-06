import { sampleSize } from "lodash";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { GitHub } from "react-feather";
// import { connectToCollection } from "../mongo";
import AllMoves from "../src/components/allMoves";
import Header from "../src/components/header";
import Move from "../src/components/move";
import SelectedMoves from "../src/components/selectedMoves";
import SequenceDisplay from "../src/components/sequenceDisplay";
import SequenceHeader from "../src/components/sequenceHeader";
import SequenceMove from "../src/components/sequenceMove";
import { defaults } from "../src/data/meta.json";
import { getLsSafe, setLsSafe } from "../src/util/util";
import {
  INITIAL_STATE,
  moveReducer,
  replaceAllSelected,
  setInitialData,
  setOneProgress,
  toggleOneSelected,
  useMoveListThunkReducer,
} from "../state/reducer";

const LS_PAGE = "LS_MOVETODAY_PAGE";
const EDIT = "EDIT";
const SEQUENCE = "SEQUENCE";

const Home = ({ ...props }) => {
  const [page, setPage] = useState(null);
  const [state, dispatch] = useMoveListThunkReducer(moveReducer, INITIAL_STATE);

  useEffect(() => {
    dispatch(setInitialData);
    if (page === null) setPage(getLsSafe(LS_PAGE) || EDIT);
  }, []);

  useEffect(() => {
    if (page) setLsSafe(LS_PAGE, page);
  }, [page]);

  const selectedMoves = useMemo(() => {
    const { moveListStatic } = state;
    const selected = moveListStatic.filter((m) =>
      Object.keys(state.movesProgress).includes(m.slug)
    );
    return selected;
  }, [state.moveListStatic, state.movesProgress]);

  const onSetOneSelected = useCallback(
    (move, toSelect) => {
      dispatch(toggleOneSelected(move, toSelect));
    },
    [dispatch]
  );

  // =============== action creators (TODO: Codesplit)

  const onSetOneProgress = useCallback(
    (slug, setsDone) => {
      dispatch(setOneProgress(slug, setsDone));
    },
    [dispatch]
  );

  const onSelectRandom = useCallback(() => {
    dispatch(
      replaceAllSelected(
        sampleSize(
          state.moveListStatic.map((m) => m.slug),
          20
        )
      )
    );
  }, [state.moveListStatic, dispatch]);

  const onClearSelected = useCallback(() => {
    dispatch(replaceAllSelected([]));
  }, [dispatch]);

  const onSelectDefault = useCallback(() => {
    dispatch(replaceAllSelected([...defaults]));
  }, [dispatch]);

  // =============== control current page

  const onFinalize = () => {
    setPage(SEQUENCE);
  };

  const onEdit = () => {
    setPage(EDIT);
  };

  // =============== class names

  const appWrapperCn =
    "relative overflow-hidden bg-primary-900 h-screen border-2 border-gray-600 flex flex-wrap";
  const navCnActive =
    "bg-primaryAction-500 w-min py-1 px-2 rounded-sm mr-2 cursor-default focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-primary-300 active:ring-4 active:ring-offset-1 active:ring-primary-300";
  const navCnUnselected =
    "bg-primary-400 w-min py-1 px-2 rounded-sm mr-2 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-400";

  return (
    <div className={appWrapperCn}>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header>
        <div className="w-full flex items-center p-2 text-md ">
          <nav className="whitespace-nowrap uppercase text-primary-800 font-bold">
            <button
              onClick={() => setPage(EDIT)}
              disabled={page === EDIT}
              className={page === EDIT ? navCnActive : navCnUnselected}
            >
              EDIT
            </button>
            <button
              onClick={() => setPage(SEQUENCE)}
              disabled={page === SEQUENCE}
              className={page === SEQUENCE ? navCnActive : navCnUnselected}
            >
              SEQUENCE
            </button>
          </nav>

          {state.errorMessage && <p>{state.errorMessage}</p>}
          {state.loading && <p>Loading...</p>}
          <div className="ml-auto flex items-center text-secondaryAction-800 text-sm font-bold ">
            <GitHub size={16} />
            <p className="ml-2 ">
              <a href="https://github.com/ekelen">ekelen</a>
            </p>
          </div>
        </div>
      </Header>
      {page === EDIT && (
        <Fragment>
          <div className="contents">
            <div className="relative overflow-hidden mx-5 my-2 p-3 rounded border-primary-400 border-2">
              <AllMoves
                onSelectDefault={onSelectDefault}
                onSelectRandom={onSelectRandom}
                movesProgress={state.movesProgress}
                moveListStatic={state.moveListStatic}
                onSetOneSelected={onSetOneSelected}
              ></AllMoves>
            </div>
            <SelectedMoves
              onClearSelected={onClearSelected}
              onFinalize={onFinalize}
              toggleOneSelected={onSetOneSelected}
              nSelectedMoves={selectedMoves.length}
              selectedMovesDisplay={selectedMoves.map((m) => (
                <Move
                  key={`${m.name}-${m.idx}`}
                  onClick={onSetOneSelected}
                  move={m}
                  selected={true}
                />
              ))}
            />
          </div>
        </Fragment>
      )}
      {page === SEQUENCE && (
        <Fragment>
          {state.moveListStatic.length > 0 ? (
            <SequenceDisplay
              sequenceHeader={
                <SequenceHeader
                  onEdit={onEdit}
                  zeroAllProgress={() =>
                    Object.keys(state.movesProgress).forEach((slug) =>
                      onSetOneProgress(slug, 0)
                    )
                  }
                  movesProgress={state.movesProgress}
                  moveListStatic={state.moveListStatic}
                  selectedMoves={selectedMoves}
                />
              }
              sequenceMoves={selectedMoves.map((move) => {
                return (
                  <SequenceMove
                    key={`${move.name}-${move.idx}`}
                    move={move}
                    setsDone={state.movesProgress[move.slug]}
                    toggleOneSelected={onSetOneSelected}
                    setOneProgress={onSetOneProgress}
                  />
                );
              })}
            ></SequenceDisplay>
          ) : (
            "No moves in state yet..."
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Home;

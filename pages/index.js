import { sampleSize } from "lodash";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import AllMoves from "../src/components/allMoves";
import Header from "../src/components/header";
import Move from "../src/components/move";
import SelectedMoves from "../src/components/selectedMoves";
import SequenceHeader from "../src/components/sequenceHeader";
import SequenceMove from "../src/components/sequenceMove";
import { defaults, pages } from "../src/data/meta.json";
import Nav from "../src/components/navigation";
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

const { EDIT, SEQUENCE } = pages;

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

  const wrapper = {
    app: "bg-primary-900 flex flex-col h-screen overflow-x-hidden",
    header: "bg-black flex-none h-20 overflow-y-hidden p-2 w-full",
    all:
      "border-2 border-primary-400 flex-none mt-6 mx-5 mb-4 overflow-hidden px-1 py-2 relative rounded",
    sequence:
      "content-start flex flex-wrap overflow-y-auto mt-0 p-5 pt-6 space-y-4 text-primary-300 w-full scrollbar scrollbar-thumb-primary-600 scrollbar-track-primary-800",
    selected:
      "border-2 border-primary-400 flex-grow mb-4 mx-5 min-h-1/4 px-2 py-1 rounded",
  };

  return (
    <Fragment>
      <Head>
        <title>Move Today</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={wrapper.app}>
        <header className={wrapper.header}>
          <Header>
            <Nav page={page} setPage={setPage} />
            {state.errorMessage && <p>{state.errorMessage}</p>}
            {state.loading && <p>Loading...</p>}
          </Header>
        </header>
        <Fragment>
          {page === EDIT && (
            <Fragment>
              <div className={wrapper.all}>
                <AllMoves
                  onSelectDefault={onSelectDefault}
                  onSelectRandom={onSelectRandom}
                  movesProgress={state.movesProgress}
                  moveListStatic={state.moveListStatic}
                  onSetOneSelected={onSetOneSelected}
                ></AllMoves>
              </div>
              <div className={wrapper.selected}>
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
            <div className={wrapper.sequence}>
              {state.moveListStatic.length > 0 ? (
                <div className="contents">
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

                  {selectedMoves.map((m) => {
                    return (
                      <SequenceMove
                        key={`${m.name}-${m.idx}`}
                        move={m}
                        setsDone={state.movesProgress[m.slug]}
                        toggleOneSelected={onSetOneSelected}
                        setOneProgress={onSetOneProgress}
                      />
                    );
                  })}
                </div>
              ) : (
                "No moves in state yet..."
              )}
            </div>
          )}
        </Fragment>
      </div>
    </Fragment>
  );
};

export default Home;

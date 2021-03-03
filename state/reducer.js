import { cloneDeep, fromPairs, isFunction, mapValues, omit } from "lodash";
import { useCallback, useEffect, useReducer, useState } from "react";
import { getLsNumeric, getLsObj, setLsObj, setLsSafe } from "../src/util/util";
import {
  RECEIVED_SERVER_RESPONSE,
  REMOVE_ONE_PROGRESS,
  REPLACE_ALL_PROGRESS,
  SENT_SERVER_REQUEST,
  SET_ALL_PROGRESS,
  SET_ALL_STATIC,
  SET_ONE_PROGRESS,
  ZERO_ALL_CURRENT_IN_PROGRESS,
  ZERO_ONE_PROGRESS,
} from "./actionTypes";

export const INITIAL_STATE = {
  moveListStatic: [],
  movesProgress: {},
  fetchError: null,
  loading: false,
  errorMessage: "",
};

export const LS_STATIC = "LS_STATIC";
export const LS_PROGRESS = "LS_PROGRESS";
export const LS_EXPIRY = "LS_EXPIRY";

export const moveReducer = (state, action = { type: "", payload: {} }) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_STATIC: {
      const { moveListStatic } = payload;
      return { ...state, moveListStatic: cloneDeep(moveListStatic) };
    }
    case SENT_SERVER_REQUEST: {
      return { ...state, loading: true };
    }
    case RECEIVED_SERVER_RESPONSE: {
      const { errorMessage = "", moveListStatic = null } = payload;
      return { ...state, loading: false, moveListStatic, errorMessage };
    }
    case ZERO_ONE_PROGRESS:
    case SET_ONE_PROGRESS: {
      const { slug, setsDone = 0 } = payload;
      const { movesProgress } = state;
      return {
        ...state,
        movesProgress: { ...movesProgress, [slug]: setsDone },
      };
    }
    case SET_ALL_PROGRESS: {
      const { movesProgress } = payload;
      return { ...state, movesProgress: { ...movesProgress } };
    }

    case REMOVE_ONE_PROGRESS: {
      const { slug } = payload;
      const { movesProgress } = state;
      return { ...state, movesProgress: omit(movesProgress, slug) };
    }

    case ZERO_ALL_CURRENT_IN_PROGRESS: {
      const { movesProgress } = state;
      return { ...state, movesProgress: mapValues(movesProgress, () => 0) };
    }

    case REPLACE_ALL_PROGRESS: {
      const { selectedSlugs } = payload;
      return {
        ...state,
        movesProgress: fromPairs(selectedSlugs.map((slug) => [slug, 0])),
      };
    }
    default:
      return state;
  }
};

export const useMoveListThunkReducer = (reducer, initialData) => {
  const [state, dispatch] = useReducer(reducer, initialData);
  const [hasCheckedLsProgress, setHasCheckedLsProgress] = useState(false);

  const enhancedMoveListDispatch = useCallback(
    (action) => {
      console.log("action", action);

      if (isFunction(action)) {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    // Get sequence progress from localStorage if it exists (no validation)
    if (!hasCheckedLsProgress && getLsObj(LS_PROGRESS) !== null)
      enhancedMoveListDispatch({
        type: SET_ALL_PROGRESS,
        payload: {
          movesProgress: getLsObj(LS_PROGRESS),
        },
      });
    setHasCheckedLsProgress(true);
  }, []);

  useEffect(() => {
    // Update localstorage whenever progress is updated
    hasCheckedLsProgress &&
      state.movesProgress &&
      setLsObj(LS_PROGRESS, state.movesProgress);
  }, [hasCheckedLsProgress, state.movesProgress]);

  return [state, enhancedMoveListDispatch];
};

const getMovelistStaticFromAPI = (dispatch) => {
  console.log(`Getting movelist from server`);
  dispatch({ type: SENT_SERVER_REQUEST });
  fetch("/api/move")
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((json) => {
      const { moveList: moveListStatic } = json;
      setLsObj(LS_STATIC, { moveListStatic });
      setLsSafe(LS_EXPIRY, new Date().getTime() + 1000 * 60);
      dispatch({ type: RECEIVED_SERVER_RESPONSE, payload: { moveListStatic } });
    })
    .catch((error) => {
      const { status, statusText } = error;
      if (error instanceof Error || !error.json) {
        dispatch({
          type: RECEIVED_SERVER_RESPONSE,
          payload: { errorMessage: "500 Unknown Error" },
        });
      } else {
        error.json().then((responseJson) =>
          dispatch({
            type: RECEIVED_SERVER_RESPONSE,
            payload: {
              errorMessage: `${status} ${statusText} ${
                responseJson.msg && " :: ".concat(responseJson.msg)
              }`,
            },
          })
        );
      }
    });
};

export const setInitialData = (dispatch) => {
  const { moveListStatic = null } = getLsObj(LS_STATIC) || {};
  const expiredLocalStorage = getLsNumeric(LS_EXPIRY) < new Date().getTime();
  if (moveListStatic && !expiredLocalStorage) {
    console.log(`Getting movelist from localStorage`);
    dispatch({ type: SET_ALL_STATIC, payload: { moveListStatic } });
  } else {
    return getMovelistStaticFromAPI(dispatch);
  }
};

export const removeOneSelected = (move) => (dispatch) => {
  dispatch({ type: REMOVE_ONE_PROGRESS, payload: { slug: move.slug } });
};

export const addOneSelected = (move) => (dispatch) => {
  dispatch({ type: ZERO_ONE_PROGRESS, payload: { slug: move.slug } });
};

export const setOneProgress = (slug, setsDone = 0) => (dispatch) => {
  console.log(`set ${slug} to ${setsDone}`);
  dispatch({ type: SET_ONE_PROGRESS, payload: { slug, setsDone } });
};

export const replaceAllSelected = (selectedSlugs = []) => (dispatch) => {
  dispatch({ type: REPLACE_ALL_PROGRESS, payload: { selectedSlugs } });
};

export const toggleOneSelected = (move, toSelect) => (dispatch) => {
  return toSelect
    ? addOneSelected(move)(dispatch)
    : removeOneSelected(move)(dispatch);
};

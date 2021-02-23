import {
  cloneDeep,
  isFunction,
  omit,
  mapValues,
  toInteger,
  fromPairs,
} from "lodash";
import {
  REMOVE_ONE_PROGRESS,
  REPLACE_ALL_PROGRESS,
  SET_ALL_PROGRESS,
  SET_ALL_STATIC,
  SET_FETCH_ERROR,
  SET_FETCH_ERROR_FALSE,
  SET_LOADING,
  SET_ONE_PROGRESS,
  ZERO_ALL_CURRENT_IN_PROGRESS,
  ZERO_ONE_PROGRESS,
} from "./actionTypes";
import { useCallback, useEffect, useReducer, useState } from "react";
import { safeJsonParse, safeJsonStringify } from "../src/util/util";

export const INITIAL_STATE = {
  moveListStatic: [],
  movesProgress: {},
  fetchError: { isError: false },
  loading: false,
};

export const LS_STATIC = "LS_STATIC";
export const LS_PROGRESS = "LS_PROGRESS";

export const moveReducer = (state, action = { type: "", payload: {} }) => {
  const { type, payload } = action;
  switch (type) {
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

    case SET_ALL_STATIC: {
      const { moveListStatic } = payload;
      return { ...state, moveListStatic: cloneDeep(moveListStatic) };
    }

    case SET_LOADING: {
      const { loading = true } = payload;
      return { ...state, loading };
    }
    case SET_FETCH_ERROR: {
      const { isError = true, status = 500, statusText = "", msg } =
        payload || {};
      const fetchError = isError
        ? { isError, status, statusText, msg }
        : { isError };
      return { ...state, fetchError };
    }
    case SET_FETCH_ERROR_FALSE: {
      return { ...state, fetchError: { isError: false } };
    }
    default:
      return state;
  }
};

const windowCheck = () => typeof window !== "undefined";

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
    if (!hasCheckedLsProgress && localStorage.getItem(LS_PROGRESS) !== null)
      enhancedMoveListDispatch({
        type: SET_ALL_PROGRESS,
        payload: {
          movesProgress: JSON.parse(localStorage.getItem(LS_PROGRESS)),
        },
      });
    setHasCheckedLsProgress(true);
  }, []);

  useEffect(() => {
    hasCheckedLsProgress &&
      state.movesProgress &&
      localStorage.setItem(LS_PROGRESS, safeJsonStringify(state.movesProgress));
  }, [hasCheckedLsProgress, state.movesProgress]);

  return [state, enhancedMoveListDispatch];
};

const getMovelistStaticFromAPI = (dispatch) => {
  dispatch({ type: SET_LOADING, payload: { loading: true } });
  fetch("/api/move")
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((json) => {
      const { moveList: moveListStatic } = json;

      windowCheck() &&
        localStorage.setItem(LS_STATIC, JSON.stringify({ moveListStatic }));
      dispatch({ type: SET_ALL_STATIC, payload: { moveListStatic } });
      dispatch({ type: SET_FETCH_SUCCESS });
    })
    .catch((error) => {
      if (error instanceof Error || !error.json) {
        dispatch({
          type: SET_FETCH_ERROR,
        });
        return;
      } else {
        return error.json().then((responseJson) => {
          dispatch({
            type: SET_FETCH_ERROR,
            payload: {
              statusText: error.statusText,
              status: error.status,
              isError: true,
              message: responseJson.msg,
            },
          });
        });
      }
    })
    .finally(() => {
      dispatch({ type: SET_LOADING, payload: { loading: false } });
    });
};

export const setInitialData = (dispatch) => {
  if (
    !windowCheck() ||
    (windowCheck() && localStorage.getItem(LS_STATIC) === null)
  ) {
    getMovelistStaticFromAPI(dispatch);
  } else if (windowCheck() && localStorage.getItem(LS_STATIC)) {
    const { moveListStatic = [] } = JSON.parse(localStorage.getItem(LS_STATIC));
    dispatch({ type: SET_ALL_STATIC, payload: { moveListStatic } });
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

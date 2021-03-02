import { toNumber, isPlainObject, isNull, isNumber, isArray } from "lodash";

// Return only plain object or null
export const safeJsonParse = (dataString = null) => {
  try {
    const data = JSON.parse(dataString || null);
    return isPlainObject(data) || isNull(data) ? data : null;
  } catch (error) {
    return null;
  }
};

// Return null for all inputs except serialized valid plain object
export const safeJsonStringify = (dataObj) => {
  if (!dataObj || !isPlainObject(dataObj)) return null;
  try {
    return JSON.stringify(dataObj, 2, null);
  } catch (error) {
    return null;
  }
};

const setLs = (transformer = null) => (key, data) => {
  const windowCheck = typeof window !== "undefined";
  if (!windowCheck) {
    console.warn(`window object not available`);
  } else {
    try {
      localStorage.setItem(key, !transformer ? data : transformer(data));
    } catch (error) {
      console.warn(`Could not set ${key}: ${error.message}`);
    }
  }
};

export const setLsObj = setLs(safeJsonStringify);
export const setLsSafe = setLs();

const getLs = (key) => {
  const windowCheck = typeof window !== "undefined";
  return windowCheck ? localStorage.getItem(key) : null;
};

const getLsItemWithParser = (parser) => (key) => {
  return parser(getLs(key));
};

export const getLsSafe = getLs;
export const getLsObj = getLsItemWithParser(safeJsonParse);
export const getLsNumeric = getLsItemWithParser(toNumber);

const getDaysDiff = (toDate) =>
  Math.ceil(
    (new Date(new Date().toLocaleDateString()).getTime() -
      new Date(toDate).getTime()) /
      86400000
  );

const formatter = (timeDiff) =>
  timeDiff === 0 ? "today" : `${timeDiff} ${timeDiff > 1 ? "days" : "day"} ago`;

export const daysAgo = (toDate) => formatter(getDaysDiff(toDate));

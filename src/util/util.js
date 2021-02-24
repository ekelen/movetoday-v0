export const safeJsonParse = (dataString, fallback = {}) => {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    return fallback;
  }
};

export const safeJsonStringify = (dataObj, fallback = "") => {
  try {
    return JSON.stringify(dataObj, 2, null);
  } catch (error) {
    return fallback;
  }
};

const getDaysDiff = (toDate) =>
  Math.ceil(
    (new Date(new Date().toLocaleDateString()).getTime() -
      new Date(toDate).getTime()) /
      86400000
  );

const formatter = (timeDiff) =>
  timeDiff === 0 ? "today" : `${timeDiff} days ago`;

export const daysAgo = (toDate) => formatter(getDaysDiff(toDate));

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

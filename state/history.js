import { useCallback, useState } from "react";
import { isArray } from "lodash";

export const useFetchForHistory = (apiKey, slugs) => {
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateHistory = useCallback(() => {
    console.log(`calling updateHistory with key ${apiKey}`);
    setSuccess(null);
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${btoa(apiKey)}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    const fetchForSlug = (s) => {
      return fetch(`/api/move/${s}`, requestOptions).then((response) =>
        !response.ok ? null : response.json().catch((err) => null)
      );
    };

    return Promise.all(slugs.map(fetchForSlug))
      .then((results) => {
        setSuccess(
          !!(
            results &&
            isArray(results) &&
            results.filter((r) => !!r).length === slugs.length
          )
        );
      })
      .finally(() => setLoading(false));
  }, [apiKey]);

  return [success, loading, updateHistory];
};

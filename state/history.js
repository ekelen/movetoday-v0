import { useState } from "react";

export const useFetchForHistory = (apiKey, slugs) => {
  const [results, setResults] = useState(null);

  const updateHistory = () => {
    setResults(null);
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
        response.json().catch((err) => err.json())
      );
    };

    return Promise.all(slugs.map(fetchForSlug)).then(setResults);
  };

  return { updateHistory, results };
};

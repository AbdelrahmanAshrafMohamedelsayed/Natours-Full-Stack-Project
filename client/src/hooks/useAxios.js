// import { useState } from "react/cjs/react.production.min";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const sendRequest = useCallback(async (configParams, Applydata) => {
    setIsLoading(true);
    setError(null);
    try {
      //   const response = await fetch(requstConfig.url, {
      //     method: requstConfig.method ? requstConfig.method : "GET",
      //     body: requstConfig.body ? JSON.stringify(requstConfig.body) : null,
      //     headers: requstConfig.headers ? requstConfig.headers : {},
      //   });
      //   const data = await response.json();
      //   applyFunc(data);
      const result = await axios.request(configParams);
      Applydata(result);
      setResponse(result);
    } catch (err) {
      // console.log(err);
      setError(err.response.data.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { response, isLoading, error, sendRequest };
};

export default useAxios;

// const useAxios = (configParams) => {
//     const fetchDataUsingAxios = async() => {
//         await axios.request(configParams)
//         .then(res => setRes(res)
//         .catch(err => setError(err))
//         .finally(() => setIsLoading(false))
//     }
//     return [res, error, isLoading];
// }
// export default useAxios;

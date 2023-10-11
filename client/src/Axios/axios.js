import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_NATOURS_API_BACKEND_URL,
});

export const request = ({ ...options }) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response;
  const onError = (error) => {
    // optionaly catch errors and add additional logging here
    console.log("error from axios", error);
    throw error;
  };

  return client(options).then(onSuccess).catch(onError);
};

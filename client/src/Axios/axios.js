import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_NATOURS_API_BACKEND_URL + "/api/v1",
});

export const request = ({ ...options }) => {
  const token = localStorage.getItem("token");
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response;
  const onError = (error) => {
    // optionaly catch errors and add additional logging here
    throw error;
  };

  return client(options).then(onSuccess).catch(onError);
};

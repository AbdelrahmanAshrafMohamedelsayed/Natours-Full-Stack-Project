import React, { useEffect, useState } from "react";
import { TourCard } from "../components";
import useAxios from "./../hooks/useAxios";
import axios from "axios";
import { json, useLoaderData } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeltonCard from "../components/skeltonCard";
const HomePage = () => {
  const [tours, setTours] = useState([]);
  const { response, isLoading, error, sendRequest: fetchTours } = useAxios();
  useEffect(() => {
    const Applydata = (data) => {
      // console.log(data.data.data.data);
      setTours(data.data.data.data);
    };
    fetchTours(
      {
        url: "http://127.0.0.1:3000/api/v1/tours",
        method: "GET",
      },
      Applydata
    );
    // Applydata(response);
  }, [fetchTours]);
  // console.log("response");
  return (
    <main className="px-[3rem] py-[2rem] md:px-[6rem] md:py-[4rem] 2xl:px-[8rem] 2xl:py-[6rem] bg-[#F7F7F7]">
      <div className="flex items-center  justify-center flex-wrap mx-auto md:justify-between ">
        {response &&
          tours.length > 0 &&
          !isLoading &&
          !error &&
          tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        {isLoading && <SkeltonCard cards={8} />}
      </div>
    </main>
  );
};

export default HomePage;
export const loaderTours = async () => {
  axios.defaults.headers.common["Accept"] = "application/json";
  let resposnd;
  try {
    const response = await axios("http://127.0.0.1:3000/api/v1/tours", {
      headers: {
        Accept: "application/json",
      },
    });
    resposnd = response;
  } catch (error) {
    // console.log(error.response.data);
    throw json(
      { message: "Cannot Fetch Tours" },
      {
        status: 500,
      }
    );
  }
  console.log(resposnd);
  return resposnd;
};

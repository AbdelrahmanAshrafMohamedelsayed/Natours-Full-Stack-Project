import React, { useEffect, useState } from "react";
import { TourCard } from "../components";
import useAxios from "./../hooks/useAxios";
import axios from "axios";
import {
  json,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeltonCard from "../components/skeltonCard";
import { useInfiniteQuery, useQuery } from "react-query";
import { request } from "../Axios/axios";
import { useBookTour } from "../hooks/useUserData";
import { toast } from "react-toastify";
import { useFetchBookingTours } from "../hooks/useToursData";
const Bookings = () => {
  const onSuccess = (data) => {
    // console.log("successssss");
    // console.log(data);
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { isLoading, isError, error, data } = useFetchBookingTours(
    onSuccess,
    onError
  );
  return (
    <main className="px-[3rem] py-[2rem] md:px-[6rem] md:py-[4rem] 2xl:px-[8rem] 2xl:py-[6rem] bg-[#F7F7F7]">
      <div className="flex items-center  justify-center flex-wrap mx-auto md:justify-between ">
        {data &&
          !isLoading &&
          !isError &&
          data?.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        {isLoading && <SkeltonCard cards={8} />}
        {data?.length === 0 && !isLoading && !isError && (
          <h1 className="text-3xl font-bold text-center">No Tours Available</h1>
        )}
      </div>
    </main>
  );
};

export default Bookings;

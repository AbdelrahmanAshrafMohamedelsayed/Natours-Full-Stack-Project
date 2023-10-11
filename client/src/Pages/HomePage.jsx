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
import { useToursDataFetch } from "../hooks/useToursData";
import { useBookTour } from "../hooks/useUserData";
import { toast } from "react-toastify";
let isInitial = true;
const HomePage = () => {
  // state change
  // console.log(import.meta.env.VITE_NATOURS_API_BACKEND_URL);
  const navigate = useNavigate();
  const onSuccess = (data) => {
    // console.log("successssss");
    // console.log(data);
    navigate("/");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate } = useBookTour(onSuccess, onError);
  // get the query params from the URL
  const [queryParameters] = useSearchParams();
  // console.log(queryParameters);
  const dataa = {
    tour: queryParameters.get("tour"),
    user: queryParameters.get("user"),
    price: queryParameters.get("price"),
  };
  const { tour, user, price } = dataa;
  // console.log(dataa);
  useEffect(() => {
    if (isInitial && tour && user && price) {
      // console.log(
      //   "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      // );
      isInitial = false;
      mutate(dataa);
    } else {
      // console.log("bbbbbbbbbb");
    }
  }, [tour, user, price]);
  // const onSuccess = (data) => {
  //   // console.log(data);
  //   // setTours(data);
  // };
  // const onError = (error) => {};
  // const [tours, setTours] = useState([]);
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useToursDataFetch();
  useEffect(() => {
    let fetching = false;
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;
      // scrollHeight is the total height of the scrollable element which is home page.
      // scrollTop is the distance between the top of the scrollable element and the top of the viewport.
      // clientHeight is the height of the viewport.
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        // console.log("hasNextPage", hasNextPage);
        if (hasNextPage) {
          // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

          await fetchNextPage();
        }
        fetching = false;
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [hasNextPage]);
  // const { isLoading, data, isError, error, refetch } = useQuery(
  //   "tours",
  //   fetchTours,
  //   {
  //     onSuccess,
  //     onError,
  //     select: (data) => {
  //       return data.data.data.data;
  //     },
  //   }
  // );
  // console.log(data);
  // const { response, isLoading, error, sendRequest: fetchTours } = useAxios();
  // useEffect(() => {
  //   const Applydata = (data) => {
  //     // console.log(data.data.data.data);
  //     setTours(data.data.data.data);
  //   };
  //   fetchTours(
  //     {
  //       url: "/tours",
  //     },
  //     Applydata
  //   );
  //   // Applydata(response);
  // }, [fetchTours]);
  // // console.log("response");
  // console.log("data", data);
  // console.log("isLoading", tours);
  // console.log({
  //   isLoading,
  //   isError,
  //   error,
  //   data,
  //   isFetching,
  //   isFetchingNextPage,
  //   hasNextPage,
  //   fetchNextPage,
  // });
  // console.log({ tours });
  return (
    <main className="px-[3rem] py-[2rem] md:px-[6rem] md:py-[4rem] 2xl:px-[8rem] 2xl:py-[6rem] bg-[#F7F7F7]">
      <div className="flex items-center  justify-center flex-wrap mx-auto md:justify-between ">
        {data &&
          !isLoading &&
          !isError &&
          data?.pages?.map((page) =>
            page.data.data.data.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))
          )}
        {isLoading && <SkeltonCard cards={8} />}
        {data?.length === 0 && !isLoading && !isError && (
          <h1 className="text-3xl font-bold text-center">No Tours Available</h1>
        )}
      </div>
    </main>
  );
};

export default HomePage;

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import tourimage from "../assets/tours/tour-4-cover.jpg";
import tourimage1 from "../assets/tours/tour-5-1.jpg";
import tourimage2 from "../assets/tours/tour-5-2.jpg";
import tourimage3 from "../assets/tours/tour-5-3.jpg";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineClockCircle } from "react-icons/ai";
import { LeftSection, Map2, Reviews, RightSection } from "../Features";
import { ImagesList, TourBook } from "../components";
import reviews from "./../Features/reviews";
import useAxios from "../hooks/useAxios";
import ExtractYear from "../util/DateExtract";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useOneTourFetch } from "../hooks/useToursData";
const Tour = () => {
  const listItems = useMemo(() => [tourimage1, tourimage2, tourimage3], []);
  const { id } = useParams();
  const { isLoading, data: tour, isError, error } = useOneTourFetch(id);
  // console.log({ isLoading, tour, isError, error });
  const { year, month } = ExtractYear(tour?.startDates[0]);
  // const { response, isLoading, error, sendRequest: fetchTour } = useAxios();

  // useEffect(() => {
  //   const Applydata = (data) => {
  //     // console.log(data.data.data.data);
  //     setTour(data.data.data.data);
  //   };
  //   fetchTour(
  //     {
  //       url: `http://127.0.0.1:3000/api/v1/tours/${id}`,
  //       method: "GET",
  //     },
  //     Applydata
  //   );
  // }, [fetchTour]);
  // console.log(tour);
  return (
    <>
      <div className="relative">
        <div className=" relative w-full h-[calc(62vw)] bg-black clip-path2 min-h-[50vh] max-h-[calc(100vh-8rem)] before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full  z-10  before:linearGrad before:opacity-70">
          {tour?.imageCover && (
            <img
              // src={
              //   new URL(`../assets/tours/${tour?.imageCover}`, import.meta.url)
              //     .href
              // }
              crossOrigin="anonymous"
              src={`${import.meta.env.VITE_NATOURS_API_BACKEND_URL}/img/tours/${
                tour?.imageCover
              }`}
              alt={tour?.name}
              className="w-full h-full object-cover"
            />
          )}
          {!tour?.imageCover && <Skeleton width={"100%"} height={"100%"} />}
        </div>
        <div className="absolute top-[35%] left-[50%] transform translate-x-[-50%] -translate-y-[50%] z-20 text-center mx-auto ">
          <h1 className=" capitalize  text-[5rem] font-[300]  z-20 w-[70%] mx-auto max-md:text-[4rem] max-sm:text-[2.5rem] ">
            {tour?.name && (
              <span className="py-[1rem] px-[2rem] linearGrad text-[#f7f7f7] box-dec">
                {tour?.name}
              </span>
            )}
            {!tour?.name && <Skeleton />}
          </h1>
          <div className=" flex items-center gap-[4rem] justify-center mt-8 mx-auto max-md:gap-[3rem] ">
            <div className="flex items-center gap-[.8rem] max-md:gap-[.6rem] ">
              <span className=" text-[#f7f7f7] font-[700]  text-[2rem]">
                <AiOutlineClockCircle />
              </span>
              <span className="text-[1.5rem] text-[#f7f7f7] font-[700] uppercase text-shadow max-md:text-[1rem]">
                {tour?.duration ? (
                  tour?.duration + " Days"
                ) : (
                  <Skeleton width={50} />
                )}
              </span>
            </div>
            <div className="flex items-center gap-[.8rem] max-md:gap-[.6rem] ">
              <span className=" text-[#f7f7f7] font-[700]  text-[2.5rem]">
                <CiLocationOn />
              </span>
              <span className="text-[1.5rem] text-[#f7f7f7] font-[700] uppercase text-shadow max-md:text-[1rem]">
                {tour?.startLocation?.description ? (
                  tour?.startLocation?.description
                ) : (
                  <Skeleton width={60} />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex mt-[-9vw] flex-wrap">
        <LeftSection
          year={year}
          month={month}
          difficulty={tour?.difficulty}
          PARTICIPANTS={tour?.maxGroupSize}
          RATING={tour?.ratingsAverage}
          tourGuides={tour?.guides}
        />
        <RightSection tourName={tour?.name} description={tour?.description} />
      </div>
      <ImagesList list={tour?.images} />
      <Map2 startLocation={tour?.startLocation} locations={tour?.locations} />
      <Reviews list={tour?.reviews} tourId={id} />
      <TourBook tourId={id} />
    </>
  );
};

export default Tour;

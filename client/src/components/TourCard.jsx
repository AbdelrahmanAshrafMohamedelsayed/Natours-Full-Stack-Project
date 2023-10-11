import React from "react";
import tourimage from "../assets/tours/tour-4-cover.jpg";
import { CiLocationOn } from "react-icons/ci";
import { FiFlag } from "react-icons/fi";
import { BiSolidFlagAlt, BiUser } from "react-icons/bi";
import TourCardItem from "./TourCardItem";
import { Link } from "react-router-dom";
import ExtractYear from "../util/DateExtract";
const TourCard = ({ tour }) => {
  const { year, month } = ExtractYear(tour?.startDates[0]);
  // console.log(tour);
  return (
    <div className="basis-[90%] md:basis-[48%] lg:basis-[30%] xl:basis-[27%] max-w-[120rem] box-shadow rounded-[3px] mb-[2rem] ">
      {/* first section */}
      <div className=" relative">
        <div className="relative w-full h-[22rem] before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full  z-10  before:linearGrad before:opacity-70 clip-path ">
          <img
            crossOrigin="anonymous"
            src={`${import.meta.env.VITE_NATOURS_API_BACKEND_URL}/img/tours/${
              tour?.imageCover
            }`}
            alt="tour"
            className="w-full h-full object-cover "
          />
        </div>
        <h3 className=" capitalize  text-[2.75rem] font-[300] absolute bottom-[1rem] right-[2rem] z-20 w-[70%] text-right">
          <span className="py-[1rem] px-[2rem] linearGrad text-[#f7f7f7] box-dec">
            {tour?.name}
          </span>
        </h3>
      </div>
      {/* first section */}
      {/* second section */}
      <div className=" px-[2.5rem] py-[3rem] flex flex-col gap-[1.75rem]">
        <h4 className="text-[1.2rem] uppercase font-[700]">
          {tour?.difficulty} {tour?.duration}-day tour
        </h4>
        <p className="text-[1.5rem] italic text-[#777]  leading-[1.6] font-[300]">
          {tour?.summary}
        </p>

        <div className="flex items-center justify-between ">
          <TourCardItem
            icon="location"
            txt={tour?.startLocation?.description}
          />
          {month && year && (
            <TourCardItem icon="Date" txt={` ${month} ${year}`} />
          )}
        </div>

        <div className="flex items-center justify-between ">
          <TourCardItem icon="flag" txt={` ${tour?.locations?.length} stops`} />
          <TourCardItem icon="user" txt={` ${tour?.maxGroupSize} people`} />
        </div>
      </div>
      {/* second section */}
      {/* third section */}
      <div className=" px-[2.5rem] py-[3rem] flex justify-between items-center bg-[#f7f7f7] border-t-[#f1f1f1] border-t-[1px]">
        <div className="">
          <p className=" mb-[1rem]">
            <span className="text-[1.5rem] font-[700] mr-[.25rem] text-[#777] ">
              ${tour?.price}
            </span>
            <span className="text-[1.5rem] font-[300] text-[#999] ">
              {" "}
              per person
            </span>
          </p>
          <p className=" ">
            <span className="text-[1.5rem] font-[700] mr-[.25rem] text-[#777]">
              {tour?.ratingsAverage}
            </span>
            <span className="text-[1.5rem] font-[300] text-[#999]">
              rating ({tour?.ratingsQuantity})
            </span>
          </p>
        </div>
        <div className="transform hover:translate-y-[-4px]  duration-[.5s]">
          <Link
            to={`/tour/${tour?.id}`}
            className="  hover:shadow-lg  py-[1.5rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.5rem] font-[400] uppercase "
          >
            Details
          </Link>
        </div>
      </div>
      {/* third section */}
    </div>
  );
};

export default TourCard;

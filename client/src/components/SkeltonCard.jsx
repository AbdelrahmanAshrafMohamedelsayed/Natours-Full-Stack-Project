import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TourCardItem from "./TourCardItem";
const SkeltonCard = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, index) => (
      <div
        key={index}
        className="basis-[90%] md:basis-[48%] lg:basis-[30%] xl:basis-[27%] max-w-[120rem] rounded-[3px] mb-[2rem] "
      >
        {/* first section */}
        <div className=" relative">
          <div className="relative w-full h-[22rem] before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full  z-10  before:opacity-70 clip-path ">
            <Skeleton width={"100%"} height={"100%"} />
          </div>
          <h3 className=" capitalize  text-[2.75rem] font-[300] absolute bottom-[1rem] right-[2rem] z-20 w-[70%] text-right">
            <Skeleton />
          </h3>
        </div>
        <div className=" px-[2.5rem] py-[3rem] flex flex-col gap-[1.75rem]">
          <h4 className="text-[1.2rem] uppercase font-[700]">
            <Skeleton width={200} />
          </h4>
          <p className="text-[1.5rem] italic text-[#777]  leading-[1.6] font-[300]">
            <Skeleton
              count={3}
              style={{
                marginBottom: "1rem",
              }}
            />
          </p>

          <div className="flex items-center  justify-around">
            {/* <TourCardItem icon="" txt="" />
        <TourCardItem icon="" txt="" /> */}
            <Skeleton width={150} />
            <Skeleton width={150} />
          </div>
          <div className="flex items-center  justify-around">
            {/* <TourCardItem icon="" txt="" />
        <TourCardItem icon="" txt="" /> */}
            <Skeleton width={150} />
            <Skeleton width={150} />
          </div>
        </div>

        <div className=" px-[2.5rem] py-[3rem] flex justify-between items-center bg-[#f7f7f7] border-t-[#f1f1f1] border-t-[1px]">
          <div className="">
            <p className=" mb-[1rem]">
              <span className="text-[1.5rem] font-[700] mr-[.25rem] text-[#777] ">
                <Skeleton width={200} />
              </span>
            </p>
            <p className=" ">
              <span className="text-[1.5rem] font-[700] mr-[.25rem] text-[#777]">
                <Skeleton width={200} />
              </span>
            </p>
          </div>
          <div className="transform hover:translate-y-[-4px]  duration-[.5s]">
            <div className="py-[1.5rem] px-[3rem] text-[#f7f7f7] rounded-[10rem] text-[1.5rem] font-[400] uppercase ">
              <Skeleton width={100} height={50} borderRadius={"20px"} />
            </div>
          </div>
        </div>
        {/* third section */}
      </div>
    ));
};

export default SkeltonCard;

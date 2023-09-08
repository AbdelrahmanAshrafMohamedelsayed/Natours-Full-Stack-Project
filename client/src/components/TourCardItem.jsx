import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import { FiFlag } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const TourCardItem = ({ icon, txt }) => {
  return (
    <div className="flex text-[1.3rem] items-center gap-[.3rem] basis-[50%]">
      <span className="text-[#55c57a] text-[2.5rem]">
        {icon === "location" && <CiLocationOn />}
        {icon === "Date" && <MdDateRange />}
        {icon === "flag" && <FiFlag />}
        {icon === "user" && <BiUser />}
        {!icon && <Skeleton />}
      </span>
      <span className="text-[1.3rem] text-[#777] font-[300]">
        {txt || <Skeleton />}
      </span>
    </div>
  );
};

export default TourCardItem;

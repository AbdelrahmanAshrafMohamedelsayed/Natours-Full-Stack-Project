import React from "react";
import { MdDateRange } from "react-icons/md";
import { BiTrendingUp } from "react-icons/bi";
import { AiOutlineStar, AiOutlineUser } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const FactComponent = ({ icon, first, second }) => {
  return (
    <div className="flex items-center gap-[2.25rem] mb-[2.25rem] text-[1.4rem] font-[700] ">
      <div className=" flex items-center gap-[1.25rem]">
        <span className="text-[#55c57a] text-[2.5rem]">
          {icon === "date" && <MdDateRange />}
          {icon === "star" && <AiOutlineStar />}
          {icon === "user" && <AiOutlineUser />}
          {icon === "trending" && <BiTrendingUp />}
        </span>
        <span className="text-[#777] font-[700] uppercase">
          {first || <Skeleton />}
        </span>
      </div>
      <span className="text-[#777] font-[300]">{second || <Skeleton />}</span>
    </div>
  );
};

export default FactComponent;

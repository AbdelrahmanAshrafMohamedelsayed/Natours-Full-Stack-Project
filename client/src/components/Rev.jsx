import React from "react";
import userImage from "../assets/users/user-1.jpg";
import Rate from "./Rate";
import { Link } from "react-router-dom";

const rev = ({ item, my }) => {
  // console.log(item);
  return (
    <div className=" min-w-[30rem] h-[30rem] basis-[30rem] p-[4rem] rounded-[3px] shadow-2xl bg-[#f7f7f7] relative">
      <div className="flex items-center justify-center mb-[2rem]">
        {item?.user?.photo && (
          <img
            crossOrigin="anonymous"
            src={`${import.meta.env.VITE_NATOURS_API_BACKEND_URL}/img/users/${
              item?.user?.photo
            }`}
            alt="user"
            className="w-[4.5rem] h-[4.5rem] rounded-full mr-[1.5rem]"
          />
        )}
        {item?.user?.name && (
          <span className="text-[#777] font-[700] uppercase text-[1.5rem]">
            {item?.user?.name}
          </span>
        )}
      </div>
      <p className="text-[1.5rem] font-[300] mb-[2rem] italic text-[#777] break-words">
        {item?.review}
      </p>
      {/* go to the tour link */}
      <Rate rate={item?.rating} />
      {my && (
        <div className=" absolute left-1/2 transform translate-x-[-50%] bottom-8">
          <div className="flex items-center justify-center   ">
            <Link
              to={`/tour/${item?.tour}`}
              className="text-primary font-[700] uppercase text-[1.5rem]  text-center"
            >
              go to the tour
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default rev;

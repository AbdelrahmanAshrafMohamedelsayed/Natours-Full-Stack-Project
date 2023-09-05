import React from "react";
import userImage from "../assets/users/user-1.jpg";
import Rate from "./Rate";

const rev = ({ item }) => {
  // console.log(item);
  return (
    <div className=" min-w-[30rem] h-[30rem] basis-[30rem] p-[4rem] rounded-[3px] shadow-2xl bg-[#f7f7f7]">
      <div className="flex items-center justify-center mb-[2rem]">
        {item?.user?.photo && (
          <img
            src={
              new URL(`../assets/users/${item?.user?.photo}`, import.meta.url)
                .href
            }
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
      <p className="text-[1.5rem] font-[300] mb-[2rem] italic text-[#777]">
        {item?.review}
      </p>
      <Rate rate={item?.rating} />
    </div>
  );
};

export default rev;

import React from "react";

const TourUserElement = (props) => {
  const guide = props.guide;
  return (
    <div className="flex items-center gap-[2.25rem] mb-[2.25rem] text-[1.4rem] font-[700] ">
      <div className=" flex items-center gap-[1.25rem]">
        <img
          src={new URL(`../assets/users/${guide?.photo}`, import.meta.url).href}
          alt={guide?.name}
          className="w-[4rem] h-[4rem] rounded-full"
        />
        <span className="text-[#777] font-[700] uppercase">{guide?.role}</span>
      </div>
      <span className="text-[#777] font-[300]">{guide?.name}</span>
    </div>
  );
};

export default TourUserElement;

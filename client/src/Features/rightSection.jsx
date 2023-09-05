import React from "react";

const rightSection = ({ description, tourName }) => {
  return (
    <div className=" basis-[100%] px-[8vw] pt-[14vw] pb-[10vw] sm:basis-[50%] mb-[3rem]">
      <div>
        {tourName && (
          <h2 className=" m-0 p-0  uppercase text-[2.25rem] font-[700]  tracking-[0.1rem] mb-[3.4rem] text-primary max-md:text-[1.8rem]">
            ABOUT {tourName}
          </h2>
        )}
        {description && (
          <p className="text-[1.7rem] font-[300] text-[#777] leading-[1.6]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default rightSection;

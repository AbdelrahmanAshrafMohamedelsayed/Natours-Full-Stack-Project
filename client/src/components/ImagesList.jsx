import React from "react";

const ImagesList = ({ list }) => {
  // console.log("ImagesList", list);

  return (
    <div className="flex  mt-[-9vw] min-h-[30rem] transform skew-y-[353deg] z-10 relative">
      {list?.map((item, index) => (
        <div key={index}>
          <img
            src={new URL(`../assets/tours/${item}`, import.meta.url).href}
            alt="tour"
            className="w-[100%] h-[100%]  object-cover pt-[15%]"
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesList;

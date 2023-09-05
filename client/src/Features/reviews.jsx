import React from "react";

import { useRef, useEffect } from "react";
import { Rev } from "../components";

const reviews = ({ list }) => {
  return (
    <div className=" px-[0rem] py-[calc(5rem+9vw)] background mt-[-9vw] skew-y-[353deg] transform">
      <div className=" flex  items-center gap-[6rem] overflow-hidden scroll-x overflow-x-scroll p-[5rem] scrolll skew-y-[-353deg] transform">
        {list?.map((item, index) => (
          <Rev key={item?.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default reviews;

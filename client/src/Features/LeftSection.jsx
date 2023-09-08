import React from "react";
import { MdDateRange } from "react-icons/md";
import { FactComponent, TourUserElement } from "../components";
import userImage from "../assets/users/user-1.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LeftSection = (props) => {
  // clg(props);
  // console.log(props.guide + "jjjjjjjjjjjjj");

  return (
    <div className=" basis-[100%] bg-[#F7F7F7]  px-[8vw] pt-[14vw] pb-[10vw] flex flex-col  items-center max-sm:basis-[100%] sm:basis-[50%]">
      <div>
        <h2 className=" m-0 p-0  uppercase text-[2.25rem] font-[700]  tracking-[0.1rem] mb-[3.4rem] text-primary max-md:text-[1.8rem]">
          QUICK FACTS
        </h2>
        <div className="mb-[7rem]">
          <FactComponent
            icon="date"
            first="Next Date"
            second={`${props?.month} ${props.year}`}
          />
          <FactComponent
            icon="star"
            first="Difficulty"
            second={props?.difficulty}
          />
          <FactComponent
            icon="user"
            first="Participants"
            second={`${props?.PARTICIPANTS} People`}
          />
          <FactComponent
            icon="trending"
            first="Rating"
            second={`${+props?.RATING} / 5`}
          />
        </div>
      </div>
      <div>
        <h2 className=" m-0 p-0  uppercase text-[2.25rem] font-[700]  tracking-[0.1rem] mb-[3.4rem] text-primary max-md:text-[1.8rem]">
          YOUR TOUR GUIDES
        </h2>
        <div className="">
          {props?.tourGuides?.map((guide) => (
            <TourUserElement key={guide._id} guide={guide} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;

import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import ProfileNavItem from "./ProfileNavItem";
import { useSelector } from "react-redux";
const ProfileNav = () => {
  const user = useSelector((state) => state.user)?.user;

  const arr = ["Settings", "My Bookings", "my reviews", "billing"];
  const arr2 = [
    "Manage tours",
    "Manage users",
    "Manage bookings",
    "Manage reviews",
  ];
  return (
    <div className=" basis-[27%] background px-0 py-[4rem] min-w-[27rem]   text-center">
      {arr.map(
        (item, index) =>
          !(
            user.role !== "user" &&
            (item === "My Bookings" || item === "my reviews")
          ) && <ProfileNavItem key={index} title={item} active="Settings" />
      )}
      {user.role !== "user" && (
        <div className="mt-[5.5rem] max-md:mt-[2rem]">
          <h5 className="pb-[4px] mx-[4rem] mb-[1.5rem] max-md:mb-[2rem] text-[1.3rem] font-[700] text-[#ffff]  border-b-white border-b-[1px] uppercase">
            Admin
          </h5>
          {arr2.map((item, index) => (
            <ProfileNavItem key={index} title={item} active="Settings" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileNav;

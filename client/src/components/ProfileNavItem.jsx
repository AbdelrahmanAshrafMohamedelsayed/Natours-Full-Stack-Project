import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { BsMap } from "react-icons/bs";
const ProfileNavItem = ({ title, active }) => {
  const to =
    title === "Settings"
      ? "/me"
      : title === "My Bookings"
      ? "/mybookings"
      : title === "my reviews"
      ? "/myreviews"
      : title === "billing"
      ? "/billing"
      : title === "Manage users"
      ? "/manageusers"
      : title === "Manage bookings"
      ? "/managebookings"
      : "/managereviews";
  const icon =
    title === "Settings" ? (
      <AiOutlineSetting
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    ) : title === "My Bookings" || title === "Manage bookings" ? (
      <BsBag
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    ) : title === "my reviews" || title === "Manage reviews" ? (
      <AiOutlineStar
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    ) : title === "billing" ? (
      <CiCreditCard1
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    ) : title === "Manage users" ? (
      <FiUsers
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    ) : (
      <BsMap
        width={"1.9rem"}
        height={"1.9rem"}
        color={"#ffff"}
        fill="#ffff"
        size={"2rem"}
      />
    );
  return (
    <li className=" w-full mb-[1rem] duration-[.3s] list-none">
      <Link
        to={to}
        className={`duration-[.3s] text-[#ffff] text-[1.5rem] font-[300] uppercase  w-full flex items-center gap-[1.5rem] py-[1rem] px-[4rem]
       hover:pl-[5rem] hover:border-l-[4px] hover:border-[#ffff] max-md:justify-center
       ${active === title && "border-l-[4px] border-[#ffff]"}
       `}
      >
        <span>{icon}</span>
        <span className="">{title}</span>
      </Link>
    </li>
  );
};

export default ProfileNavItem;

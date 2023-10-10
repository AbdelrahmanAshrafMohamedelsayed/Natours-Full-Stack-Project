import React from "react";
import { ProfileBigForm, ProfileNav } from "../components";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <>
      {/* {" "}
      <div className=" flex items-center gap-[3rem] justify-center p-[2rem]">
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-primary text-[2rem] font-[700]  block"
        >
          Login
        </Link>
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-primary text-[2rem] font-[700]  block"
        >
          Login
        </Link>
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-primary text-[2rem] font-[700]  block"
        >
          Login
        </Link>
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-primary text-[2rem] font-[700]  block"
        >
          Login
        </Link>
      </div> */}
      {/* nav */}
      {/* <div className="w-full flex justify-center  items-center bg-[#55c57a] text-[#f7f7f7] gap-[3rem] mt-[3rem] ">
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-[#f7f7f7]  text-[2rem] font-[700]  block"
        >
          Login
        </Link>
        <Link
          to="/"
          className=" transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-[#f7f7f7]  text-[2rem] font-[700]  block"
        >
          Login
        </Link>
      </div> */}

      {/* nav */}

      <div className=" w-full flex justify-center  bg-[#F7F7F7]  h-fit ">
        <div className="mt-[8rem] bg-white rounded-[3px] shadow-2xl w-[90%] max-md:w-[75%] max-sm:w-[90%] max-md:flex-col max-w-[120rem] flex h-fit">
          <ProfileNav />
          <ProfileBigForm />
        </div>
      </div>
    </>
  );
};

export default Profile;

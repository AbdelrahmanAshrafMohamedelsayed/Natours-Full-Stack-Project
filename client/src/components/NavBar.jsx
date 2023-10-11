import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSubmit } from "react-router-dom";
import logowhite from "../assets/logo-white.png";
import { FaBars } from "react-icons/fa";
import userlogo from "../assets/users/user-1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../Store/user";
import { toast } from "react-toastify";
import { useLogOutUser } from "../hooks/useUserData";
const NavBar = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const dispatch = useDispatch();
  const onSuccess = (data) => {
    console.log("successssss");
    console.log(data);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(userActions.Removedata());
    toast.success("Logout Successfully");
    // console.log("hhhhhhhhhhhhhhhhhhhhh");
    // console.log("logout");
    navigate("/");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate, isLoading, isError, error, isSuccess } = useLogOutUser(
    onSuccess,
    onError
  );

  const logoutHandler = (e) => {
    e.preventDefault();
    mutate();
  };
  const [Showlist, setShowlist] = useState(false);
  const user = useSelector((state) => state.user)?.user;
  useEffect(() => {
    // console.log("hjjjjjjjjjjjjjjjjjjg");
  }, [user]);
  // console.log(user + ";;;;;;;;;;;;;;;;;;;;");
  const { token } = useSelector((state) => state.user);
  // const { name, photo } = user;
  const name = user?.name;
  const photo = user?.photo;
  // console.log("jkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", photo);
  return (
    <header className=" bg-nav text-preW relative z-[1000]">
      <nav className="h-[8rem] px-[5rem] flex justify-between items-center relative max-md:px-[2.5rem]">
        <div className="">
          <Link
            to="/"
            className=" transform hover:translate-y-[-2px]  duration-[.3s] uppercase text-[#f7f7f7] text-[1.6rem] font-[300] block hover:text-shadow"
          >
            All Tours
          </Link>
        </div>

        <div className="h-[3.5rem]  max-md:h-[3rem] md:absolute md:left-1/2 md:transform md:translate-x-[-50%]">
          <img src={logowhite} alt="logo" className="h-full " />
        </div>
        <div className="flex space-x-[3rem] items-center justify-end">
          <div
            className=" flex justify-center items-center cursor-pointer  md:hidden duration-[.3s]"
            onClick={() => setShowlist(!Showlist)}
          >
            <span
              className={`${
                !Showlist ? "text-[#f7f7f7]" : "text-primary"
              } text-[#f7f7f7] text-[2.5rem] font-[300] duration-[.3s]`}
            >
              <FaBars />
            </span>
          </div>
          {!token && (
            <Link
              to="/login"
              className="max-md:hidden transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-[#f7f7f7] text-[1.6rem] font-[300] hover:text-shadow block"
            >
              Login
            </Link>
          )}
          {!token && (
            <button
              className="max-md:hidden uppercase text-[#f7f7f7] text-[1.6rem] font-[300] outline-none border-[1px] border-solid border-white rounded-[10rem] py-[1rem] px-[3rem] hover:btn-hover active:btn-hover duration-[.3s]"
              onClick={() => navigate("/signup")}
            >
              sign up
            </button>
          )}
          {token && (
            <Link
              to="/"
              onClick={logoutHandler}
              className="max-md:hidden transform hover:translate-y-[-2px]  duration-[.3s]  uppercase text-[#f7f7f7] text-[1.6rem] font-[300] hover:text-shadow block"
            >
              Log out
            </Link>
          )}
          {token && (
            <div
              className=" flex items-center text-[1.6rem] uppercase duration-[.3s] transform hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate("/me")}
            >
              {photo && (
                <img
                  crossOrigin="anonymous"
                  src={`${
                    import.meta.env.VITE_NATOURS_API_BACKEND_URL
                  }/img/users/${photo}`}
                  alt="logo"
                  className=" rounded-full w-[3.9rem] h-[3.9rem] object-cover mr-[1rem]"
                />
              )}
              <span className="">{name}</span>
            </div>
          )}
        </div>

        {Showlist && (
          <ul className=" absolute top-full left-0  text-preW flex flex-col  w-full duration-[.3s] md:hidden">
            {!token && (
              <li className="border-b-[1px] border-solid border-preW">
                <Link
                  to="/login"
                  className="bg-primary transform duration-[.3s]  uppercase text-[#f7f7f7] text-[1.6rem] font-[400] hover:pl-[2.5rem] block p-[2rem] "
                >
                  Login
                </Link>
              </li>
            )}
            {!token && (
              <li className="border-b-[1px] border-solid border-preW">
                <Link
                  to="/signup"
                  className="bg-primary transform  duration-[.3s]  uppercase text-[#f7f7f7] text-[1.6rem] font-[400] hover:pl-[2.5rem] block p-[2rem] "
                >
                  Sign up
                </Link>
              </li>
            )}
            {token && (
              <li className="border-b-[1px] border-solid border-preW">
                <Link
                  to="/"
                  className="bg-primary transform  duration-[.3s]  uppercase text-[#f7f7f7] text-[1.6rem] font-[400] hover:pl-[2.5rem] block p-[2rem] "
                  onClick={logoutHandler}
                >
                  Log out
                </Link>
              </li>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default NavBar;

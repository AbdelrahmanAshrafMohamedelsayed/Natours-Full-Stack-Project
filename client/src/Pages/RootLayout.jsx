import React, { useEffect } from "react";
import { Outlet, json, useLoaderData } from "react-router-dom";
import { NavBar } from "../components";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userActions } from "../Store/user";
const RootLayout = () => {
  const dispatch = useDispatch();
  // console.log("RootLayout");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(userActions.Setuser(JSON.parse(user)));
      dispatch(userActions.setToken(token));
      // console.log("RootLayout", token, user);
    }
  }, []);
  // const data = useLoaderData();
  // console.log(data);
  // if (data?.token && data?.user) {
  //   console.log("tttttttttttttttttttttttttttttt");
  //   const user = JSON.parse(data?.user);
  //   const token = data?.token;
  //   console.log("user", user, token);
  //   dispatch(userActions.Setuser(user));
  //   dispatch(userActions.setToken(token));
  // }
  return (
    <>
      <NavBar />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        icon={false}
        closeButton={false}
        progressClassName={`   `}
        className={` text-[2rem] font-[500] text-center`}
      />
      <Outlet />
    </>
  );
};

export default RootLayout;

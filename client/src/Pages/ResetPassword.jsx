import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { TextField } from "../components";
import useAxios from "../hooks/useAxios";
import { useDispatch } from "react-redux";
import { userActions } from "../Store/user";
import { ToastContainer, toast } from "react-toastify";
import {
  useForgetPasswordUser,
  useLoginUser,
  useResetPasswordUser,
} from "../hooks/useUserData";
import ForgetPass from "../Validations/ForgetPass";
import { useParams } from "react-router-dom";
import ResetPass from "../Validations/ResetPass";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  // console.log(token);
  const onSuccess = (data) => {
    // console.log("successssss");
    // console.log(data);
    const token = data?.data?.token;
    const user = data?.data?.data?.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(userActions.Setuser(user));
    dispatch(userActions.setToken(token));
    toast.success("Password Reset Successfully");
    navigate("/");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate, isLoading, isError, error, isSuccess } = useResetPasswordUser(
    onSuccess,
    onError
  );
  const dispatch = useDispatch();
  const submitHandler = (values, formik) => {
    // console.log(values);
    const data = {
      token,
      data: values,
    };
    mutate(data);
  };
  return (
    <>
      <Formik
        initialValues={{
          password: "",
          passwordConfirm: "",
        }}
        validationSchema={ResetPass}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <>
            <div className=" w-full  flex justify-center bg-[#F7F7F7] overflow-x-hidden">
              <div className=" my-[8rem] bg-white shadow-2xl rounded-[5px] py-[5rem] px-[7rem] w-[90%] max-w-[55rem] max-sm:py-[3rem] max-sm:px-[5rem]">
                <h2 className="text-[2.25rem] font-[700] mb-[3.5rem] heading-color text-center max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem]">
                  Reset Password
                </h2>
                <Form className="flex flex-col gap-[2.5rem] w-full">
                  <TextField
                    label="New password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />
                  <TextField
                    label="Confirm password"
                    name="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
                  />
                  <div className="transform hover:translate-y-[-4px]  duration-[.5s] mt-[1rem]">
                    <button
                      type="submit"
                      className="  hover:shadow-lg  py-[1.4rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] font-[400] uppercase border-none outline-none"
                    >
                      {isLoading ? "Reseting" : "Reset Password"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default ResetPassword;

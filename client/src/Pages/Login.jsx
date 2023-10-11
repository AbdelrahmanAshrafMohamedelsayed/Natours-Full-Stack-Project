import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { TextField } from "../components";
import LoginValidate from "../Validations/LoginValidate";
import useAxios from "../hooks/useAxios";
import { useDispatch } from "react-redux";
import { userActions } from "../Store/user";
import { ToastContainer, toast } from "react-toastify";
import { useLoginUser } from "../hooks/useUserData";
const Login = () => {
  const onSuccess = (data) => {
    // console.log("successssss");
    // console.log(data);
    const token = data?.data?.token;
    const user = data?.data?.data?.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(userActions.Setuser(user));
    dispatch(userActions.setToken(token));
    toast.success("Login Successfully");
    navigate("/");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate, isLoading, isError, error, isSuccess } = useLoginUser(
    onSuccess,
    onError
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const Applydata = (data) => {

  // };
  // const { response, isLoading, error, sendRequest: LoginRequest } = useAxios();
  // useEffect(() => {
  //   if (error) {
  //     const err = error;
  //     // console.log(err);
  //     toast.error(err);
  //   }
  // }, [isError]);
  const submitHandler = (values, formik) => {
    // reset form
    // console.log(values);
    // formik.resetForm();
    // console.log("formik");
    // LoginRequest(
    //   {
    //     url: "http://127.0.0.1:3000/api/v1/users/login",
    //     method: "POST",
    //     data: values,
    //     headers: {
    //       accept: "application/json",
    //     },
    //   },
    //   Applydata
    // );
    mutate(values);
  };

  const validate = LoginValidate;
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <>
            <div className=" w-full  flex justify-center bg-[#F7F7F7] overflow-x-hidden">
              <div className=" my-[8rem] bg-white shadow-2xl rounded-[5px] py-[5rem] px-[7rem] w-[90%] max-w-[55rem] max-sm:py-[3rem] max-sm:px-[5rem]">
                <h2 className="text-[2.25rem] font-[700] mb-[3.5rem] heading-color text-center max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem]">
                  LOG INTO YOUR ACCOUNT
                </h2>
                <Form className="flex flex-col gap-[2.5rem] w-full">
                  <TextField
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                  />
                  {/* forget password */}
                  <div className="flex  items-center ">
                    <Link to="/forget-password">
                      <p className="text-[1.5rem] font-[500] text-[#55c57a] transform duration-[.3s] hover:text-black">
                        Forget password?
                      </p>
                    </Link>
                  </div>
                  {/* forget password */}
                  <div className="transform hover:translate-y-[-4px]  duration-[.5s] mt-[1rem]">
                    <button
                      type="submit"
                      className="  hover:shadow-lg  py-[1.4rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] font-[400] uppercase border-none outline-none"
                    >
                      {isLoading ? "logging in...." : "Login"}
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

export default Login;

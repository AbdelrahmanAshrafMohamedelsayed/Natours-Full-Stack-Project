import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import SignupValidate from "../Validations/SignupValidate";
import { TextField } from "../components";
import useAxios from "../hooks/useAxios";
import { userActions } from "../Store/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSignUpUser } from "../hooks/useUserData";
// import immg from "../../../starter/public/img/users/user-5c8a1d5b0190b214360dc057-1693580599164.jpeg";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSuccess = (data) => {
    // console.log("successssss");
    const token = data?.data?.token;
    const user = data?.data?.data?.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(userActions.Setuser(user));
    dispatch(userActions.setToken(token));
    toast.success("SignUp Successfully");
    navigate("/");
    // console.log(data);
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate, isLoading, isError, error, isSuccess } = useSignUpUser(
    onSuccess,
    onError
  );
  // const { response, isLoading, error, sendRequest: SignUpRequest } = useAxios();
  // useEffect(() => {
  //   if (error) {
  //     const err = error;
  //     console.log(err);
  //     toast.error(err);
  //   }
  // }, [error]);
  // const Applydata = (data) => {
  //   const token = data?.data?.token;
  //   const user = data?.data?.data?.user;
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("user", JSON.stringify(user));
  //   dispatch(userActions.Setuser(user));
  //   dispatch(userActions.setToken(token));
  //   toast.success("SignUp Successfully");
  //   navigate("/");
  //   console.log(data);
  // };
  // if (error) {
  //   console.log(error);
  // }
  const submitHandler = (values, formik) => {
    // reset form
    // formik.resetForm();
    // console.log("formik");
    // console.log(values);
    const { name, email, password, confirmPassword } = values;
    const obj = {
      name,
      email,
      password,
      passwordConfirm: confirmPassword,
    };
    // SignUpRequest(
    //   {
    //     url: "http://127.0.0.1:3000/api/v1/users/signup",
    //     method: "POST",
    //     data: obj,
    //     headers: {
    //       accept: "application/json",
    //     },
    //   },
    //   Applydata
    // );
    mutate(obj);
  };
  const validate = SignupValidate;
  //   console.log(validate);
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validate}
      onSubmit={submitHandler}
    >
      {(formik) => (
        <div className=" w-full  flex justify-center bg-[#F7F7F7] overflow-x-hidden">
          <div className=" my-[8rem] bg-white shadow-2xl rounded-[5px] py-[5rem] px-[7rem] w-[90%] max-w-[55rem] max-sm:py-[3rem] max-sm:px-[5rem]">
            <h2 className="text-[2.25rem] font-[700] mb-[3.5rem] heading-color text-center max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem]">
              CREATE YOUR ACCOUNT!
            </h2>
            {/* {console.log(formik)} */}
            <Form className="flex flex-col gap-[2.5rem] w-full">
              <TextField
                label="Your name"
                name="name"
                type="text"
                placeholder="Name"
              />
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
              <TextField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
              />
              {/* <div className="w-full">
                <label className="max-sm:text-[1.4rem] text-[1.6rem] font-[700] text-[#4F4F4F] mb-[0.75rem] block">
                  Email address
                </label>
                <input
                  className=" max-sm:py-[.75rem] focus:border-b-[3px] focus:border-solid focus:border-b-primary outline-none border-none w-full bg-[#f2f2f2] py-[1.25rem] px-[1.75rem] rounded-[4px] text-[1.5rem] font-[300] duration-[.1s] transition-all text-inherit"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="w-full">
                <label className="max-sm:text-[1.4rem] text-[1.6rem] font-[700] text-[#4F4F4F] mb-[0.75rem] block">
                  Password
                </label>
                <input
                  className=" max-sm:py-[.75rem] focus:border-b-[3px] focus:border-solid focus:border-b-primary outline-none border-none w-full bg-[#f2f2f2] py-[1.25rem] px-[1.75rem] rounded-[4px] text-[1.5rem] font-[300] duration-[.1s] transition-all text-inherit"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="w-full">
                <label className="max-sm:text-[1.4rem] text-[1.6rem] font-[700] text-[#4F4F4F] mb-[0.75rem] block">
                  Confirm password
                </label>
                <input
                  className=" max-sm:py-[.75rem] focus:border-b-[3px] focus:border-solid focus:border-b-primary outline-none border-none w-full bg-[#f2f2f2] py-[1.25rem] px-[1.75rem] rounded-[4px] text-[1.5rem] font-[300] duration-[.1s] transition-all text-inherit"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div> */}
              <div className="transform hover:translate-y-[-4px]  duration-[.5s] mt-[1rem]">
                <button
                  type="submit"
                  to={``}
                  className="  hover:shadow-lg  py-[1.4rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] font-[400] uppercase border-none outline-none"
                >
                  sign up
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;

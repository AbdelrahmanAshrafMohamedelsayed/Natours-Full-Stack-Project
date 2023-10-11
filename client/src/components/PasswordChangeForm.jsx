import React from "react";
import { Formik, Form } from "formik";
import { TextField } from "../components";
import ChangePassValidate from "../Validations/ChangePass";
import { toast } from "react-toastify";
import { useProfilePasswordUpdate } from "../hooks/useUserData";
import { useDispatch } from "react-redux";
import { userActions } from "../Store/user";
const PasswordChangeForm = () => {
  const dispatch = useDispatch();
  const onSuccess = (data) => {
    // console.log(data);
    // console.log("successssss");
    const token = data?.data?.token;
    const user = data?.data?.data?.user;
    // console.log({ user, token });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(userActions.setToken(token));
    dispatch(userActions.Setuser(user));
    toast.success("Password Updated Successfully");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");

    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate, isLoading, isError, error, isSuccess } =
    useProfilePasswordUpdate(onSuccess, onError);
  const submitHandler = (values, formik) => {
    // reset form
    // console.log("formik");
    // console.log(values);
    const { Currentpassword, password, confirmPassword } = values;
    const data = {
      currentPassword: Currentpassword,
      password,
      passwordConfirm: confirmPassword,
    };
    mutate(data);

    // formik.resetForm();
  };
  const validate = ChangePassValidate;
  return (
    <Formik
      initialValues={{
        Currentpassword: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validate}
      onSubmit={submitHandler}
    >
      {({ values, setFieldValue }) => (
        <div className="px-[3rem] sm:px-[5rem] md:px-[7rem] xl:px-[15rem]">
          <h2 className="max-md:text-[1.8rem] text-[2.2rem] font-[700] mb-[3.5rem] heading-color max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem]">
            PASSWORD CHANGE
          </h2>
          {/* {console.log(formik)} */}
          <Form className="flex flex-col gap-[2.5rem] w-full">
            <TextField
              label="Current password"
              name="Currentpassword"
              type="password"
              placeholder="••••••••"
            />
            <TextField
              label="New password"
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
            <div className="transform hover:translate-y-[-4px]  duration-[.5s] mt-[.5rem] text-right">
              <button
                type="submit"
                to={``}
                className="  hover:shadow-lg  py-[1.4rem] px-[1.8rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] max-md:text-[1.4rem] font-[400] uppercase border-none outline-none max-md:py-[1.2rem] max-md:px-[1.6rem]"
              >
                Save Password
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default PasswordChangeForm;

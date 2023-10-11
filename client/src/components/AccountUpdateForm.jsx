import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { TextField } from "../components";
import UserUpdateValidate from "../Validations/UpdateUser";
import user, { userActions } from "../Store/user";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useProfileUpdate } from "../hooks/useUserData";
const AccountUpdateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSuccess = (data) => {
    // console.log("successssss");
    // const token = data?.data?.token;
    const user = data?.data?.data?.user;
    // localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(userActions.Setuser(user));
    // dispatch(userActions.setToken(token));
    // console.log(data);
    toast.success("Profile Updated Successfully");
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(
      data.response.data.message.split(":")[2] || "Something went wrong!"
    );
  };
  const { mutate, isLoading, isError, error, isSuccess } = useProfileUpdate(
    onSuccess,
    onError
  );
  const [img, setimg] = useState(null);
  // console.log(img);
  const { token } = useSelector((state) => state.user);
  const { user: userData } = useSelector((state) => state.user);
  // console.log(userData.name + "jjjj");
  // const Applydata = (data) => {
  //   // const token = data?.data?.token;
  //   const user = data?.data?.data?.user;
  //   // localStorage.setItem("token", token);
  //   localStorage.setItem("user", JSON.stringify(user));
  //   dispatch(userActions.Setuser(user));
  //   // dispatch(userActions.setToken(token));
  //   // console.log(data);
  //   toast.success("Profile Updated Successfully");
  // };
  // const { response, isLoading, error, sendRequest: AccountUpdate } = useAxios();
  // useEffect(() => {
  //   if (error) {
  //     const err = error.split(":")[2];
  //     toast.error(err);
  //   }
  // }, [error]);
  const [previewImage, setPreviewImage] = useState(null);
  const submitHandler = (values, formik) => {
    // reset form
    // formik.resetForm();
    // console.log("formik");
    // console.log(values);
    // AccountUpdate(
    //   {
    //     url: "http://127.0.0.1:3000/api/v1/users/updateMe",
    //     method: "PATCH",
    //     data: { ...values, photo: img },
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: "Bearer " + token,
    //     },
    //   },
    //   Applydata
    // );
    mutate({ ...values, photo: img });
  };
  const validate = UserUpdateValidate;
  if (userData.name && userData.email) {
    return (
      <Formik
        initialValues={{
          name: `${userData.name}`,
          email: userData.email,
          photo: "",
        }}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue }) => (
          <div className="px-[3rem] sm:px-[5rem] md:px-[7rem] xl:px-[15rem]">
            <h2 className="max-md:text-[1.8rem] text-[2.2rem] font-[700] mb-[3.5rem] heading-color max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem]">
              YOUR ACCOUNT SETTINGS
            </h2>
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
              <div className=" flex items-center gap-[2rem]">
                {/* upload image */}
                <div className="w-[7.5rem] h-[7.5rem] rounded-[50%]">
                  {previewImage && (
                    <img
                      src={previewImage?.preview}
                      alt="user"
                      className="w-full h-full object-cover rounded-[50%]"
                    />
                  )}
                  {userData?.photo && !previewImage && (
                    <img
                      crossOrigin="anonymous"
                      src={`${
                        import.meta.env.VITE_NATOURS_API_BACKEND_URL
                      }/img/users/${userData?.photo}`}
                      alt="user"
                      className="w-full h-full object-cover rounded-[50%]"
                    />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="updateimage"
                    accept="image/*"
                    className="hidden"
                    name="photo"
                    onChange={(event) => {
                      setimg(event.currentTarget.files[0]);
                      setFieldValue("photo", event.currentTarget.files[0]);
                      const url = URL.createObjectURL(
                        event.currentTarget.files[0]
                      );
                      // console.log(url);
                      setPreviewImage({
                        preview: url,
                        raw: event.currentTarget.files[0],
                      });
                    }}
                  />
                  <label
                    htmlFor="updateimage"
                    className=" block text-[#55c57a]
                p-[3px] cursor-pointer duration-[.2s] hover:bg-[#55c57a] hover:text-[#f7f7f7]  hover:shadow-xl border-b-[1px] border-solid border-[#55c57a] text-[1.6rem] hover:transform hover:translate-y-[-3px] hover:scale-[1.02]
                "
                  >
                    Choose new photo
                  </label>
                </div>
              </div>
              <div className="transform hover:translate-y-[-4px]  duration-[.5s] mt-[.5rem] text-right">
                <button
                  type="submit"
                  to={``}
                  className="  hover:shadow-lg  py-[1.4rem] px-[1.8rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] max-md:text-[1.4rem] font-[400] uppercase border-none outline-none max-md:py-[1.2rem] max-md:px-[1.6rem]"
                >
                  {!isLoading && "Save settings"}
                  {isLoading && "Saving..."}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    );
  }
};

export default AccountUpdateForm;

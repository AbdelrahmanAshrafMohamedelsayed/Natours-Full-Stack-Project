import React from "react";
import AccountUpdateForm from "./AccountUpdateForm";
import PasswordChangeForm from "./PasswordChangeForm";

const ProfileBigForm = () => {
  return (
    <div className="basis-[73%]  py-[7rem]  ">
      <AccountUpdateForm />
      <div className="my-[6rem] w-full bg-[#e0e0e0] h-[2px]"></div>
      <PasswordChangeForm />
    </div>
  );
};

export default ProfileBigForm;

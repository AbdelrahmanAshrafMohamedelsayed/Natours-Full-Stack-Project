import { redirect } from "react-router-dom";
import { userActions } from "../Store/user";
import { useDispatch } from "react-redux";

export const LogoutAction = () => {
  const dispatch = useDispatch();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(userActions.Removedata());
  // console.log("hhhhhhhhhhhhhhhhhhhhh");
  return redirect("/");
};

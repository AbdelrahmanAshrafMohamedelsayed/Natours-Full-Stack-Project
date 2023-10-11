import { redirect, useSubmit } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}
export function logoutHandler(e, submit) {
  e.preventDefault();
  submit(null, { action: "/logout", method: "post" });
}
export const getToken = () => {
  // console.log("getToken");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token) {
    return null;
  }
  // const tokenDuration = getTokenDuration();

  // if (tokenDuration < 0) {
  //   return "EXPIRED";
  // }

  return { user, token };
};
export const tokenLoader = () => {
  return getToken();
};
export const tokenCheckLoader = () => {
  const token = getToken();
  if (token) {
    return redirect("/");
  }
  return null;
};
export const tokenCheckLoaderProtected = () => {
  const token = getToken();
  if (!token) {
    return redirect("/login");
  }
  return null;
};

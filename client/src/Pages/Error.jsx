import React from "react";
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  let error = "THE PAGE CAN'T BE FOUND";
  const errorroute = useRouteError();
  if (errorroute?.status === 500) {
    error = errorroute?.data?.message;
  }
  return (
    <div className="errorPage">
      <h1>OOPS!</h1>
      <h2>{error}</h2>
      <div>
        <Link to={"/"}>GO TO HOME</Link>
      </div>
    </div>
  );
};

export default Error;

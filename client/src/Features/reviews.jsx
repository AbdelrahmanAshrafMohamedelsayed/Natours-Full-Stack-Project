import React, { useState, useEffect, memo } from "react";

import { AddReview, Rev } from "../components";
import { useDispatch, useSelector } from "react-redux";

const reviews = ({ list, tourId }) => {
  const [hasReview, sethasReview] = useState(false);
  const [reviewSm, setreviewSm] = useState(null);
  // console.log(list);
  // get the user
  const user = useSelector((state) => state.user)?.user;
  // console.log({ user });
  // check if the list of reviews having a review from the current user
  useEffect(() => {
    list?.forEach((item) => {
      if (item?.user?._id === user?._id) {
        sethasReview(true);
        setreviewSm(item);
      }
    });
  }, [list, user?._id]);

  return (
    <div className=" px-[0rem] py-[calc(5rem+9vw)] background mt-[-9vw] skew-y-[353deg] transform">
      <div className=" flex  items-center gap-[6rem] overflow-hidden scroll-x overflow-x-scroll p-[5rem] scrolll skew-y-[-353deg] transform">
        {list?.map((item, index) => (
          <Rev key={item?.id} item={item} />
        ))}
      </div>
      {user.role === "user" && (
        <AddReview tourId={tourId} hasReview={hasReview} reviewSm={reviewSm} />
      )}
    </div>
  );
};

export default memo(reviews);

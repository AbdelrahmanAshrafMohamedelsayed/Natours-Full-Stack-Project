import React from "react";
import { toast } from "react-toastify";
import { useFetchReviewsuser } from "../hooks/useUserData";
import { Rev } from "../components";

const MyReviews = () => {
  const onSuccess = (data) => {
    // console.log("successssss");
    // console.log(data);
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { isLoading, isError, error, data } = useFetchReviewsuser(
    onSuccess,
    onError
  );
  return (
    <main className="px-[3rem] py-[2rem] md:px-[6rem] md:py-[4rem] 2xl:px-[8rem] 2xl:py-[6rem] bg-[#F7F7F7]">
      <div className="flex items-center  justify-center flex-wrap mx-auto md:justify-between gap-[2rem] ">
        {data &&
          !isLoading &&
          !isError &&
          data?.map((review) => (
            <Rev key={review.id} item={review} my={true} />
          ))}
        {/* {isLoading && <SkeltonCard cards={8} />}
        {data?.length === 0 && !isLoading && !isError && (
          <h1 className="text-3xl font-bold text-center">No Tours Available</h1>
        )} */}
      </div>
    </main>
  );
};

export default MyReviews;

import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { userActions } from "../Store/user";
import { useDispatch } from "react-redux";
import { useAddreview, useEditreview } from "../hooks/useUserData";

const AddReview = ({ tourId, reviewSm, hasReview }) => {
  //   console.log(reviewSm);
  const [hasReviews, sethasReview] = useState(false);
  const [value, setValue] = useState(0);
  const [review, setReview] = useState("");
  const dispatch = useDispatch();
  const onSuccessAdd = (data) => {
    // console.log("successssss");
    // console.log(data);
    toast.success("Review Added Successfully");
    const review = data.data.data.data;
    // setReview(review?.review);
    // setValue(review?.rating);
    sethasReview(true);
  };
  const onErrorAdd = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate: mutateAdd, isLoading: isLoadingAdd } = useAddreview(
    tourId,
    onSuccessAdd,
    onErrorAdd
  );
  const onSuccessEdit = (data) => {
    // console.log("successssss");
    // console.log(data);
    toast.success("Review Edited Successfully");
    const review = data.data.data.data;
    // setReview(review?.review);
    // setValue(review?.rating);
    sethasReview(true);
  };
  const onErrorEdit = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const { mutate: mutateEdit, isLoading: isLoadingEdit } = useEditreview(
    tourId,
    onSuccessEdit,
    onErrorEdit
  );
  useEffect(() => {
    if (reviewSm) {
      setReview(reviewSm?.review);
      setValue(reviewSm?.rating);
    }
    if (hasReview) {
      sethasReview(true);
    }
  }, [reviewSm, hasReview]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate the input values
    if (review.trim().length < 10 || review.trim().length > 1000) {
      toast.error("Please enter a review between 10 and 1000 characters");
      return;
    }
    // validate the rating to be between 1 and 5
    if (value < 1 || value > 5) {
      toast.error("Please enter a rating between 1 and 5");
      return;
    }
    const data = {
      tourId,
      review: {
        review,
        rating: value,
      },
    };
    if (hasReviews) {
      data.id = reviewSm?._id;
      mutateEdit(data);
      return;
    } else {
      mutateAdd(data);
    }
  };
  return (
    <div className="skew-y-[-353deg] transform  flex justify-center items-center ">
      <div className=" mt-[-9vw]  pt-[calc(15rem+9vw)] pb-[11rem] flex justify-center overflow-hidden ">
        <div className="max-w-[90%] w-[105rem]  bg-white rounded-[2rem] py-[3rem] px-[3rem]  shadow-xl overflow-hidden relative ">
          <h2 className="max-md:text-[1.8rem] text-[2.2rem] font-[700] mb-[3rem] heading-color max-sm:text-[1.75rem] max-sm:text-left max-sm:mb-[2.5rem] text-center">
            {hasReviews ? "Update Your Review" : "Add Your Review"}
          </h2>
          <div className="w-full  h-[15rem]   relative">
            <textarea
              className="text-[2rem] w-full h-full border border-primary rounded-[1rem] outline-primary resize-none p-[1rem] text-black"
              value={review}
              onChange={(event) => setReview(event.target.value)}
            ></textarea>
            <Rating
              name="simple-controlled"
              value={value}
              size="large"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                position: "absolute",
                top: "75%",
                right: "2%",
                "& .MuiRating-iconFilled": {
                  color: "#55c57a",
                },
                fontSize: "3rem",
              }}
            />
          </div>
          <div className="transform hover:translate-y-[-4px] duration-[.5s] mt-[1.5rem] text-right ">
            <button
              type="submit"
              onClick={handleSubmit}
              className="  hover:shadow-lg  py-[1.4rem] px-[1.8rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.6rem] max-md:text-[1.4rem] font-[400] uppercase border-none outline-none max-md:py-[1.2rem] max-md:px-[1.6rem]"
            >
              {!hasReviews &&
                (isLoadingAdd ? "Adding Review...." : "Add Review")}
              {hasReviews &&
                (isLoadingEdit ? "Updating Review...." : "Update Review")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;

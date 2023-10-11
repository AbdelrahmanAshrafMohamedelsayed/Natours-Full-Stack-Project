import React from "react";
import logo from "../assets/logo-green-round.png";
import tourimage1 from "../assets/tours/tour-5-1.jpg";
import tourimage2 from "../assets/tours/tour-5-2.jpg";
import tourimage3 from "../assets/tours/tour-5-3.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCheckout } from "../hooks/useUserData";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useFetchBookingTours } from "../hooks/useToursData";

// Replace 'YOUR_PUBLISHABLE_KEY' with your actual Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51NrLVFDyCzXIx5p1wBWKXTbLnPd28soglcZfAreoMwDTjNK4tJ2ifevGFNESpIdSreKvZjgosM4Q6kbUex8YduIB0044dXXOzs"
);
const TourBook = ({ tourId }) => {
  const onSuccess = async (session) => {
    // console.log("successssss");
    // console.log(session);
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };
  const onError = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const {
    isLoading,
    data: session,
    isError,
    error,
    refetch,
  } = useCheckout(tourId, onSuccess, onError);
  // const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user)?.user;
  // console.log(user);
  const onSuccess2 = (data) => {
    // console.log("successssss");
    // console.log(data);
  };
  const onError2 = (data) => {
    // console.log("errdddddddddddddddddddddrrr");
    toast.error(data.response.data.message || "Something went wrong!");
  };
  const {
    isLoading2,
    isError2,
    error2,
    data: userBookedTours,
  } = useFetchBookingTours(onSuccess2, onError2);
  const isBooked = userBookedTours?.some((item) => item.id === tourId);
  // userBookedTours?.map((item) => console.log(item.id === tourId));
  // console.log({ isBooked });
  return (
    <div className="bg-[#F7F7F7] mt-[-9vw]  pt-[calc(15rem+9vw)] pb-[11rem] flex justify-center overflow-hidden ">
      <div className="max-w-[105rem] bg-white rounded-[2rem] py-[9rem] pr-[3rem] pl-[21rem] max-md:pl-[3rem] shadow-xl overflow-hidden relative max-md:max-w-[90%] ">
        <div className="flex justify-between items-center  gap-[1rem] sm:gap-[2rem] md:gap-[2.5rem] max-md:flex-col max-md:text-center">
          <div className=" md:flex  absolute top-1/2 left-[10%] tranform  translate-y-[-50%]  hidden">
            <img
              src={logo}
              alt="logo"
              className=" relative z-[10]  w-[15rem] h-[15rem] rounded-full mr-[1rem] shadow-2xl tranform translate-x-[-100%]"
            />
            <img
              src={tourimage1}
              alt="tour"
              className=" relative z-[9]  w-[15rem] h-[15rem] rounded-full mr-[1rem] shadow-2xl tranform translate-x-[-180%]"
            />
            <img
              src={tourimage2}
              alt="tour"
              className=" relative z-[1]  w-[15rem] h-[15rem] rounded-full mr-[1rem] shadow-2xl tranform translate-x-[-260%]"
            />
          </div>
          <div className="">
            <h2 className="m-0 p-0 text-[2.25rem] font-[700] text-primary mb-[0.7rem] max-md:mb-[2rem]">
              WHAT ARE YOU WAITING FOR?
            </h2>
            <p className="text-[1.9rem] font-[300] text-[#777] max-md:mb-[2rem]">
              10 days. 1 adventure. Infinite memories. Make it yours today!
            </p>
          </div>
          <div className="transform hover:translate-y-[-4px]  duration-[.5s] min-w-fit">
            {!token && (
              <Link
                to={"/login"}
                className="  hover:shadow-lg  py-[1.5rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.5rem] font-[400] uppercase "
              >
                Log in to book a tour!
              </Link>
            )}
            {token && user.role === "user" && (
              <button
                onClick={refetch}
                className="  hover:shadow-lg  py-[1.5rem] px-[3rem] bg-[#55c57a] text-[#f7f7f7] rounded-[10rem] text-[1.5rem] font-[400] uppercase disabled:opacity-50 disabled:cursor-not-allowed "
                disabled={isBooked}
              >
                {!isBooked && (isLoading ? "sending..." : "Book tour now!")}
                {isBooked && "You already booked this tour!"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBook;

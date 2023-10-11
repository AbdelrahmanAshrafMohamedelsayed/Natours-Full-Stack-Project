import { useMutation, useQuery, useQueryClient } from "react-query";
import { request } from "../Axios/axios";

const Login = (user) => {
  return request({
    url: "/users/login",
    method: "post",
    data: user,
    headers: {
      accept: "application/json",
    },
  });
};
const Logout = () => {
  return request({
    url: "/users/logout",
    method: "post",
    headers: {
      accept: "application/json",
    },
  });
};
export const useLogOutUser = (onSuccess, onError) => {
  return useMutation(Logout, {
    onSuccess,
    onError,
  });
};
export const useLoginUser = (onSuccess, onError) => {
  return useMutation(Login, {
    onSuccess,
    onError,
  });
};

const ResetPassword = (user) => {
  const token = user?.token;
  const data = user?.data;
  return request({
    url: `/users/resetPassword/${token}`,
    method: "PATCH",
    data: data,
    headers: {
      accept: "application/json",
    },
  });
};

export const useResetPasswordUser = (onSuccess, onError) => {
  return useMutation(ResetPassword, {
    onSuccess,
    onError,
  });
};

const ForgetPassword = (user) => {
  return request({
    url: "/users/forgotPassword",
    method: "post",
    data: user,
    headers: {
      accept: "application/json",
    },
  });
};

export const useForgetPasswordUser = (onSuccess, onError) => {
  return useMutation(ForgetPassword, {
    onSuccess,
    onError,
  });
};
const SignUp = (user) => {
  return request({
    url: "/users/signup",
    method: "post",
    data: user,
    headers: {
      accept: "application/json",
    },
  });
};
export const useSignUpUser = (onSuccess, onError) => {
  return useMutation(SignUp, {
    onSuccess,
    onError,
  });
};

const UpdateUserInfo = (user) => {
  return request({
    url: "/users/updateMe",
    method: "PATCH",
    data: user,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const useProfileUpdate = (onSuccess, onError) => {
  return useMutation(UpdateUserInfo, {
    onSuccess,
    onError,
  });
};
const UpdateUserPassword = (user) => {
  return request({
    url: "/users/updateMyPassword",
    method: "PATCH",
    data: user,
  });
};
export const useProfilePasswordUpdate = (onSuccess, onError) => {
  return useMutation(UpdateUserPassword, {
    onSuccess,
    onError,
  });
};
const AddReview = (user) => {
  const tourId = user?.tourId;
  const review = user?.review;
  return request({
    url: `/tours/${tourId}/reviews`,
    method: "POST",
    data: review,
  });
};
export const useAddreview = (tourId, onSuccess, onError) => {
  const queryClient = useQueryClient();
  return useMutation(AddReview, {
    onSuccess,
    onMutate: async (review) => {
      await queryClient.cancelQueries(["tour", tourId]);
      const previousReviews = queryClient.getQueryData(["tour", tourId]);
      // add the new review to the previous reviews
      // previousReviews?.data?.data?.data?.reviews?.push(review);
      // console.log({ aaa: previousReviews?.data?.data?.data?.reviews });

      return { previousReviews };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["tour", tourId], context.previousReviews);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tour", tourId]);
    },
  });
};
const EditReview = (user) => {
  const reviewId = user?.id;
  const review = user?.review;
  return request({
    url: `/reviews/${reviewId}`,
    method: "PATCH",
    data: review,
  });
};
export const useEditreview = (tourId, onSuccess, onError) => {
  const queryClient = useQueryClient();

  return useMutation(EditReview, {
    onSuccess,
    onMutate: async (review) => {
      // console.log({ review });
      await queryClient.cancelQueries(["tour", tourId]);
      const previousReviews = queryClient.getQueryData(["tour", tourId]);
      // console.log({ previousReviews });
      // console.log({ old: previousReviews?.data?.data?.data?.reviews });
      // add the new review to the previous reviews
      // const newReviews = previousReviews?.data?.data?.data?.reviews?.map(
      //   (item) => {
      //     if (item._id === review?.id) {
      //       return {
      //         ...item,
      //         review: review?.review?.review,
      //         rating: review?.review?.rating,
      //       };
      //     } else {
      //       return item;
      //     }
      //   }
      // );
      // const newTour = {
      //   ...previousReviews?.data?.data?.data,
      //   reviews: newReviews,
      // };

      // console.log({ newTour });
      // console.log({ newReviews });

      return { previousReviews };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["tour", tourId], context.previousReviews);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tour", tourId]);
    },
  });
};
const Checkout = (id) => {
  return request({ url: `/bookings/checkout-session/${id}` });
};

export const useCheckout = (id, onSuccess, onError) => {
  return useQuery(["Checkout", id], () => Checkout(id), {
    onSuccess,
    onError,
    enabled: false,
    select: (data) => {
      return data?.data?.session;
    },
  });
};
const BookTour = (user) => {
  return request({
    url: "/bookings/createBookingCheckout",
    method: "post",
    data: user,
    headers: {
      accept: "application/json",
    },
  });
};

export const useBookTour = (onSuccess, onError) => {
  return useMutation(BookTour, {
    onSuccess,
    onError,
  });
};

const FetchReviewsuser = () => {
  return request({ url: `/reviews/userReviews` });
};

export const useFetchReviewsuser = (onSuccess, onError) => {
  return useQuery(["Reviewsuser"], FetchReviewsuser, {
    onSuccess,
    onError,
    select: (data) => {
      return data?.data?.data?.Reviews;
    },
  });
};

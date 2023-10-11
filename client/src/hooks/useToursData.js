import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import { request } from "../Axios/axios";
const fetchTours = (page = 1) => {
  return request({ url: `/tours?limit=12&page=${page}` });
};
export const useToursDataFetch = (onSuccess, onError) => {
  return useInfiniteQuery(
    "tours",
    ({ pageParam = 1 }) => fetchTours(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = lastPage?.data?.numberOfpages;
        const nextPage = allPages.length + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    }
  );
};

const fetchTour = ({ queryKey }) => {
  const tourId = queryKey[1];
  return request({ url: `/tours/${tourId}` });
};
export const useOneTourFetch = (tourId) => {
  const queryClient = useQueryClient();

  return useQuery(["tour", tourId], fetchTour, {
    select: (data) => data?.data?.data?.data,
    initialData: () => {
      const tours = queryClient.getQueryData("tours");
      const tour = tours?.pages
        ?.reduce((acc, page) => {
          return [...acc, ...page.data.data.data];
        }, [])
        ?.find((tour) => tour._id === tourId);

      if (tour) {
        // console.log("Tour found:", tour);
        return tour;
      } else {
        // console.log("Tour not found");
        return undefined;
      }
    },
  });
};

const FetchBookingTours = () => {
  return request({ url: `/bookings/getBookingToursOfUser` });
};

export const useFetchBookingTours = (onSuccess, onError) => {
  return useQuery(["BookingTours"], FetchBookingTours, {
    onSuccess,
    onError,
    select: (data) => {
      return data?.data?.tours;
    },
  });
};

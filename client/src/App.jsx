import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Bookings,
  Error,
  ForgetPassword,
  HomePage,
  Login,
  MyReviews,
  Profile,
  ResetPassword,
  RootLayout,
  SignUp,
  Tour,
} from "./Pages";
// import { loaderTours } from "./Pages/HomePage";
import "react-toastify/dist/ReactToastify.css";
import { LogoutAction } from "./Pages/logout";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import {
  getToken,
  tokenCheckLoader,
  tokenCheckLoaderProtected,
} from "./util/Auth";
const queryClient = new QueryClient();

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      id: "root",
      // loader: getToken,
      children: [
        {
          index: true,
          element: <HomePage />,
          // loader: loaderTours,
          errorElement: <Error />,
          // loader: loaderTours,
          id: "home",
        },
        { path: "*", element: <Error /> },
        { path: "tour/:id", element: <Tour /> },
        // { path: "cart", element: <CartPage /> },
        { path: "login", element: <Login />, loader: tokenCheckLoader },
        { path: "me", element: <Profile />, loader: tokenCheckLoaderProtected },
        { path: "signup", element: <SignUp />, loader: tokenCheckLoader },
        {
          path: "mybookings",
          element: <Bookings />,
          loader: tokenCheckLoaderProtected,
        },
        {
          path: "myreviews",
          element: <MyReviews />,
          loader: tokenCheckLoaderProtected,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
          loader: tokenCheckLoader,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
          loader: tokenCheckLoader,
        },
        { path: "logout", action: LogoutAction },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <RouterProvider router={router} />
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

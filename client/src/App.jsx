import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Error,
  HomePage,
  Login,
  Profile,
  RootLayout,
  SignUp,
  Tour,
} from "./Pages";
import { loaderTours } from "./Pages/HomePage";
import "react-toastify/dist/ReactToastify.css";
import { LogoutAction } from "./Pages/logout";
import {
  getToken,
  tokenCheckLoader,
  tokenCheckLoaderProtected,
} from "./util/Auth";

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
        { path: "logout", action: LogoutAction },
      ],
    },
  ]);
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

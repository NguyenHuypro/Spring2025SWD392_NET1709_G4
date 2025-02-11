import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layout/user";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <h1>Home page</h1>,
      },
      {
        path: "about",
        element: <h1>About page</h1>,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

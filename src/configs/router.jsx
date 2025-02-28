import { createBrowserRouter, Navigate } from "react-router-dom";
import UserLayout from "../layout/user";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";
import Home from "../pages/user/home";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/counterSlice";
import { toast } from "react-toastify";
import MyCars from "../pages/user/my-cars";
import Profile from "../pages/user/profile";
import History from "../pages/user/history";
import Package from "../pages/user/package";
import ForgotPassword from "../pages/authentication/forgot-password";
import ResetPassword from "../pages/authentication/reset-password";

export const ProtectedRouteUser = ({ children }) => {
  const user = useSelector(selectUser);
  if (user?.role !== "CUSTOMER") {
    toast.error("Bạn không có quyền thực hiện hành động này");
    return <Navigate to={"/"} />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "my-cars",
        element: (
          <ProtectedRouteUser>
            <MyCars />
          </ProtectedRouteUser>
        ),
      },

      {
        path: "/profile",
        element: (
          <ProtectedRouteUser>
            <Profile />
          </ProtectedRouteUser>
        ),
      },
      {
        path: "/history",
        element: (
          <ProtectedRouteUser>
            <History />
          </ProtectedRouteUser>
        ),
      },
      {
        path: "/package",
        element: (
          <ProtectedRouteUser>
            <Package />
          </ProtectedRouteUser>
        ),
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
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
]);

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
import Checkout from "../pages/user/checkout";
import AdminLayout from "../layout/admin";
import StaffManagement from "../pages/admin/manage-staff";
import BookingManagement from "../pages/admin/manage-booking";
import UserManagement from "../pages/admin/manage-user";
import ServiceManagement from "../pages/admin/manage-service";
import PackageManagement from "../pages/admin/manage-package";
import StaffLayout from "../layout/staff";
import ReceptionistLayout from "../layout/receptionist";
import ReceptionistBooking from "../pages/receptionist/checkorder";


export const ProtectedRouteUser = ({ children }) => {
  const user = useSelector(selectUser);
  if (user?.role !== "CUSTOMER") {
    toast.error("Bạn không có quyền thực hiện hành động này");
    return <Navigate to={"/"} />;
  }
  return children;
};

export const ProtectedRouteAdmin = ({ children }) => {
  const user = useSelector(selectUser);
  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    toast.error("Bạn không có quyền thực hiện hành động này");
    return <Navigate to={"/"} />;
  }
  return children;
};

export const ProtectedRouteStaff = ({ children }) => {
  const user = useSelector(selectUser);
  if (user?.role !== "STAFF") {
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
    path: "/admin",
    element: (
      <ProtectedRouteAdmin>
        <AdminLayout />
      </ProtectedRouteAdmin>
    ),
    children: [
      {
        path: "/admin/staff",
        element: <StaffManagement />,
      },
      {
        path: "/admin/booking",
        element: <BookingManagement />,
      },
      {
        path: "/admin/user",
        element: <UserManagement />,
      },
      {
        path: "/admin/service",
        element: <ServiceManagement />,
      },
      {
        path: "/admin/package",
        element: <PackageManagement />,
      },
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRouteStaff>
        <StaffLayout />
      </ProtectedRouteStaff>
    ),
  },
  {
    path: "/receptionist",
    element: (
      <ProtectedRouteReceptionist>
        <ReceptionistLayout />
      </ProtectedRouteReceptionist>
    ),
    children: [
      {
        path: "/receptionist/checkorder",
        element: <ReceptionistBooking />,
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
  {
    path: "checkout",
    element: <Checkout />,
  },
]);

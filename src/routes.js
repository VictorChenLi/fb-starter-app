import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import User from "./pages/User";
import Login from "./pages/Login";
import NotFound from "./pages/Page404";
import DashboardApp from "./pages/DashboardApp";
import GuestGuard from "./components/GuestGuard";
import TimeTracking from "./pages/TimeTracking";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "app", element: <DashboardApp /> },
        { path: "user", element: <User /> },
        { path: "timetracking", element: <TimeTracking /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        {
          path: "/",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

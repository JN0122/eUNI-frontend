import Login from "./pages/global/Login.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/global/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import NotFound from "./pages/global/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileInfo from "./pages/profile/ProfileInfo.jsx";
import ProfilePassword from "./pages/profile/ProfilePassword.jsx";
import Users from "./pages/users/Users.jsx";
import { DrawerProvider } from "./hooks/useDrawer.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import { UserProvider } from "./hooks/useUser.jsx";
import EditSchedule from "./pages/schedule/EditSchedule.jsx";
import { App, ConfigProvider } from "antd";
import EditScheduleClasses from "./pages/schedule/EditScheduleClasses.jsx";
import localePL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import updateLocale from "dayjs/plugin/updateLocale";
import InternalError from "./pages/global/InternalError.jsx";
import Register from "./pages/global/Register.jsx";
import NotLoggedInRoute from "./routes/NotLoggedInRoute.jsx";

dayjs.extend(updateLocale);
const config = {
    weekStart: 1
};
dayjs.updateLocale("en", config);
dayjs.updateLocale("pl", config);

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <InternalError />,
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/profile",
                element: <Profile />,
                children: [
                    {
                        path: "info",
                        element: <ProfileInfo />
                    },
                    {
                        path: "password",
                        element: <ProfilePassword />
                    }
                ]
            },
            {
                path: "/users",
                element: (
                    <DrawerProvider>
                        <Users />
                    </DrawerProvider>
                )
            },
            {
                path: "/schedule",
                element: <Schedule />
            },
            {
                path: "/edit-schedule",
                element: <EditSchedule />,
                children: [
                    {
                        path: "classes",
                        element: <EditScheduleClasses />
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        element: (
            <NotLoggedInRoute>
                <Login />
            </NotLoggedInRoute>
        )
    },
    {
        path: "/register",
        element: (
            <NotLoggedInRoute>
                <Register />
            </NotLoggedInRoute>
        )
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

function AppMain() {
    return (
        <ConfigProvider locale={localePL}>
            <App>
                <AuthProvider>
                    <UserProvider>
                        <RouterProvider router={router} />
                    </UserProvider>
                </AuthProvider>
            </App>
        </ConfigProvider>
    );
}

export default AppMain;

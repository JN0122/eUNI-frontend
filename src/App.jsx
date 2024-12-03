import Login from "./pages/Login.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileInfo from "./pages/profile/ProfileInfo.jsx";
import ProfilePassword from "./pages/profile/ProfilePassword.jsx";
import Users from "./pages/users/Users.jsx";
import { DrawerProvider } from "./hooks/useDrawer.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import { UserProvider } from "./hooks/useUser.jsx";
import EditSchedule from "./pages/schedule/EditSchedule.jsx";
import { App, ConfigProvider } from "antd";
import Assignments from "./pages/schedule/Assignments.jsx";
import Classes from "./pages/schedule/Classes.jsx";
import localePL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
const config = {
    weekStart: 1
};
dayjs.updateLocale("en", config);
dayjs.updateLocale("pl", config);

const router = createBrowserRouter([
    {
        path: "/",
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
                        path: "assignments",
                        element: <Assignments />
                    },
                    {
                        path: "classes",
                        element: <Classes />
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
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

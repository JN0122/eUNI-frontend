import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileInfo from "./pages/profile/ProfileInfo.jsx";
import ProfilePassword from "./pages/profile/ProfilePassword.jsx";
import Users from "./pages/users/Users.jsx";
import { DrawerProvider } from "./context/DrawerContext.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import EditSchedule from "./pages/schedule/EditSchedule.jsx";
import { App, ConfigProvider } from "antd";

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
                element: <EditSchedule />
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
        <ConfigProvider>
            <App>
                <AuthProvider>
                    <StudentProvider>
                        <RouterProvider router={router} />
                    </StudentProvider>
                </AuthProvider>
            </App>
        </ConfigProvider>
    );
}

export default AppMain;

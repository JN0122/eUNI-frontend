import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileInfo from "./pages/profile/ProfileInfo.jsx";

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
                        element: <ProfileInfo />,
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;

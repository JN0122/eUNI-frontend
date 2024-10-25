import Login from "./pages/Login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import LoginOrDashboard from "./routes/LoginOrDashboard.jsx";

const router = createBrowserRouter([
      {
            path: "/",
            element: <LoginOrDashboard/>
      },
      {
            path: "/login",
          element: <Login />,
      },
      {
            path: "/dashboard",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" />,
      }
])

function App() {
      return (
          <AuthProvider>
                <RouterProvider router={router} />
          </AuthProvider>
      );
}

export default App;

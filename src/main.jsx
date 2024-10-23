import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js";
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback="loading">
        <AuthProvider>
            <App />
        </AuthProvider>
    </Suspense>
  </StrictMode>
);

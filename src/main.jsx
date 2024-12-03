import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles.css";
import "./lib/i18n/i18n.js";

createRoot(document.getElementById("root")).render(
    <Suspense fallback="loading">
        <App />
    </Suspense>
);

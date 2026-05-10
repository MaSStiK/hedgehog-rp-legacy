import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./components/Context"
// import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

createRoot(document.getElementById("root")).render(
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <DataProvider>
            <Router>
                <App />
            </Router>
        </DataProvider>
    // </GoogleOAuthProvider>
);
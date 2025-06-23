import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./components/Context"

import App from "./App";

createRoot(document.getElementById("root")).render(
    <DataProvider>
        <Router>
            <App />
        </Router>
    </DataProvider>
);
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext";
import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContext>
        <App />
      </UserContext>
    </BrowserRouter>
  </React.StrictMode>
);

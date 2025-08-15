import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LeaveProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LeaveProvider>
    </AuthProvider>
  </React.StrictMode>
);

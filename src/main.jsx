import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OrganizationProvider } from "./context/OrganizationContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <OrganizationProvider>
      <App />
    </OrganizationProvider>
  </BrowserRouter>
);

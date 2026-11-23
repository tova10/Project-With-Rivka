import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CacheProvider from "./context/CacheContext";
import UserProvider from "./context/UserContext";
import App from "./App";
import "./css/index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CacheProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CacheProvider>
  </BrowserRouter>
);

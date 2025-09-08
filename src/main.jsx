import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import Loading from "./components/Loading.jsx";

// Lazy load App
const App = lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Suspense fallback={<Loading/>}>
        <App />
      </Suspense>
    </Router>
  </StrictMode>
);
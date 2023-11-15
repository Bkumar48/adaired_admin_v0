import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClientProvider } from "./utils/queryClient.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

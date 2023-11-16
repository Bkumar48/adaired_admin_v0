import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { queryClient, QueryClientProvider } from "./utils/QueryClient/queryClient.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

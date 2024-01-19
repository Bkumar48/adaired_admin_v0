import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Layout from "./layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Set up a QueryClient
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <div>
      <Router>
        <Layout />
      </Router>
    </div>
    </QueryClientProvider>
  );
};

export default App;

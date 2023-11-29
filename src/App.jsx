import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Layout from "./layout/Layout";


const App = () => {
  return (
    <div>
      <Router>
        <Layout />
      </Router>
    </div>
  );
};

export default App;

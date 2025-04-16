import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import LoadingFetch from "./components/LoadingFetch/LoadingFetch";
axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_API;
axios.defaults.withCredentials = true;
function App() {
  const route = useRoutes(routes);
  return (
    <>
      {route}
      <LoadingFetch />
      <ToastContainer autoClose={1500} />
    </>
  );
}

export default App;

import Navbar from "./pages/navbar";
import Header from "./pages/header";
import Video from "./pages/video";
import { RouterProvider } from "react-router-dom";
import router from "./Router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;

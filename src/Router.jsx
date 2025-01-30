import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Video from "./pages/video";
import Sensor from "./pages/sensor";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";

// auth
import AuthGuard from "./components/auth/AuthGuard";
import AdminGuard from "./components/auth/AdminGuard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // root ,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard>
            <Video />
          </AuthGuard>
        ),
      },
      {
        path: "/sensor",
        element: (
          <AuthGuard>
            <AdminGuard>
              <Sensor />
            </AdminGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/Sign-in",
        element: <Login />,
      },

      // 404 not found route
      {
        path: "*",
        element: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            404 Not found
          </div>
        ),
      },
    ],
  },
]);

export default router;

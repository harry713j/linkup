import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home, Signup, Login } from "@/pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </AuthProvider>
  </StrictMode>
);

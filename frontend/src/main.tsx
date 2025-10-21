import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "@/pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <h1>Sign up</h1>,
  },
  {
    path: "/login",
    element: <h1>Log in</h1>,
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

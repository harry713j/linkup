import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home, Signup, Login, Chat } from "@/pages/index";

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
  {
    path: "/chat",
    element: <Chat />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);

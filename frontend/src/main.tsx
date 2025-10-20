import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import {createBrowserRouter, RouterProvider} from "react-router"
import {Home} from "@/pages/index"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

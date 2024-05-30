import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom'
import Layout from './layouts/layouts'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import AddHotel from './pages/AddHotel'
import MyHotels from './pages/MyHotels'
import EditHotel from './pages/EditHotel'
import Search from './pages/Search'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <p>Home Page</p>
      },
      {
        path: "search",
        element: <Search/>,
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "sign-in",
        element: <SignIn />
      },
      {
        path: "add-hotel",
        element: <AddHotel />,
        loader: async () => {
          const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include"
          })

          if (!response.ok) {
            return redirect("/sign-in")
          }

          return null
        }
      },
      {
        path: "my-hotels",
        element: <MyHotels />,
        loader: async () => {
          const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include"
          })

          if (!response.ok) {
            return redirect("/sign-in")
          }

          return null
        }
      },
      {
        path: "edit-hotel/:hotelId",
        element: <EditHotel />,
        loader: async () => {
          const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include"
          })

          if (!response.ok) {
            return redirect("/sign-in")
          }

          return null
        }
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to={"/"} />
  }
])

const App = () => {

  return <RouterProvider router={router} />
}

export default App
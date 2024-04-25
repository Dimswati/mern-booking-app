import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './layouts/layouts'
import Register from './pages/Register'
import SignIn from './pages/SignIn'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <p>Home Page</p>
      },
      {
        path: "search",
        element: <p>Search Page</p>,
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "sign-in",
        element: <SignIn/>
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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import JavascriptCompiler from "./pages/JSEditor";
import PythonCompiler from "./pages/PythonEditor";
import Login from "./pages/Login";
import { createRoot } from "react-dom/client";
import { authUserInfo } from "./context/AuthContext";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />

  },
  {
    path: "/javascript",
    element: <JavascriptCompiler />
  },
  {
    path: "/python",
    element: <PythonCompiler />

  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);


createRoot(document.getElementById('root')!).render(


  <RouterProvider router={Routes} />
); 
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import JavascriptCompiler from "./pages/JSEditor";
import PythonCompiler from "./pages/PythonEditor";
import JavaCompiler from "./pages/JavaEditor";
import HTMLCompiler from "./pages/HTMLEditor";
import { createRoot } from "react-dom/client";
import Settings from "./pages/Settings";

const Routes = createBrowserRouter([
  {
    // BUG FIX / FEATURE: root URL hit karne par ab seedha /python pe redirect
    path: "/",
    element: <Navigate to="/python" replace />,
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
    path: "/java",
    element: <JavaCompiler />
  },
  {
    path: "/html",
    element: <HTMLCompiler />
  },
  {
    path: "/setting",
    element: <Settings />
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);


createRoot(document.getElementById('root')!).render(
  <RouterProvider router={Routes} />
);

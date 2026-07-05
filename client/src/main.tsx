import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import JavascriptCompiler from './pages/JSEditor.tsx'
import PythonCompiler from './pages/PythonEditor.tsx'


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
  }
])



createRoot(document.getElementById('root')!).render(


  <RouterProvider router={Routes} />

  

)

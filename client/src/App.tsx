import Navbar from "./components/Navbar/Navbar"
import './App.css'
import Editor from "./components/Code/CodeEditor"
import { useEffect } from "react"
import api from "./services/api"
import { Demo } from "./components/Demo"
const App = () => {

  useEffect(() => {
    api.get("/")
      .then((res) => console.log(res))
      .catch((err) => console.log("Error: ", err))
  }, [])

  return (
    <>

    {/* <Demo/> */}

      <Navbar />
      <Editor />
    </>
  )
}

export default App
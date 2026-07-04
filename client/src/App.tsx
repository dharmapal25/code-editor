import Navbar from "./components/Navbar/Navbar"
import './App.css'
import Editor from "./components/Code/CodeEditor"
import { useEffect } from "react"
import api from "./services/api"
const App = () => {

  useEffect(() => {
    api.get("/")
      .then((res) => console.log(res))
      .catch((err) => console.log("Error: ", err))
  }, [])

  return (
    <>

      <Navbar />
      <Editor />

    </>
  )
}

export default App
import CodeEditor from '../components/Code/CodeEditor'
import Navbar from '../components/Navbar/Navbar'

function JavaEditor() {

  const info = {
    language: "java",
    fileName: "Main.java",
  }

  return (
    <div>
      <Navbar/>
      <CodeEditor info={info} />
    </div>
  )
}

export default JavaEditor

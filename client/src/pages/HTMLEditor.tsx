import CodeEditor from '../components/Code/CodeEditor'
import Navbar from '../components/Navbar/Navbar'

function HTMLEditor() {

  const info = {
    language: "html",
    fileName: "index.html",
  }

  return (
    <div>
      <Navbar/>
      <CodeEditor info={info} />
    </div>
  )
}

export default HTMLEditor

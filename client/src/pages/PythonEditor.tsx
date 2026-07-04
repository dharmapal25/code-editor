import React from 'react'
import Compiler from '../Routes/Compiler'
import CodeEditor from '../components/Code/CodeEditor'

function PythonEditor() {
  
  const pythonInfo = {
    language : "python",
    fileName : "main.py",
  }

  return (
    <div>
        <h1>Python Compiler</h1>
        <Compiler/>
        <CodeEditor pythonInfo={pythonInfo} />
    </div>
  )
}

export default PythonEditor
import React from 'react'
import Compiler from '../Routes/Compiler'
import CodeEditor from '../components/Code/CodeEditor'

function JSEditor() {

  const info = {
    language : "javascript",
    fileName : "main.js",
  }

  return (
    <div>
        <h1>JavaScript Compiler</h1>
        <Compiler/>
        <CodeEditor info={info} />
    </div>
  )
}

export default JSEditor
import React from 'react'
import CompilersRoute from '../Routes/Compilers.Route'
import CodeEditor from '../components/Code/CodeEditor'

function JSEditor() {

  const info = {
    language : "javascript",
    fileName : "main.js",
  }

  return (
    <div>
        <h1>JavaScript Compiler</h1>
        <CompilersRoute/>
        <CodeEditor info={info} />
    </div>
  )
}

export default JSEditor
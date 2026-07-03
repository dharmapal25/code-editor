import React, { useRef } from 'react';

import Editor from '@monaco-editor/react';

export function Demo() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <>
      {/* <button onClick={showValue}>Show value</button> */}
      <Editor
        // height="20vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </>
  );
}
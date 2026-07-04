import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { BiRefresh, BiRightArrow } from 'react-icons/bi';
import './Editor.css';
import api from '../../services/api';

function CodeEditor() {
const [outputCode, setoutputCode] = useState("");
    
    const editorRef = useRef<any>(null); 
    const runCode = () => {
        if (!editorRef.current) return;
        
        const currentCode = editorRef.current.getValue();
        console.log('Sending Code to API:', currentCode);

        api.post("/run", { code: currentCode })
            .then((response) => setoutputCode(response.data.output))
            .catch(err => console.log(err));
    };

    function handleEditorDidMount(editor:any, monaco:any) {
        editorRef.current = editor;

        editor.addAction({
            id: 'run-code-shortcut',
            label: 'Run Code',
            keybindings: [
                monaco.KeyMod.Shift | monaco.KeyCode.Enter
            ],
            run: () => {
                runCode();
            }
        });
    }

    // Output clear handler
    const clearOutput = () => {
        setoutputCode("");
    };

    return (
        <div className='editor__container'>

            {/* INPUT SECTION */}
            <div className="input__container">
                <div className="input__header">
                    <span className="file_name">main.js</span>
                    <button className='run__button' onClick={runCode} title='Shift + Enter' >
                        <BiRightArrow /> Run
                    </button>
                </div>

                <div className="input__body">
                    <Editor
                        height="80vh" 
                        defaultLanguage="javascript"
                        defaultValue="// Write your javascript code here..."
                        onMount={handleEditorDidMount}
                        theme='vs-dark' 
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>

            {/* OUTPUT SECTION */}
            <div className="output__container">
                <div className="output__header">
                    <span className="headline">Output</span>
                    <button className='run__button' onClick={clearOutput}>
                        <BiRefresh fontSize={20} />
                    </button>
                </div>

                <div className="output__body">
                    <textarea 
                        className='output__textarea code-section' 
                        value={outputCode} 
                        readOnly 
                        placeholder="Click Run or press Shift+Enter to see the output here..."
                    />
                </div>
            </div>
        </div>
    );
}

export default CodeEditor;
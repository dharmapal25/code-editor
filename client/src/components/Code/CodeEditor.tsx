import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { BiRefresh, BiRightArrow } from 'react-icons/bi';
import './Editor.css';
import api from '../../services/api';

function CodeEditor() {
    const [outputCode, setoutputCode] = useState("");
    const editorRef = useRef(null);

    // Jab 'Run' button click hoga
    const runCode = () => {
        if (!editorRef.current) return;

        // Monaco Editor se current code uthane ka sahi tarika:
        const currentCode: any = editorRef.current.getValue();
        console.log('Sending Code to API:', currentCode);

        // API Call
        api.post("/run", { code: currentCode })
            .then((response) => {
                setoutputCode(response.data.output);
            })
            .catch((err) => {
                console.log(err);
                setoutputCode("Error running code: " + err.message);
            });
    };

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    // Output clear karne ke liye refresh button handler
    const clearOutput = () => {
        setoutputCode("");
    };

    return (
        <div className='editor__container'>
            {/* INPUT SECTION */}
            <div className="input__container">
                <div className="input__header">
                    <span className="file_name">main.js</span>
                    <button className='run__button' onClick={runCode}>
                        <BiRightArrow /> Run
                    </button>
                </div>

                <div className="input__body">
                    <Editor
                        height="80vh" // Aapki layout ke hisab se 80vh ya 100% fit rahega
                        defaultLanguage="javascript"
                        defaultValue="// Write your javascript code here..."
                        onMount={handleEditorDidMount}
                        theme='vs-dark' // Corrected theme name
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
                        readOnly // Output box ko readOnly banaya taaki user edit na kar sake
                        placeholder="Click Run to see the output here..."
                    />
                </div>
            </div>
        </div>
    );
}

// Corrected Export Statement
export default CodeEditor;
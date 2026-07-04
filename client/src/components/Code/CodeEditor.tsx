import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { BiRightArrow } from 'react-icons/bi';
import './Editor.css';
import { javascriptCompiler } from '../../services/Languages/Javascript';
import { MdDelete } from 'react-icons/md';
import { pythonCompiler } from '../../services/Languages/Python';

// function CodeEditor({ info }: { info: { language: string; fileName: string } }) {
function CodeEditor({ info, pythonInfo }: { info?: { language: string; fileName: string }; pythonInfo?: { language: string; fileName: string } }) {
    const [outputCode, setoutputCode] = useState("");

    const editorRef = useRef<any>(null);

    const runCode = () => {
        if (!editorRef.current) return;

        const currentCode = editorRef.current.getValue();
        console.log('Sending Code to API:', currentCode);

        // Javascript Compiler
        javascriptCompiler(currentCode)
            .then((response: any) => setoutputCode(response.data.output))
            .catch((error) => console.error("Error occurred while compiling JavaScript code:", error));

        // Python Compiler
        pythonCompiler(currentCode)
            .then((response: any) => setoutputCode(response.data.output))
            .catch((error) => console.error("Error occurred while compiling Python code:", error));
    };

    function handleEditorDidMount(editor: any, monaco: any) {
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
                    <span className="file_name">{info?.fileName || pythonInfo?.fileName}</span>
                    <button className='run__button' onClick={runCode} title='Shift + Enter' >
                        <BiRightArrow /> Run
                    </button>
                </div>

                <div className="input__body">
                    <Editor
                        height="80vh"
                        defaultLanguage={info?.language || pythonInfo?.language}
                        defaultValue={`// Write your ${info?.language || pythonInfo?.language} code here...`}
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
                        <MdDelete fontSize={20} />
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

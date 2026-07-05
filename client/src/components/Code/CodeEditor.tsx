import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { BiMenu, BiRightArrow } from 'react-icons/bi';
import './Editor.css';
import { javascriptCompiler } from '../../services/Languages/Javascript';
import { MdDelete } from 'react-icons/md';
import { pythonCompiler } from '../../services/Languages/Python';
import Menu from '../../pages/Menu';

function CodeEditor({ info, pythonInfo }: { info?: { language: string; fileName: string }; pythonInfo?: { language: string; fileName: string } }) {

    console.log(info, pythonInfo);

    const [outputCode, setoutputCode] = useState("");
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const editorRef = useRef<any>(null);

    function menuToggle() {
        setMenuOpen(!menuOpen)
    }

    const runCode = () => {

        if (!editorRef.current) return;

        const currentCode = editorRef.current.getValue();
        console.log('Sending Code to API:', currentCode);

        if (info?.language) {
            // Javascript Compiler
            javascriptCompiler(currentCode)
                .then((response: any) => setoutputCode(response.data.output))
                .catch((error) => console.error("Error occurred code:", error));
        }
        else if (pythonInfo?.language) {

            // Python Compiler
            pythonCompiler(currentCode)
                .then((response: any) => setoutputCode(response.data.output))
                .catch((error) => console.error("Error occurred code:", error));
        }

        else {
            alert("ERROR")
        }
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

    let menuInfo = {
        menu : menuOpen
    }

    return (
        <div className='editor__container'>

            {/* INPUT SECTION */}
            <div className="input__container">
                <div className="input__header">

                    <BiMenu style={{ fontSize: "40px", padding: "5px" }} onClick={menuToggle} />

                    <Menu Toggle = { menuInfo } />
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

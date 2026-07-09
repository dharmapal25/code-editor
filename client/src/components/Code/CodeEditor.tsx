import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { VscDownload } from 'react-icons/vsc';
import { MdDelete } from 'react-icons/md';
import { BiFullscreen, BiMenu, BiRightArrow } from 'react-icons/bi';
import { javascriptCompiler } from '../../services/Languages/Javascript';
import { pythonCompiler } from '../../services/Languages/Python';
import { javaCompiler } from '../../services/Languages/Java';
import Menu from '../../pages/Menu';
import './Editor.css';
import { CgClose } from 'react-icons/cg';
import { EDITOR_SETTINGS_KEY, type EditorSettings } from '../../pages/Settings';

interface Info {
    language: string;
    fileName: string;
}

const DEFAULT_TEMPLATES: Record<string, string> = {
    javascript: `// Write your javascript code here...`,
    python: `# Write your python code here...`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
        /* Internal CSS */
        body {
            font-family: sans-serif;
            background: #111;
            color: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>

    <script>
        // Internal JS
        console.log("Hello from script tag");
    </script>
</body>
</html>`,
};

function CodeEditor({ info }: { info: Info }) {

    const [outputCode, setoutputCode] = useState("");
    const [htmlPreview, setHtmlPreview] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [IsOutput, setIsOutput] = useState<boolean>(false);
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorSettings] = useState<EditorSettings>(() => {
    try {
        const raw = localStorage.getItem(EDITOR_SETTINGS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return { fontSize: 14, fontFamily: 'Consolas, monospace' };
});



    const activeLanguage = info.language;
    const isHtml = activeLanguage === "html";
    const storageKey = `code_editor_${activeLanguage}`;
    const defaultCode = DEFAULT_TEMPLATES[activeLanguage] || `// Write your ${activeLanguage} code here...`;

    function IsOutputOpen() {
        setIsOutput(!IsOutput)
    }

    const getInitialCode = () => {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                return parsed.code;
            } catch (e) {
                return defaultCode;
            }
        }
        return defaultCode;
    };

    function menuToggle() {
        setMenuOpen(!menuOpen)
    }

    const runCode = async () => {
        if (!editorRef.current) return;

        const currentCode = editorRef.current.getValue();

        if (!currentCode.trim()) {
            setoutputCode("Please write some code before running.");
            return;
        }

        // HTML: no server needed
        if (isHtml) {
            setHtmlPreview(currentCode);
            IsOutputOpen();
            return;
        }

        setIsRunning(true);
        setoutputCode("Running...");

        try {
            IsOutputOpen()

            if (activeLanguage === "javascript") {
                const response = await javascriptCompiler(currentCode);
                setoutputCode(response?.output ?? "No output");

            } else if (activeLanguage === "python") {
                const response = await pythonCompiler(currentCode);
                setoutputCode(response?.output ?? "No output");

            } else if (activeLanguage === "java") {
                const response = await javaCompiler(currentCode);
                setoutputCode(response?.output ?? "No output");

            } else {
                setoutputCode("Unsupported language.");
            }
        } catch (error) {
            console.error("Error occurred code:", error);
            setoutputCode("Something went wrong while running the code.");
        } finally {
            setIsRunning(false);
        }
    };

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
        editor.addAction({
            id: 'run-code-shortcut',
            label: 'Run Code',
            keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Enter],
            run: () => { runCode(); }
        });
    }

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            const dataToSave = { language: activeLanguage, code: value };
            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        }
    };

    const clearOutput = () => {
        setoutputCode("");
        setHtmlPreview("");
    };

    const FullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const EXTENSIONS: Record<string, string> = {
        javascript: ".js",
        python: ".py",
        java: ".java",
        html: ".html",
    };

    const downloadFile = () => {
        if (!editorRef.current) return;

        const currentCode = editorRef.current.getValue();
        const baseFileName = info.fileName || "code";
        const extension = EXTENSIONS[activeLanguage] || ".txt";

        const fullFileName = baseFileName.endsWith(extension) ? baseFileName : `${baseFileName}${extension}`;
        const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
        const element = document.createElement("a");

        element.href = URL.createObjectURL(blob);
        element.download = fullFileName;

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };


    let menuInfo = { menu: menuOpen }



    return (
        <div className='editor__container' ref={containerRef}>

            {/* INPUT SECTION */}
            <div className="input__container">
                <div className="input__header">

                    <div className="menu__side">

                        <BiMenu className='menuu' style={{ fontSize: "31px", cursor: "pointer" }} onClick={menuToggle} />
                        <Menu Toggle={menuInfo} />
                        <span className="file_name">{info.fileName}</span>

                    </div>

                    <div className="header__tools tools">

                        <VscDownload
                            style={{ fontSize: "28px", padding: "5px", cursor: "pointer" }}
                            onClick={downloadFile}
                            title="Download Code File"
                        />

                        <BiFullscreen onClick={FullScreen} style={{ fontSize: "27px", padding: "5px", cursor: "pointer" }} />
                        <span className='output__close' onClick={IsOutputOpen} >{isHtml ? "Preview" : "Output"}</span >

                        <button className='run__button' onClick={runCode} title='Shift + Enter' disabled={isRunning} >
                            <BiRightArrow /> Run
                        </button>
                    </div>
                </div>

                <div className="input__body">
                    <Editor
                        height="100vh"
                        defaultLanguage={activeLanguage}
                        defaultValue={getInitialCode()}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme='vs-dark'
                        options={{ fontSize: editorSettings.fontSize, fontFamily: editorSettings.fontFamily, minimap: { enabled: false }, automaticLayout: true }}
                    />
                </div>
            </div>

            {/* OUTPUT SECTION */}
            <div className={`output__container ${(IsOutput) ? "output__open" : ""} `}>
                <div className="output__header">
                    <span className="headline">{isHtml ? "Preview" : "Output"}</span>

                    <div className="tools">
                        <button className='run__button' onClick={clearOutput}>
                            <MdDelete fontSize={18} title='Clear output' />
                        </button>
                        <CgClose className='output__close' style={{ fontSize: "28px", cursor: "pointer" }} onClick={IsOutputOpen} />
                    </div>
                </div>

                <div className="output__body">
                    {isHtml ? (
                        <iframe
                            className="output__preview"
                            title="html-preview"
                            srcDoc={htmlPreview}
                            sandbox="allow-scripts"
                            style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
                        />
                    ) : (
                        <textarea
                            className='output__textarea code-section'
                            value={outputCode}
                            readOnly
                            placeholder={isRunning ? "Running..." : "Click Run or press Shift+Enter to see the output here..."}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodeEditor;

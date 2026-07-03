import { useEffect, useRef, useState } from "react";
import "./FlashCodeEditor.css";

type LangId = "python" | "javascript" | "java";

interface LangMeta {
    id: LangId;
    label: string;
    ext: string;
    file: string;
    dotColor: string;
}

const LANGS: LangMeta[] = [
    { 
        id: "python", 
        label: "Python", 
        ext: ".py", 
        file: "main.py", 
        dotColor: "#4b8bbe" 
    },
    { 
        id: "javascript", 
        label: "Javascript", 
        ext: ".js", 
        file: "main.js", 
        dotColor: "#f0db4f" 
    },
    { 
        id: "java", 
        label: "Java", 
        ext: ".java", 
        file: "Main.java", 
        dotColor: "#f0793a" 
    },
];

const DEFAULTS: Record<LangId, string> = {
    python: 'def greet(name):\n    print(f"Hello, {name}! 🚀")\n\ngreet("Flash")\n',
    javascript: "function greet(name) {\n  console.log(`Hello, ${name}! 🚀`);\n}\n\ngreet(\"Flash\");\n",
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Flash! \\uD83D\\uDE80");\n    }\n}\n',
};

const STORAGE_KEY = "flash-code-editor:files";

type Files = Record<LangId, string>;

function loadFiles(): Files {
    if (typeof window === "undefined") return { ...DEFAULTS };
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Partial<Files>) : {};
        return {
            python: parsed.python ?? DEFAULTS.python,
            javascript: parsed.javascript ?? DEFAULTS.javascript,
            java: parsed.java ?? DEFAULTS.java,
        };
    } catch {
        return { ...DEFAULTS };
    }
}

function stringifyArg(a: unknown): string {
    if (typeof a === "object") {
        try {
            return JSON.stringify(a);
        } catch {
            return String(a);
        }
    }
    return String(a);
}

export default function FlashCodeEditor() {
    const [files, setFiles] = useState<Files>(() => loadFiles());
    const [activeLang, setActiveLang] = useState<LangId>("python");
    const [mobileView, setMobileView] = useState<"editor" | "output">("editor");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [langDrawerOpen, setLangDrawerOpen] = useState(false);
    const [output, setOutput] = useState<{ text: string; isError: boolean }>({
        text: "// Output will show up here once you hit Run.",
        isError: false,
    });
    const [running, setRunning] = useState(false);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeMeta = LANGS.find((l) => l.id === activeLang)!;

    const showToast = (msg: string) => {
        setToastMsg(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMsg(null), 1800);
    };

    const persist = (next: Files) => {
        setSaveState("saving");
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // storage unavailable, fail silently
            }
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 1200);
        }, 500);
    };

    const handleCodeChange = (value: string) => {
        const next = { ...files, [activeLang]: value };
        setFiles(next);
        persist(next);
    };

    const switchLang = (id: LangId) => {
        setActiveLang(id);
        setOutput({ text: "// Output will show up here once you hit Run.", isError: false });
    };

    const runJs = (code: string) => {
        const logs: string[] = [];
        const fakeConsole = {
            log: (...a: unknown[]) => logs.push(a.map(stringifyArg).join(" ")),
            error: (...a: unknown[]) => logs.push("[error] " + a.map(stringifyArg).join(" ")),
            warn: (...a: unknown[]) => logs.push("[warn] " + a.map(stringifyArg).join(" ")),
        };
        try {
            // eslint-disable-next-line no-new-func
            const fn = new Function("console", code);
            fn(fakeConsole);
            setOutput({
                text: logs.length ? logs.join("\n") : "// Code ran with no console output.",
                isError: false,
            });
        } catch (err) {
            setOutput({ text: err instanceof Error ? err.message : String(err), isError: true });
        }
    };

    const runCode = () => {
        setRunning(true);
        setMobileView("output");
        setTimeout(() => {
            if (activeLang === "javascript") {
                runJs(files.javascript);
            } else {
                setOutput({
                    text: `// Live ${activeMeta.label} execution isn't wired up in this demo yet.\n// JavaScript runs for real — switch to Javascript to try it.`,
                    isError: false,
                });
            }
            setRunning(false);
        }, 350);
    };

    useEffect(() => {
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            if (toastTimer.current) clearTimeout(toastTimer.current);
        };
    }, []);

    return (
        <div className="fce-root">
            {/* Top bar */}
            <div className="fce-topbar">
                <div className="fce-brand">
                    <svg className="fce-bolt" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 L13 2Z" fill="#ffcc33" />
                    </svg>
                    <span className="fce-brand-text">Flash Code Editor</span>
                    <span className="fce-brand-sub">— run code, right here</span>
                </div>

                <div className="fce-top-actions">
                    <button className="fce-icon-btn" onClick={() => showToast("Settings — coming soon")} aria-label="Settings">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                        </svg>
                    </button>

                    <button className="fce-login" onClick={() => showToast("Login — coming soon")}>
                        Login
                    </button>

                    <button className="fce-icon-btn fce-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="fce-body">
                {/* Desktop sidebar */}
                <aside className="fce-sidebar">
                    <div className="fce-sidebar-title">Languages</div>
                    <div className="fce-lang-list">
                        {LANGS.map((l) => (
                            <button
                                key={l.id}
                                className={`fce-lang-item${l.id === activeLang ? " active" : ""}`}
                                onClick={() => switchLang(l.id)}
                            >
                                <span className="fce-dot" style={{ background: l.dotColor, boxShadow: `0 0 8px ${l.dotColor}99` }} />
                                {l.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Workspace */}
                <div className="fce-workspace">
                    {/* Mobile tabs */}
                    <div className="fce-tabsbar">
                        <button
                            className={`fce-tab${mobileView === "editor" ? " active" : ""}`}
                            onClick={() => setMobileView("editor")}
                        >
                            main{activeMeta.ext}
                        </button>
                        <button
                            className={`fce-tab${mobileView === "output" ? " active" : ""}`}
                            onClick={() => setMobileView("output")}
                        >
                            Output
                        </button>
                    </div>

                    <div className="fce-panels">
                        {/* Editor panel */}
                        <section className={`fce-panel${mobileView === "output" ? "" : " hide-on-mobile"}`}>
                            <div className="fce-panel-header editor-header">
                                <span className="fce-filename">{activeMeta.file}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span className={`fce-savestate${saveState !== "idle" ? " show" : ""}`}>
                                        {saveState === "saving" ? "saving…" : "saved"}
                                    </span>
                                    <RunButton running={running} onClick={runCode} />
                                </div>
                            </div>

                            <textarea
                                className="fce-editor"
                                spellCheck={false}
                                value={files[activeLang]}
                                onChange={(e) => handleCodeChange(e.target.value)}
                            />

                            {/* Run button row shown only on mobile, since the header above is hidden there */}
                            <div className="fce-mobile-run-row">
                                <RunButton running={running} onClick={runCode} />
                            </div>
                        </section>

                        {/* Output panel */}
                        <section className={`fce-panel${mobileView === "editor" ? "" : " hide-on-mobile"}`}>
                            <div className="fce-panel-header output-header">
                                <span className="fce-filename">Output</span>
                            </div>
                            <pre className={`fce-output${output.isError ? " is-error" : ""}`}>{output.text}</pre>
                        </section>
                    </div>
                </div>
            </div>

            {/* Mobile drawer */}
            <div className={`fce-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
            <nav className={`fce-drawer${drawerOpen ? " open" : ""}`}>
                <div className="fce-drawer-head">
                    <span className="fce-drawer-title">Flash Code Editor</span>
                    <button className="fce-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                        &times;
                    </button>
                </div>

                <button
                    className="fce-drawer-item"
                    onClick={() => {
                        showToast("Settings — coming soon");
                        setDrawerOpen(false);
                    }}
                >
                    Setting
                </button>

                <button className="fce-drawer-item" onClick={() => setLangDrawerOpen((v) => !v)}>
                    Languages
                    <svg
                        className={`fce-caret${langDrawerOpen ? " open" : ""}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {langDrawerOpen && (
                    <div className="fce-sub-list">
                        {LANGS.map((l) => (
                            <button
                                key={l.id}
                                className={`fce-sub-item${l.id === activeLang ? " active" : ""}`}
                                onClick={() => {
                                    switchLang(l.id);
                                    setDrawerOpen(false);
                                }}
                            >
                                <span className="fce-dot" style={{ background: l.dotColor }} />
                                {l.label}
                            </button>
                        ))}
                    </div>
                )}

                <button
                    className="fce-drawer-item no-border"
                    onClick={() => {
                        showToast("Login — coming soon");
                        setDrawerOpen(false);
                    }}
                >
                    Login
                </button>
            </nav>

            {/* Toast */}
            <div className={`fce-toast${toastMsg ? " show" : ""}`}>{toastMsg}</div>
        </div>
    );
}

function RunButton({ running, onClick }: { running: boolean; onClick: () => void }) {
    return (
        <button className={`fce-run-btn${running ? " running" : ""}`} onClick={onClick}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
            </svg>
            Run
        </button>
    );
}
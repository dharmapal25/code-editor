import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Settings.css';

export const EDITOR_SETTINGS_KEY = 'editor_settings';

export interface EditorSettings {
    fontSize: number;
    fontFamily: string;
}

const DEFAULT_SETTINGS: EditorSettings = {
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
};

const FONT_OPTIONS = [
    { label: 'Consolas', value: 'Consolas, monospace' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Fira Code', value: '"Fira Code", monospace' },
    { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
    { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { label: 'Monospace (default)', value: 'monospace' },
];

function getSavedSettings(): EditorSettings {
    try {
        const raw = localStorage.getItem(EDITOR_SETTINGS_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        const parsed = JSON.parse(raw);
        return {
            fontSize: parsed.fontSize ?? DEFAULT_SETTINGS.fontSize,
            fontFamily: parsed.fontFamily ?? DEFAULT_SETTINGS.fontFamily,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function Settings() {
    const [settings, setSettings] = useState<EditorSettings>(getSavedSettings);
    const [savedMsg, setSavedMsg] = useState('');

    useEffect(() => {
        localStorage.setItem(EDITOR_SETTINGS_KEY, JSON.stringify(settings));
        setSavedMsg('Saved ✓');
        const t = setTimeout(() => setSavedMsg(''), 1200);
        return () => clearTimeout(t);
    }, [settings]);

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prev) => ({ ...prev, fontSize: Number(e.target.value) }));
    };

    const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings((prev) => ({ ...prev, fontFamily: e.target.value }));
    };

    const handleReset = () => setSettings(DEFAULT_SETTINGS);

    return (
        <div className="settings__page">
            <div className="settings__card">
                <Link to="/python" className="settings__back">&larr; Back to editor</Link>
                <h1 className="settings__title">Editor Settings</h1>
                <p className="settings__subtitle">Font changes apply to all code editors and are saved automatically.</p>

                <div className="settings__group">
                    <label className="settings__label" htmlFor="fontSize">
                        Font Size <span className="settings__value">{settings.fontSize}px</span>
                    </label>
                    <input id="fontSize" type="range" min={10} max={28} step={1}
                        value={settings.fontSize} onChange={handleFontSizeChange} className="settings__range" />
                </div>

                <div className="settings__group">
                    <label className="settings__label" htmlFor="fontFamily">Font Style</label>
                    <select id="fontFamily" value={settings.fontFamily} onChange={handleFontFamilyChange} className="settings__select">
                        {FONT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="settings__group">
                    <label className="settings__label">Preview</label>
                    <div className="settings__preview" style={{ fontSize: `${settings.fontSize}px`, fontFamily: settings.fontFamily }}>
                        {`const flash = "Flash Code Editor";`}
                    </div>
                </div>

                <button className="settings__reset" onClick={handleReset}>Reset to Default</button>
                <div className="settings__saved-msg">{savedMsg}</div>
            </div>
        </div>
    );
}

export default Settings;
import React from 'react';

export default function SettingsModal({ t, lang, workDuration, shortBreak, longBreak, autoNext, handleSettingsChange, setShowSettings }) {
  return (
    <div className="settings-popup-overlay" onClick={e => {if(e.target.className==='settings-popup-overlay') setShowSettings(false)}}>
      <div className="settings-popup">
        <h2>{t.settings} Pomodoro</h2>
        <form className="settings-form" onSubmit={e=>e.preventDefault()}>
          <label>{t.work}:
            <input type="number" min="1" name="work" value={Math.round(workDuration/60)} onChange={handleSettingsChange} /> {lang==='vi'?'phút':'min'}
          </label>
          <label>{t.shortBreak}:
            <input type="number" min="1" name="short" value={Math.round(shortBreak/60)} onChange={handleSettingsChange} /> {lang==='vi'?'phút':'min'}
          </label>
          <label>{t.longBreak}:
            <input type="number" min="1" name="long" value={Math.round(longBreak/60)} onChange={handleSettingsChange} /> {lang==='vi'?'phút':'min'}
          </label>
          <label className="auto-next-label">
            <input type="checkbox" name="autoNext" checked={autoNext} onChange={handleSettingsChange} /> {t.autoNext}
          </label>
          <div className="settings-actions">
            <button className="btn save-btn" onClick={()=>setShowSettings(false)}>{t.saveClose}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

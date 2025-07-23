import React from 'react';

export default function Timer({
  mode, setMode, workDuration, shortBreak, longBreak, setSecondsLeft, setIsRunning, t, secondsLeft, isRunning, handleStart, handlePause, handleReset, sessionCount, formatTime
}) {
  return (
    <div className="timer-container">
      <div className="mode-tabs">
        <button
          className={mode === 'work' ? 'tab active' : 'tab'}
          onClick={() => { setMode('work'); setSecondsLeft(workDuration); setIsRunning(false); }}
        >{t.pomodoro}</button>
        <button
          className={mode === 'short' ? 'tab active' : 'tab'}
          onClick={() => { setMode('short'); setSecondsLeft(shortBreak); setIsRunning(false); }}
        >{t.short}</button>
        <button
          className={mode === 'long' ? 'tab active' : 'tab'}
          onClick={() => { setMode('long'); setSecondsLeft(longBreak); setIsRunning(false); }}
        >{t.long}</button>
      </div>
      <div className={`timer-circle ${mode}`}>
        <span className="timer-text">{formatTime(secondsLeft)}</span>
      </div>
      <div className="timer-actions">
        {!isRunning ? (
          <button className="btn start" onClick={handleStart}>{t.start}</button>
        ) : (
          <button className="btn pause" onClick={handlePause}>{t.pause}</button>
        )}
        <button className="btn reset" onClick={handleReset}>{t.reset}</button>
      </div>
      <div className="session-info">{t.sessionDone}: <b>{sessionCount}</b></div>
    </div>
  );
}

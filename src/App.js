import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import HistoryPanel from './components/HistoryPanel';
import SettingsModal from './components/SettingsModal';
import GuideModal from './components/GuideModal';
import EyeCarePopup from './components/EyeCarePopup';
import { getTodayStr } from './utils/date';
import './App.css';


const DEFAULT_WORK_DURATION = 25 * 60; // 25 phút
const DEFAULT_SHORT_BREAK = 5 * 60; // 5 phút
const DEFAULT_LONG_BREAK = 15 * 60; // 15 phút
const SESSIONS_BEFORE_LONG_BREAK = 4;

// Đa ngôn ngữ: EN/VI
const LANGS = {
  vi: {
    pomodoro: 'Pomodoro',
    short: 'Nghỉ ngắn',
    long: 'Nghỉ dài',
    start: 'Bắt đầu',
    pause: 'Tạm dừng',
    reset: 'Đặt lại',
    sessionDone: 'Phiên đã hoàn thành',
    todoTitle: 'Việc cần làm hôm nay',
    add: 'Thêm',
    addPlaceholder: 'Thêm việc mới...',
    todoEmpty: 'Chưa có công việc nào',
    delete: 'Xoá',
    history: 'Lịch sử Pomodoro',
    today: 'Hôm nay',
    session: 'phiên',
    noData: 'Chưa có dữ liệu',
    settings: 'Cài đặt',
    work: 'Pomodoro',
    shortBreak: 'Nghỉ ngắn',
    longBreak: 'Nghỉ dài',
    autoNext: 'Tự động chuyển phiên',
    saveClose: 'Lưu & Đóng',
    eyeTitle: 'Bảo vệ mắt!',
    eyeMsg: 'Hãy rời mắt khỏi màn hình 20 giây',
    eyeRule: '(nguyên tắc 20-20-20)',
    eyeBtn: 'Đã hiểu',
    guide: 'Hướng dẫn/FAQ',
    guideTitle: 'Hướng dẫn sử dụng & FAQ',
    guideClose: 'Đóng',
    notifWorkEnd: 'Đã hết phiên Pomodoro!',
    notifBreak: 'Đã đến lúc nghỉ ngắn hoặc nghỉ dài để bảo vệ mắt.',
    notifLong: 'Nghỉ dài bắt đầu!',
    notifLongMsg: 'Hãy thư giãn 15 phút.',
    notifShort: 'Nghỉ ngắn bắt đầu!',
    notifShortMsg: 'Hãy thư giãn 5 phút.',
    notifWork: 'Bắt đầu phiên Pomodoro mới!',
    notifWorkMsg: 'Hãy tập trung làm việc nhé!',
    lang: 'Ngôn ngữ',
    shortcut: 'Phím tắt',
    shortcuts: [
      { key: 'Space', desc: 'Bắt đầu/Tạm dừng' },
      { key: 'R', desc: 'Đặt lại' },
      { key: '1', desc: 'Chuyển sang Pomodoro' },
      { key: '2', desc: 'Chuyển sang Nghỉ ngắn' },
      { key: '3', desc: 'Chuyển sang Nghỉ dài' },
      { key: '?', desc: 'Mở Hướng dẫn/FAQ' },
    ],
  },
  en: {
    pomodoro: 'Pomodoro',
    short: 'Short Break',
    long: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    sessionDone: 'Sessions completed',
    todoTitle: 'Today\'s Tasks',
    add: 'Add',
    addPlaceholder: 'Add new task...',
    todoEmpty: 'No tasks yet',
    delete: 'Delete',
    history: 'Pomodoro History',
    today: 'Today',
    session: 'sessions',
    noData: 'No data',
    settings: 'Settings',
    work: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    autoNext: 'Auto session switch',
    saveClose: 'Save & Close',
    eyeTitle: 'Eye Care!',
    eyeMsg: 'Look away from the screen for 20 seconds',
    eyeRule: '(20-20-20 rule)',
    eyeBtn: 'Got it',
    guide: 'Guide/FAQ',
    guideTitle: 'User Guide & FAQ',
    guideClose: 'Close',
    notifWorkEnd: 'Pomodoro session ended!',
    notifBreak: 'Time for a short or long break to protect your eyes.',
    notifLong: 'Long break started!',
    notifLongMsg: 'Relax for 15 minutes.',
    notifShort: 'Short break started!',
    notifShortMsg: 'Relax for 5 minutes.',
    notifWork: 'New Pomodoro started!',
    notifWorkMsg: 'Stay focused!',
    lang: 'Language',
    shortcut: 'Shortcuts',
    shortcuts: [
      { key: 'Space', desc: 'Start/Pause' },
      { key: 'R', desc: 'Reset' },
      { key: '1', desc: 'Switch to Pomodoro' },
      { key: '2', desc: 'Switch to Short Break' },
      { key: '3', desc: 'Switch to Long Break' },
      { key: '?', desc: 'Open Guide/FAQ' },
    ],
  },
};

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}



function App() {
  // State khai báo đầu tiên
  const [lang, setLang] = useState('vi');
  const [todos, setTodos] = useState(() => {
    const data = localStorage.getItem('pomofocus_todos');
    return data ? JSON.parse(data) : [];
  });
  const [todoInput, setTodoInput] = useState('');
  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_DURATION);
  const [shortBreak, setShortBreak] = useState(DEFAULT_SHORT_BREAK);
  const [longBreak, setLongBreak] = useState(DEFAULT_LONG_BREAK);
  const [autoNext, setAutoNext] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [mode, setMode] = useState('work'); // work, short, long
  const [secondsLeft, setSecondsLeft] = useState(workDuration);
  // Bổ sung các state và ref còn thiếu
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  // Cập nhật title theo thời gian thực (đặt sau khi đã khai báo state)
  useEffect(() => {
    let title = '';
    if (mode === 'work') {
      title = `${formatTime(secondsLeft)} - Time to focus!`;
    } else if (mode === 'short') {
      title = `${formatTime(secondsLeft)} - Short break!`;
    } else {
      title = `${formatTime(secondsLeft)} - Long break!`;
    }
    document.title = title;
  }, [secondsLeft, mode]);
  const [endTime, setEndTime] = useState(null); // timestamp ms
  const [history, setHistory] = useState(() => {
    const data = localStorage.getItem('pomofocus_history');
    return data ? JSON.parse(data) : {};
  });
  const [showEyePopup, setShowEyePopup] = useState(false);
  const timerRef = useRef();

  // Các hàm xử lý todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    const value = todoInput.trim();
    if (!value) return;
    setTodos([{ text: value, done: false, id: Date.now() }, ...todos]);
    setTodoInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const t = LANGS[lang];
  // Xin quyền notification khi vào app
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
  // Lưu todo-list vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('pomofocus_todos', JSON.stringify(todos));
  }, [todos]);


  // Lưu lịch sử khi sessionCount thay đổi
  useEffect(() => {
    if (sessionCount === 0) return;
    const today = getTodayStr();
    setHistory(prev => {
      const newHistory = { ...prev, [today]: (prev[today] || 0) + 1 };
      localStorage.setItem('pomofocus_history', JSON.stringify(newHistory));
      return newHistory;
    });
    // eslint-disable-next-line
  }, [sessionCount]);

  // Reset timer when mode or durations change
  useEffect(() => {
    if (mode === 'work') setSecondsLeft(workDuration);
    else if (mode === 'short') setSecondsLeft(shortBreak);
    else setSecondsLeft(longBreak);
    setIsRunning(false);
    // eslint-disable-next-line
  }, [workDuration, shortBreak, longBreak, mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(r => !r);
      }
      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
      if (e.key === '1') {
        setMode('work'); setSecondsLeft(workDuration); setIsRunning(false);
      }
      if (e.key === '2') {
        setMode('short'); setSecondsLeft(shortBreak); setIsRunning(false);
      }
      if (e.key === '3') {
        setMode('long'); setSecondsLeft(longBreak); setIsRunning(false);
      }
      if (e.key === '?') {
        setShowGuide(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line
  }, [workDuration, shortBreak, longBreak]);


  // Timer interval - dùng timestamp thực tế
  useEffect(() => {
    if (!isRunning) return;
    if (!endTime) return;
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remain = Math.max(0, Math.round((endTime - now) / 1000));
      setSecondsLeft(remain);
      if (remain <= 0) {
        clearInterval(timerRef.current);
        handleTimerEnd();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [isRunning, endTime]);

  // Khi start timer, set endTime
  useEffect(() => {
    if (isRunning) {
      setEndTime(Date.now() + secondsLeft * 1000);
    } else {
      setEndTime(null);
    }
    // eslint-disable-next-line
  }, [isRunning]);

  // Khi đổi mode hoặc durations, reset secondsLeft và endTime
  useEffect(() => {
    if (mode === 'work') setSecondsLeft(workDuration);
    else if (mode === 'short') setSecondsLeft(shortBreak);
    else setSecondsLeft(longBreak);
    setIsRunning(false);
    setEndTime(null);
    // eslint-disable-next-line
  }, [workDuration, shortBreak, longBreak, mode]);


  const sendNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  // Đảm bảo auto session switch hoạt động đúng
  const handleTimerEnd = () => {
    if (mode === 'work') {
      setShowEyePopup(true);
      setSessionCount((c) => c + 1);
      sendNotification(t.notifWorkEnd, t.notifBreak);
      if ((sessionCount + 1) % SESSIONS_BEFORE_LONG_BREAK === 0) {
        setMode('long');
        setSecondsLeft(longBreak);
        if (autoNext) setTimeout(() => setIsRunning(true), 500); else setIsRunning(false);
        sendNotification(t.notifLong, t.notifLongMsg);
      } else {
        setMode('short');
        setSecondsLeft(shortBreak);
        if (autoNext) setTimeout(() => setIsRunning(true), 500); else setIsRunning(false);
        sendNotification(t.notifShort, t.notifShortMsg);
      }
    } else {
      setMode('work');
      setSecondsLeft(workDuration);
      if (autoNext) setTimeout(() => setIsRunning(true), 500); else setIsRunning(false);
      sendNotification(t.notifWork, t.notifWorkMsg);
    }
  };


  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') setSecondsLeft(workDuration);
    else if (mode === 'short') setSecondsLeft(shortBreak);
    else setSecondsLeft(longBreak);
  };

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    const v = Math.max(1, Number(value));
    if (name === 'work') setWorkDuration(v * 60);
    if (name === 'short') setShortBreak(v * 60);
    if (name === 'long') setLongBreak(v * 60);
    if (name === 'autoNext') setAutoNext(checked);
  };

  const closeEyePopup = () => setShowEyePopup(false);

  // Optional: Play sound when showEyePopup
useEffect(() => {
  if (showEyePopup) {
    const audio = new Audio('https://cdn.jsdelivr.net/gh/napthedev/pomofocus-assets@main/sounds/notification.mp3');
    audio.play().catch((e) => {
      // Nếu lỗi, không làm crash app
      console.warn('Cannot play audio:', e);
    });
  }
}, [showEyePopup]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">Pomofocus <span className="eyecare">EyeCare</span></h1>
        <Header lang={lang} setLang={setLang} t={t} setShowGuide={setShowGuide} setShowSettings={setShowSettings} />
        <button
          className="faq-btn"
          title={t.guideTitle}
          style={{ position: 'absolute', top: 32, right: 100, zIndex: 1102 }}
          onClick={() => setShowGuide(true)}
        >
          ?
        </button>
        <div className="main-content">
          <Timer
            mode={mode}
            setMode={setMode}
            workDuration={workDuration}
            shortBreak={shortBreak}
            longBreak={longBreak}
            setSecondsLeft={setSecondsLeft}
            setIsRunning={setIsRunning}
            t={t}
            secondsLeft={secondsLeft}
            isRunning={isRunning}
            handleStart={handleStart}
            handlePause={handlePause}
            handleReset={handleReset}
            sessionCount={sessionCount}
            formatTime={formatTime}
          />
          <div className="side-panel">
            <TodoList
              t={t}
              todos={todos}
              todoInput={todoInput}
              setTodoInput={setTodoInput}
              handleAddTodo={handleAddTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
            <HistoryPanel t={t} history={history} />
          </div>
        </div>
        {showSettings && (
          <SettingsModal
            t={t}
            lang={lang}
            workDuration={workDuration}
            shortBreak={shortBreak}
            longBreak={longBreak}
            autoNext={autoNext}
            handleSettingsChange={handleSettingsChange}
            setShowSettings={setShowSettings}
          />
        )}
        {showGuide && (
          <GuideModal t={t} lang={lang} setShowGuide={setShowGuide} />
        )}
        {showEyePopup && (
          <EyeCarePopup t={t} closeEyePopup={closeEyePopup} />
        )}
        <footer className="footer">© {new Date().getFullYear()} Pomofocus EyeCare</footer>
      </header>
    </div>
  );
}

export default App;

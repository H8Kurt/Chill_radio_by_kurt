// src/components/StudyTimer.jsx
import React from 'react';

const StudyTimer = ({ isRunning, onToggle, onReset, workDuration, onWorkDurationChange, breakDuration, onBreakDurationChange, timerTime, timerMode, formatTime, colors, WORK_DURATIONS, BREAK_DURATIONS }) => {
  return (
    <div className="bg-white/10 rounded-xl p-4" style={{ backgroundColor: colors.bgPanel }}>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs opacity-80 mb-1" style={{ color: colors.text }}>Учёба</label>
            <select
              value={workDuration}
              onChange={e => onWorkDurationChange(Number(e.target.value))}
              className="rounded px-2 py-1 text-sm"
              style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
              disabled={isRunning && timerMode === 'work'}
            >
              {WORK_DURATIONS.map(min => <option key={min} value={min}>{min} мин</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs opacity-80 mb-1" style={{ color: colors.text }}>Перерыв</label>
            <select
              value={breakDuration}
              onChange={e => onBreakDurationChange(Number(e.target.value))}
              className="rounded px-2 py-1 text-sm"
              style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
              disabled={isRunning && timerMode === 'break'}
            >
              {BREAK_DURATIONS.map(min => <option key={min} value={min}>{min} мин</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs opacity-80 mb-1" style={{ color: colors.text }}>Таймер</label>
            <div className="font-mono text-xl px-3 py-1 rounded text-center" style={{ backgroundColor: timerMode === 'work' ? colors.primary + '20' : '#f59e0b30' }}>
              {formatTime(timerTime)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{ backgroundColor: isRunning ? '#ef4444' : colors.primary, color: '#fff' }}
          >
            {isRunning ? 'Пауза' : 'Старт'}
          </button>
          <button
            onClick={onReset}
            className="px-3 py-2 rounded text-sm transition-colors"
            style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
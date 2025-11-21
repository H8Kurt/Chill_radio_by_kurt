// src/components/SettingsPanel.jsx
import React from 'react';

const SettingsPanel = ({ themeId, onThemeChange, customBackground, onCustomBackgroundChange, visualizerType, onVisualizerChange, layoutMode, onLayoutChange, onExportStations, onImportStations, colors, THEMES }) => {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      <select value={themeId} onChange={e => onThemeChange(e.target.value)} className="px-3 py-1.5 rounded text-sm bg-white/10 border border-white/20" style={{ color: colors.text }}>
        {Object.entries(THEMES).map(([id, theme]) => <option key={id} value={id}>{theme.name}</option>)}
        <option value="custom">Свой фон</option>
      </select>
      {themeId === 'custom' && (
        <div className="flex gap-2 flex-wrap">
          <input type="text" placeholder="URL изображения" value={customBackground.startsWith('') ? '' : customBackground} onChange={e => onCustomBackgroundChange(e.target.value)} className="px-2 py-1.5 rounded text-sm w-32 sm:w-40 bg-white/10 border border-white/20" style={{ color: colors.text }} />
          <label className="px-2 py-1.5 rounded text-sm bg-white/10 border border-white/20 cursor-pointer" style={{ color: colors.text }}>
            Загрузить
            <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = ev => onCustomBackgroundChange(ev.target.result); reader.readAsDataURL(file); } }} className="hidden" />
          </label>
        </div>
      )}
      <select value={visualizerType} onChange={e => onVisualizerChange(e.target.value)} className="px-3 py-1.5 rounded text-sm bg-white/10 border border-white/20" style={{ color: colors.text }}>
        <option value="bars">Столбики</option>
        <option value="waveform">Волна</option>
        <option value="circular">Круг</option>
      </select>
      <div className="flex bg-white/10 rounded-full p-1 border border-white/20">
        <button className={`px-3 py-1 text-sm ${layoutMode === 'compact' ? 'bg-emerald-600 text-white' : ''}`} onClick={() => onLayoutChange('compact')}>Компакт</button>
        <button className={`px-3 py-1 text-sm ${layoutMode === 'expanded' ? 'bg-emerald-600 text-white' : ''}`} onClick={() => onLayoutChange('expanded')}>Крупный</button>
      </div>
      <button
        onClick={onExportStations}
        className="px-3 py-1.5 rounded text-sm bg-white/10 hover:bg-white/20 transition-colors"
        style={{ color: colors.text }}
      >
        Экспорт станций
      </button>
      <label className="px-3 py-1.5 rounded text-sm bg-white/10 hover:bg-white/20 cursor-pointer transition-colors" style={{ color: colors.text }}>
        Импорт станций
        <input type="file" accept=".json" onChange={e => onImportStations(e.target.files[0])} className="hidden" />
      </label>
    </div>
  );
};

export default SettingsPanel;
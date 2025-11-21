// src/components/StationList.jsx
import React from 'react';

const StationList = ({ stations, selected, onSelect, favorites, onToggleFavorite, search, onSearch, genreFilter, onGenreFilter, onAdd, onRemove, onRandom, colors, genres, GENRE_ICONS }) => {
  const filtered = stations.filter(s => {
    const q = search.trim().toLowerCase();
    if (genreFilter !== 'All' && (s.genre || '') !== genreFilter) return false;
    if (!q) return true;
    return (s.name || '').toLowerCase().includes(q) || (s.genre || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-white/10 rounded-xl p-4" style={{ backgroundColor: colors.bgPanel }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium" style={{ color: colors.text }}>Станции</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onGenreFilter('All')}
            className={`px-2 py-0.5 text-xs rounded ${genreFilter === 'All' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
          >
            Все
          </button>
          <button
            onClick={() => onGenreFilter('Favorites')}
            className={`px-2 py-0.5 text-xs rounded ${genreFilter === 'Favorites' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
          >
            Избранное
          </button>
        </div>
      </div>
      <div className="mb-3">
        <input
          className="w-full p-2 rounded bg-white/10 placeholder:text-white/70 text-sm border border-white/20"
          placeholder="Поиск..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="space-y-2 max-h-48 overflow-auto pr-1">
        {(genreFilter === 'Favorites' ? stations.filter(s => favorites.includes(s.id)) : filtered)
          .map((s, i) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`p-2.5 rounded cursor-pointer transition-all duration-200 text-sm flex items-center gap-2 ${
                selected === s.id 
                  ? 'bg-emerald-500/30 scale-105' 
                  : 'hover:bg-white/10'
              }`}
            >
              <span>{GENRE_ICONS[s.genre] || GENRE_ICONS.Unknown}</span>
              <div>
                <div>{s.name}</div>
                <div className="text-xs opacity-80">{s.genre || '—'}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(s.id);
                }}
                className={`ml-auto text-xs ${favorites.includes(s.id) ? 'text-yellow-400' : 'text-white/50'}`}
              >
                ★
              </button>
            </div>
          ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-sm text-white transition-all"
          onClick={onAdd}
        >
          ➕ Добавить
        </button>
        <button
          className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm transition-all"
          onClick={() => onRemove(selected)}
          disabled={!selected}
        >
          🗑 Удалить
        </button>
        <button
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-sm text-white transition-all"
          onClick={onRandom}
        >
          🎲 Случайная
        </button>
      </div>
    </div>
  );
};

export default StationList;
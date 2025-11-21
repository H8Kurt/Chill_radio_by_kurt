// src/utils/audioUtils.js
export const DEFAULT_STATIONS = [
  { id: 'mayak', name: 'Радио Маяк', genre: 'News', url: 'http://icecast.vgtrk.cdnvideo.ru/mayakfm/mp3_192kbps' },
  { id: 'vesti', name: 'Вести FM', genre: 'News', url: 'http://icecast.vgtrk.cdnvideo.ru/vestifm_aac_64kbps' },
  { id: 'nashe', name: 'Наше Радио', genre: 'Rock', url: 'https://nashe1.hostingradio.ru/nashe-128.mp3' },
  { id: 'rock', name: 'Rock Antenne', genre: 'Rock', url: 'http://streams.rockantenne.de/rockantenne_mpeg' },
  { id: 'jazz24', name: 'Jazz24', genre: 'Jazz', url: 'http://live.wostreaming.net/direct/ppm-jazz24mp3-ibc1' },
  { id: 'bbc', name: 'BBC World Service', genre: 'News', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk' },
  { id: 'ep', name: 'Европа Плюс', genre: 'Pop', url: 'http://ep128.hostingradio.ru:80/ep128' },
  { id: 'chill', name: 'DI Chill', genre: 'Electronic', url: 'http://yp.shoutcast.com/sbin/tunein-station.pls?id=320' },
  { id: 'classic', name: 'Classic FM', genre: 'Classical', url: 'http://media-ice.musicradio.com/ClassicFMMP3' },
  { id: 'radio_paradise', name: 'Radio Paradise', genre: 'Eclectic', url: 'http://stream-uk1.radioparadise.com/mp3-192' },
];

export const GENRE_ICONS = {
  News: '📻',
  Rock: '🎸',
  Jazz: '🎷',
  Pop: '🎤',
  Electronic: '🎧',
  Classical: '🎻',
  Eclectic: '🎹',
  Unknown: '🎵'
};

export const THEMES = {
  default: { name: 'Тёмный градиент', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #111827, #000000)', colors: { primary: '#10b981', secondary: '#374151', text: '#fff', bgPanel: 'rgba(255,255,255,0.08)' } },
  forest: { name: 'Лес', bgType: 'image', bgValue: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', colors: { primary: '#10b981', secondary: '#065f46', text: '#fff', bgPanel: 'rgba(15, 50, 30, 0.7)' } },
  ocean: { name: 'Океан', bgType: 'image', bgValue: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', colors: { primary: '#38bdf8', secondary: '#0891b2', text: '#fff', bgPanel: 'rgba(10, 40, 60, 0.7)' } },
  rain: { name: 'Дождь', bgType: 'image', bgValue: 'https://images.unsplash.com/photo-1515694346971-b8a2f1c3b891?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', colors: { primary: '#818cf8', secondary: '#4c1d95', text: '#fff', bgPanel: 'rgba(30, 30, 50, 0.75)' } },
  cozy: { name: 'Кофейня', bgType: 'image', bgValue: 'https://images.unsplash.com/photo-1516542076725-8d5a41d8f04e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', colors: { primary: '#f59e0b', secondary: '#92400e', text: '#fff', bgPanel: 'rgba(50, 30, 20, 0.7)' } },
  starry: { name: 'Звёзды', bgType: 'image', bgValue: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', colors: { primary: '#a78bfa', secondary: '#581c87', text: '#fff', bgPanel: 'rgba(20, 10, 40, 0.8)' } },
  midnight: { name: 'Полночь', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #1e1b4b, #0f172a)', colors: { primary: '#60a5fa', secondary: '#334155', text: '#fff', bgPanel: 'rgba(255,255,255,0.08)' } },
  lavender: { name: 'Лаванда', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #5b21b6, #7e22ce)', colors: { primary: '#c084fc', secondary: '#581c87', text: '#fff', bgPanel: 'rgba(30, 10, 40, 0.6)' } },
  desert: { name: 'Пустыня', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #b45309, #f59e0b)', colors: { primary: '#fbbf24', secondary: '#92400e', text: '#000', bgPanel: 'rgba(255,255,255,0.25)' } },
  arctic: { name: 'Арктика', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #0891b2, #0e7490)', colors: { primary: '#67e8f9', secondary: '#0c4a6e', text: '#fff', bgPanel: 'rgba(200, 230, 255, 0.15)' } },
  cyber: { name: 'Киберпанк', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', colors: { primary: '#ff00ff', secondary: '#00ffff', text: '#fff', bgPanel: 'rgba(0, 0, 0, 0.6)' } },
  mono: { name: 'Монохром', bgType: 'gradient', bgValue: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', colors: { primary: '#4b5563', secondary: '#1f2937', text: '#000', bgPanel: 'rgba(0,0,0,0.05)' } },
};

export const VISUALIZER_TYPES = ['bars', 'waveform', 'circular'];
export const WORK_DURATIONS = [10, 25, 45, 60];
export const BREAK_DURATIONS = [5, 10, 15];
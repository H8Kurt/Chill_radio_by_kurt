import React, { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_STATIONS = [
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

const GENRE_ICONS = {
  News: '📻',
  Rock: '🎸',
  Jazz: '🎷',
  Pop: '🎤',
  Electronic: '🎧',
  Classical: '🎻',
  Eclectic: '🎹',
  Unknown: '🎵'
};

function parseM3U(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  for (const l of lines) {
    if (!l || l.startsWith('#')) continue;
    if (/^https?:\/\//i.test(l)) return l;
  }
  return null;
}

function parsePLS(text) {
  const m = text.match(/File\d+=(.+)/i);
  return m ? m[1].trim() : null;
}

async function resolvePlaylist(url, proxy) {
  try {
    const lower = url.split('?')[0].toLowerCase();
    if (lower.endsWith('.m3u') || lower.endsWith('.m3u8') || lower.endsWith('.pls')) {
      const fetchUrl = proxy ? proxy + encodeURIComponent(url) : url;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('playlist fetch failed');
      const text = await res.text();
      return (lower.endsWith('.pls') ? parsePLS(text) : parseM3U(text)) || url;
    }
  } catch (e) {
    console.warn('resolvePlaylist error', e);
  }
  return url;
}

const THEMES = {
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

const VISUALIZER_TYPES = ['bars', 'waveform', 'circular'];
const WORK_DURATIONS = [10, 25, 45, 60];
const BREAK_DURATIONS = [5, 10, 15];

export default function App() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('rp_theme') || 'default');
  const [customBackground, setCustomBackground] = useState(() => localStorage.getItem('rp_custom_bg') || '');
  const [visualizerType, setVisualizerType] = useState(() => localStorage.getItem('rp_viz') || 'bars');
  const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem('rp_layout') || 'expanded');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stations, setStations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rp_stations')) || DEFAULT_STATIONS;
    } catch {
      return DEFAULT_STATIONS;
    }
  });
  const [selected, setSelected] = useState(stations[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(Number(localStorage.getItem('rp_volume') || 0.8));
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('rp_favs') || '[]'));
  const [nowPlaying, setNowPlaying] = useState(null);
  const [proxy, setProxy] = useState(localStorage.getItem('rp_proxy') || '');
  const [auddApiKey, setAuddApiKey] = useState(() => localStorage.getItem('rp_audd_key') || '');
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [timerMode, setTimerMode] = useState('work');
  const [workDuration, setWorkDuration] = useState(Number(localStorage.getItem('rp_work_dur') || 25));
  const [breakDuration, setBreakDuration] = useState(Number(localStorage.getItem('rp_break_dur') || 5));
  const [timerTime, setTimerTime] = useState(workDuration * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const today = new Date().toDateString();
  const [studyStats, setStudyStats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rp_study_stats')) || {};
      if (saved.date !== today) {
        return { date: today, sessions: 0, totalMinutes: 0 };
      }
      return saved;
    } catch {
      return { date: today, sessions: 0, totalMinutes: 0 };
    }
  });
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rp_notes')) || [
        { id: 'n1', title: 'Добро пожаловать', content: 'Здесь можно писать заметки во время учёбы.' }
      ];
    } catch {
      return [{ id: 'n1', title: 'Добро пожаловать', content: 'Здесь можно писать заметки во время учёбы.' }];
    }
  });
  const [listeningHistory, setListeningHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rp_history')) || [];
    } catch {
      return [];
    }
  });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStation, setNewStation] = useState({ name: '', url: '', genre: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stationViewMode, setStationViewMode] = useState('list'); // 'list' или 'grid'

  // --- СОСТОЯНИЕ ДЛЯ ЭКВАЛАЙЗЕРА ---
  const [equalizerBands, setEqualizerBands] = useState(() => {
    const saved = localStorage.getItem('rp_equalizer');
    return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0]; // 5 полос: 60Hz, 250Hz, 1kHz, 4kHz, 16kHz
  });

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // --- СОСТОЯНИЕ ДЛЯ ЭКВАЛАЙЗЕРА ---
  const eqNodesRef = useRef([]);

  useEffect(() => localStorage.setItem('rp_theme', themeId), [themeId]);
  useEffect(() => localStorage.setItem('rp_custom_bg', customBackground), [customBackground]);
  useEffect(() => localStorage.setItem('rp_viz', visualizerType), [visualizerType]);
  useEffect(() => localStorage.setItem('rp_layout', layoutMode), [layoutMode]);
  useEffect(() => localStorage.setItem('rp_stations', JSON.stringify(stations)), [stations]);
  useEffect(() => localStorage.setItem('rp_volume', String(volume)), [volume]);
  useEffect(() => localStorage.setItem('rp_work_dur', String(workDuration)), [workDuration]);
  useEffect(() => localStorage.setItem('rp_break_dur', String(breakDuration)), [breakDuration]);
  useEffect(() => localStorage.setItem('rp_favs', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('rp_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('rp_audd_key', auddApiKey), [auddApiKey]);
  useEffect(() => localStorage.setItem('rp_proxy', proxy), [proxy]);
  useEffect(() => localStorage.setItem('rp_history', JSON.stringify(listeningHistory.slice(0, 20))), [listeningHistory]);
  // --- СОХРАНЕНИЕ ДЛЯ ЭКВАЛАЙЗЕРА ---
  useEffect(() => localStorage.setItem('rp_equalizer', JSON.stringify(equalizerBands)), [equalizerBands]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (isTimerRunning && timerMode === 'work') {
      timerRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setTimerMode('break');
            setTimerTime(breakDuration * 60);
            setStudyStats(prev => ({
              date: today,
              sessions: prev.sessions + 1,
              totalMinutes: prev.totalMinutes + workDuration
            }));
            return breakDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isTimerRunning && timerMode === 'break') {
      timerRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setTimerMode('work');
            return workDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timerMode, workDuration, breakDuration]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // --- ИНИЦИАЛИЗАЦИЯ И ОБНОВЛЕНИЕ ЭКВАЛАЙЗЕРА ---
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const ac = audioCtxRef.current;

    // Если контекст не создан, создаем его
    if (!ac) {
      const newAc = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = newAc;
    } else {
      // Если контекст уже создан, отключаем старые ноды эквалайзера
      eqNodesRef.current.forEach(node => node.disconnect());
      eqNodesRef.current = [];
    }

    const currentAc = audioCtxRef.current;

    // Подключаем исходный аудио-элемент к destination через эквалайзер
    // Сначала отключаем от старого destination (если было)
    try {
        audio.disconnect(currentAc.destination);
    } catch (e) {
        // Игнорируем, если не подключен
    }

    // Создаем цепочку фильтров эквалайзера
    const frequencies = [60, 250, 1000, 4000, 16000]; // Частоты для полос
    const gains = equalizerBands; // Значения усиления из состояния

    let source = currentAc.createMediaElementSource(audio);
    let current = source;

    const filters = [];
    frequencies.forEach((freq, i) => {
      const filter = currentAc.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.gain.value = gains[i];
      filter.Q.value = 1.0; // Ширина полосы

      current.connect(filter);
      current = filter;
      filters.push(filter); // Сохраняем каждый фильтр
    });

    // Подключаем последний фильтр к destination
    current.connect(currentAc.destination);

    // Сохраняем фильтры в ref для последующего обновления
    eqNodesRef.current = filters;

    // Подключаем анализатор *до* эквалайзера, чтобы визуализатор не искажался
    const analyser = currentAc.createAnalyser();
    analyser.fftSize = visualizerType === 'circular' ? 1024 : 256;
    source.connect(analyser); // Подключаем к исходному source *до* эквалайзера
    analyser.connect(currentAc.destination); // Подключаем анализатор к destination
    analyserRef.current = analyser; // Сохраняем ref на анализатор для визуализатора

    return () => {
      // При размонтировании отключаем фильтры и анализатор
      filters.forEach(f => f.disconnect());
      source.disconnect(analyser);
      analyser.disconnect();
    };
  }, [equalizerBands]); // Перезапускаем при изменении полос эквалайзера

  // --- ВИЗУАЛИЗАТОР (теперь использует analyserRef.current) ---
  useEffect(() => {
    // Этот эффект теперь просто рисует, используя analyserRef.current, созданный в предыдущем эффекте
    const canvas = canvasRef.current;
    const analyser = analyserRef.current; // Берем анализатор из ref
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const draw = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      const theme = THEMES[themeId] || THEMES.default;
      let color = theme.colors.primary;
      if (themeId === 'forest') color = '#22c55e';
      if (themeId === 'ocean') color = '#0ea5e9';
      if (themeId === 'rain') color = '#818cf8';
      if (themeId === 'cyber') color = '#ff00ff';
      if (themeId === 'desert') color = '#fbbf24';
      if (visualizerType === 'waveform') {
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (visualizerType === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.4;
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const angle = (i * 2 * Math.PI) / bufferLength - Math.PI / 2;
          const value = dataArray[i] / 255;
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius - radius * value);
          const y2 = centerY + Math.sin(angle) * (radius - radius * value);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.8;
          ctx.fillStyle = color + '60';
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [visualizerType, themeId]); // Запускаем при изменении типа визуализатора или темы

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const h = layoutMode === 'compact' ? 60 : 100;
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [layoutMode]);

  useEffect(() => {
    (async () => {
      const st = stations.find(s => s.id === selected);
      if (!st || !audioRef.current) return;
      const resolved = await resolvePlaylist(st.url, proxy);
      audioRef.current.src = resolved;
      audioRef.current.crossOrigin = 'anonymous';
      setNowPlaying({ ...st, resolved });
      setRecognitionResult(null);
      if (isPlaying) {
        try {
          await audioRef.current.play();
          addToHistory(st, new Date());
        } catch (e) {
          console.warn(e);
          setIsPlaying(false);
        }
      }
    })();
  }, [selected, proxy]);

  const addToHistory = (station, time) => {
    setListeningHistory(prev => [
      {
        station: station.name,
        genre: station.genre,
        time: time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        date: time.toDateString()
      },
      ...prev
    ]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        playPause();
      } else if (e.key.toLowerCase() === 't') {
        setIsTimerRunning(prev => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        selectNextStation(); // Вызов новой функции
      } else if (e.key.toLowerCase() === 'p') {
        selectPrevStation(); // Вызов новой функции
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, stations, isPlaying]);

  const recognizeNowPlaying = useCallback(async () => {
    if (!auddApiKey) {
      alert('Введите AudD API Key в настройках');
      return;
    }
    if (!nowPlaying) {
      alert('Выберите станцию');
      return;
    }
    const audio = audioRef.current;
    const ctx = audioCtxRef.current;
    if (!ctx || !audio) {
      alert('Нет доступа к аудио. Убедитесь, что используется HTTPS или локальный сервер.');
      return;
    }
    setIsRecognizing(true);
    setRecognitionResult(null);
    try {
      const source = ctx.createMediaElementSource(audio);
      const dest = ctx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(ctx.destination);
      const mediaRecorder = new MediaRecorder(dest.stream);
      const chunks = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.start();
      await new Promise(r => setTimeout(r, 6000));
      mediaRecorder.stop();
      await new Promise(r => { mediaRecorder.onstop = r; });
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', blob, 'record.wav');
      formData.append('return', 'spotify');
      formData.append('api_token', auddApiKey);
      const res = await fetch('https://api.audd.io/', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.status === 'success' && result.result) {
        setRecognitionResult(result.result);
        const now = new Date();
        setListeningHistory(prev => [
          {
            station: nowPlaying.name,
            genre: 'Recognized',
            time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            date: now.toDateString(),
            artist: result.result.artist,
            title: result.result.title
          },
          ...prev
        ]);
      } else {
        const errorMessage =
          result?.error?.error_message ||
          result?.error?.message ||
          (typeof result?.error === 'string' ? result.error : null) ||
          result?.error_code?.toString() ||
          result?.error?.toString() ||
          'Не удалось распознать трек';
        setRecognitionResult({ error: errorMessage });
      }
    } catch (e) {
      console.error('Recognition error:', e);
      setRecognitionResult({ error: 'Ошибка: ' + (e.message || 'неизвестно') });
    } finally {
      setIsRecognizing(false);
    }
  }, [auddApiKey, nowPlaying]);

  const getCurrentTheme = () => {
    if (themeId === 'custom' && customBackground) {
      return {
        name: 'Свой фон',
        bgType: 'image',
        bgValue: customBackground,
        colors: THEMES.default.colors,
      };
    }
    return THEMES[themeId] || THEMES.default;
  };

  const getBackgroundStyle = () => {
    const theme = getCurrentTheme();
    if (theme.bgType === 'image') {
      return {
        backgroundImage: `url(${theme.bgValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    return {
      background: theme.bgValue,
    };
  };

  // --- НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ СТАНЦИЯМИ ---
  const selectNextStation = () => {
    const currentIndex = stations.findIndex(s => s.id === selected);
    const nextIndex = (currentIndex + 1) % stations.length;
    const nextStation = stations[nextIndex];
    if (nextStation) setSelected(nextStation.id);
  };

  const selectPrevStation = () => {
    const currentIndex = stations.findIndex(s => s.id === selected);
    // Используем длину массива для корректного цикла
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length;
    const prevStation = stations[prevIndex];
    if (prevStation) setSelected(prevStation.id);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const playPause = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        if (nowPlaying) {
          const st = stations.find(s => s.id === selected);
          if (st) addToHistory(st, new Date());
        }
      } catch (e) {
        alert('Ошибка воспроизведения');
      }
    }
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const addStation = () => {
    const { name, url, genre } = newStation;
    if (name && url) {
      const newId = 'st' + Math.random().toString(36).slice(2, 9);
      setStations([{ id: newId, name, url, genre }, ...stations]);
      setSelected(newId);
      setNewStation({ name: '', url: '', genre: '' });
      setShowAddModal(false);
    }
  };

  const removeStation = (id) => {
    if (!confirm('Удалить станцию?')) return;
    const newStations = stations.filter(s => s.id !== id);
    setStations(newStations);
    if (selected === id) setSelected(newStations[0]?.id || null);
  };

  const exportStations = () => {
    const blob = new Blob([JSON.stringify(stations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'stations.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importStations = (file) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const arr = JSON.parse(e.target.result);
        if (Array.isArray(arr)) setStations(arr);
        else alert('Неверный формат');
      } catch (e) {
        alert('Ошибка импорта');
      }
    };
    reader.readAsText(file);
  };

  const createNote = () => {
    const newNote = { id: 'n' + Date.now(), title: 'Новая заметка', content: '' };
    setNotes([newNote, ...notes]);
    setEditingNoteId(newNote.id);
    setNoteTitle(newNote.title);
    setNoteContent(newNote.content);
  };

  const saveNote = () => {
    if (!editingNoteId) return;
    setNotes(notes.map(n => n.id === editingNoteId ? { ...n, title: noteTitle, content: noteContent } : n));
    setEditingNoteId(null);
  };

  const deleteNote = (id) => {
    if (window.confirm('Удалить заметку?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (editingNoteId === id) setEditingNoteId(null);
    }
  };

  const selectNote = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const cancelEdit = () => {
    const note = notes.find(n => n.id === editingNoteId);
    if (note) {
      setNoteTitle(note.title);
      setNoteContent(note.content);
    }
    setEditingNoteId(null);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMode('work');
    setTimerTime(workDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const currentTheme = getCurrentTheme();
  const colors = currentTheme.colors;
  const filtered = stations.filter(s => {
    const q = search.trim().toLowerCase();
    if (genreFilter !== 'All' && (s.genre || '') !== genreFilter) return false;
    if (!q) return true;
    return (s.name || '').toLowerCase().includes(q) || (s.genre || '').toLowerCase().includes(q);
  });
  const genres = ['All', ...Array.from(new Set(stations.map(s => s.genre || 'Unknown')))];
  const isCurrentStationFavorite = favorites.includes(selected);

  return (
    <div className="min-h-screen text-white transition-colors duration-500" style={getBackgroundStyle()}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-xl sm:text-2xl font-light tracking-wide" style={{ color: colors.text }}>
            Chill Radio by kurt
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-xs px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
            style={{ color: colors.text }}
            title={isFullscreen ? "Выйти из полноэкранного режима" : "На весь экран"}
          >
            {isFullscreen ? '⛛' : '⛶'}
          </button>
        </header>
        <div className="text-center mb-3">
          <div className="text-3xl font-light tracking-tight" style={{ color: colors.text }}>
            {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs opacity-80 mt-0.5" style={{ color: colors.text }}>
            {currentTime.toLocaleDateString('ru-RU')}
          </div>
        </div>
        <div className="mb-3 text-center text-xs opacity-80">
          Сегодня: {studyStats.sessions} сессий, {studyStats.totalMinutes} мин
        </div>
        <div className="mb-4 rounded-xl p-3" style={{ backgroundColor: colors.bgPanel }}>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div>
                <label className="block text-xs opacity-80 mb-0.5" style={{ color: colors.text }}>Учёба</label>
                <select
                  value={workDuration}
                  onChange={e => setWorkDuration(Number(e.target.value))}
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
                  disabled={isTimerRunning && timerMode === 'work'}
                >
                  {WORK_DURATIONS.map(min => <option key={min} value={min}>{min} мин</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs opacity-80 mb-0.5" style={{ color: colors.text }}>Перерыв</label>
                <select
                  value={breakDuration}
                  onChange={e => setBreakDuration(Number(e.target.value))}
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
                  disabled={isTimerRunning && timerMode === 'break'}
                >
                  {BREAK_DURATIONS.map(min => <option key={min} value={min}>{min} мин</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs opacity-80 mb-0.5" style={{ color: colors.text }}>Таймер</label>
                <div className="font-mono text-lg px-2 py-0.5 rounded text-center" style={{ backgroundColor: timerMode === 'work' ? colors.primary + '20' : '#f59e0b30' }}>
                  {formatTime(timerTime)}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{ backgroundColor: isTimerRunning ? '#ef4444' : colors.primary, color: '#fff' }}
              >
                {isTimerRunning ? 'Пауза' : 'Старт'}
              </button>
              <button
                onClick={resetTimer}
                className="px-2 py-1.5 rounded text-xs transition-colors"
                style={{ backgroundColor: colors.bgPanel, color: colors.text, border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Сброс
              </button>
            </div>
          </div>
        </div>
        <main className={`grid grid-cols-1 ${layoutMode === 'compact' ? 'lg:grid-cols-12 gap-3' : 'lg:grid-cols-4 gap-4'}`}>
          <aside className={`${layoutMode === 'compact' ? 'lg:col-span-5' : 'lg:col-span-1'} space-y-4`}>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm" style={{ color: colors.text }}>Станции</h3>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => setGenreFilter('All')}
                    className={`px-1.5 py-0.5 text-xs rounded ${genreFilter === 'All' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setGenreFilter('Favorites')}
                    className={`px-1.5 py-0.5 text-xs rounded ${genreFilter === 'Favorites' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
                  >
                    Избранное
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <input
                  className="w-full p-1.5 rounded bg-white/10 placeholder:text-white/70 text-xs border border-white/20"
                  placeholder="Поиск..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex justify-between mb-1">
                <button
                  onClick={() => setStationViewMode('list')}
                  className={`px-2 py-0.5 text-xs rounded ${stationViewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
                >
                  Список
                </button>
                <button
                  onClick={() => setStationViewMode('grid')}
                  className={`px-2 py-0.5 text-xs rounded ${stationViewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}
                >
                  Сетка
                </button>
              </div>
              <div className={`space-y-1 max-h-40 overflow-auto pr-1 ${stationViewMode === 'grid' ? 'grid grid-cols-2 gap-1' : ''}`}>
                {(genreFilter === 'Favorites' ? stations.filter(s => favorites.includes(s.id)) : filtered)
                  .map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      className={`p-2 rounded cursor-pointer transition-all duration-200 text-xs flex items-center gap-1 ${
                        selected === s.id 
                          ? 'bg-emerald-500/30 scale-105' 
                          : 'hover:bg-white/10'
                      } ${stationViewMode === 'grid' ? 'flex-col items-start text-center' : ''}`}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <span className="text-sm">{GENRE_ICONS[s.genre] || GENRE_ICONS.Unknown}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{s.name}</div>
                        <div className="text-[0.6rem] opacity-80 truncate">{s.genre || '—'}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(s.id);
                        }}
                        className={`text-xs ${favorites.includes(s.id) ? 'text-yellow-400' : 'text-white/50'}`}
                      >
                        ★
                      </button>
                    </div>
                  ))}
              </div>
              <div className="mt-2 flex gap-1">
                <button
                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs text-white transition-all"
                  onClick={() => setShowAddModal(true)}
                >
                  ➕ Добавить
                </button>
                <button
                  className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-xs transition-all"
                  onClick={() => removeStation(selected)}
                  disabled={!selected}
                >
                  🗑 Удалить
                </button>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 max-h-[15vh] overflow-auto">
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.text }}>История</h3>
              {listeningHistory.length === 0 ? (
                <div className="text-xs opacity-70">Пока нет записей</div>
              ) : (
                <div className="space-y-1 max-h-24 overflow-auto pr-1">
                  {listeningHistory.slice(0, 5).map((item, i) => (
                    <div key={i} className="text-xs p-1 bg-white/5 rounded">
                      <div className="font-medium truncate">{item.station}</div>
                      {item.artist && <div className="text-emerald-300 text-[0.6rem] truncate">{item.artist} – {item.title}</div>}
                      <div className="opacity-80 text-[0.6rem]">{item.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/10 rounded-xl p-3 max-h-[15vh] overflow-auto">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-sm" style={{ color: colors.text }}>Заметки</h3>
                <button onClick={createNote} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                  + Создать
                </button>
              </div>
              {editingNoteId ? (
                <div className="space-y-1">
                  <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} className="w-full p-1 rounded text-xs bg-white/10 border border-white/20" placeholder="Заголовок" style={{ color: colors.text }} />
                  <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} className="w-full p-1 rounded text-xs h-16 bg-white/10 border border-white/20" placeholder="Содержимое..." style={{ color: colors.text }} />
                  <div className="flex gap-1">
                    <button onClick={saveNote} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: colors.primary, color: '#fff' }}>Сохранить</button>
                    <button onClick={cancelEdit} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: colors.secondary, color: '#fff' }}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 max-h-20 overflow-auto pr-1">
                  {notes.map(note => (
                    <div key={note.id} onClick={() => selectNote(note)} className="p-1 rounded cursor-pointer bg-white/5 text-xs truncate">
                      <div className="font-medium">{note.title}</div>
                      <div className="opacity-80 line-clamp-1">{note.content}</div>
                    </div>
                  ))}
                </div>
              )}
              {editingNoteId && <button onClick={() => deleteNote(editingNoteId)} className="mt-1 text-xs text-rose-400">Удалить</button>}
            </div>
          </aside>
          <section className={`${layoutMode === 'compact' ? 'lg:col-span-7' : 'lg:col-span-3'} flex flex-col items-center`}>
            <div className={`w-full ${layoutMode === 'compact' ? 'max-w-lg' : 'max-w-2xl'} bg-white/10 rounded-2xl p-4 transition-all duration-300`}>
              <div className="text-center mb-4">
                <div className="text-base sm:text-lg font-light mb-1 min-h-[1.5rem]" style={{ color: colors.text }}>
                  {recognitionResult?.error ? (
                    <span className="text-red-300 text-xs">
                      {typeof recognitionResult.error === 'string'
                        ? recognitionResult.error
                        : 'Ошибка распознавания'}
                    </span>
                  ) : recognitionResult ? (
                    <>
                      <div>{recognitionResult.artist}</div>
                      <div className="text-emerald-300">{recognitionResult.title}</div>
                    </>
                  ) : nowPlaying?.name ? (
                    <>
                      <div>{nowPlaying.name}</div>
                      <div className="text-xs opacity-80">{nowPlaying.genre}</div>
                    </>
                  ) : (
                    <span className="opacity-70">Выберите станцию</span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <canvas ref={canvasRef} className="w-full bg-black/10 rounded" />
              </div>
              <div className="flex justify-center gap-3 mb-3">
                {/* --- КНОПКА "ПРЕДЫДУЩАЯ" --- */}
                <button
                  onClick={selectPrevStation}
                  className="w-10 h-10 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
                  style={{
                    borderColor: colors.text + '40',
                    backgroundColor: 'transparent',
                    color: colors.text,
                  }}
                  title="Предыдущая станция (P)"
                >
                  ⏮
                </button>
                <button
                  onClick={playPause}
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-300 hover:shadow-lg active:scale-95 transform hover:-translate-y-0.5"
                  style={{
                    borderColor: isPlaying ? '#ef4444' : colors.primary,
                    backgroundColor: 'transparent',
                    color: isPlaying ? '#ef4444' : colors.primary,
                  }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  onClick={stop}
                  className="w-10 h-10 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
                  style={{
                    borderColor: colors.text + '40',
                    backgroundColor: 'transparent',
                    color: colors.text,
                  }}
                  title="Остановить"
                >
                  ⏹
                </button>
                {/* --- КНОПКА "СЛЕДУЮЩАЯ" --- */}
                <button
                  onClick={selectNextStation}
                  className="w-10 h-10 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
                  style={{
                    borderColor: colors.text + '40',
                    backgroundColor: 'transparent',
                    color: colors.text,
                  }}
                  title="Следующая станция (N)"
                >
                  ⏭
                </button>
                <button
                  onClick={recognizeNowPlaying}
                  disabled={!auddApiKey || !nowPlaying || isRecognizing}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs transition-all duration-300 ${
                    !auddApiKey || !nowPlaying
                      ? 'border-gray-700/40 text-gray-500'
                      : isRecognizing
                      ? 'border-yellow-600 bg-yellow-600/20 animate-pulse'
                      : 'border-purple-600 text-purple-400 hover:bg-purple-600/20'
                  }`}
                  title="Распознать трек"
                >
                  {isRecognizing ? '...' : '❓'}
                </button>
              </div>
              <div className="w-full max-w-xs mx-auto mb-1 px-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: colors.primary }}
                />
              </div>
              <div className="mt-2 text-xs opacity-70">
                <input
                  type="password"
                  placeholder="AudD API Key"
                  value={auddApiKey}
                  onChange={e => setAuddApiKey(e.target.value)}
                  className="w-full p-1 rounded text-xs bg-white/10 border border-white/20"
                  style={{ color: colors.text }}
                />
              </div>
            </div>

            {/* --- ЭКВАЛАЙЗЕР --- */}
            <div className="bg-white/10 rounded-xl p-3 mt-3 w-full max-w-2xl">
              <h3 className="font-medium text-sm mb-2" style={{ color: colors.text }}>Эквалайзер</h3>
              <div className="flex justify-around">
                {['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-xs mb-0.5">{label}</div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      value={equalizerBands[i]}
                      onChange={(e) => {
                        const newBands = [...equalizerBands];
                        newBands[i] = parseFloat(e.target.value);
                        setEqualizerBands(newBands);
                      }}
                      className="w-10 h-20 rotate-90"
                      style={{ accentColor: colors.primary }}
                    />
                    <div className="text-xs mt-0.5">{equalizerBands[i]} dB</div>
                  </div>
                ))}
              </div>
            </div>
            {/* --- КОНЕЦ ЭКВАЛАЙЗЕРА --- */}

            <div className="mt-2 text-center text-xs opacity-70">
              Избранных: {favorites.length} • Станций: {stations.length}
            </div>
          </section>
        </main>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white/10 p-4 rounded-xl w-80 max-w-[90%]" style={{ backgroundColor: colors.bgPanel }}>
              <h3 className="text-base font-medium mb-2" style={{ color: colors.text }}>Добавить станцию</h3>
              <input
                type="text"
                placeholder="Название"
                value={newStation.name}
                onChange={e => setNewStation({ ...newStation, name: e.target.value })}
                className="w-full p-1.5 mb-2 rounded bg-white/10 border border-white/20 text-white text-sm"
              />
              <input
                type="text"
                placeholder="URL (поддерживает .m3u, .pls)"
                value={newStation.url}
                onChange={e => setNewStation({ ...newStation, url: e.target.value })}
                className="w-full p-1.5 mb-2 rounded bg-white/10 border border-white/20 text-white text-sm"
              />
              <input
                type="text"
                placeholder="Жанр"
                value={newStation.genre}
                onChange={e => setNewStation({ ...newStation, genre: e.target.value })}
                className="w-full p-1.5 mb-3 rounded bg-white/10 border border-white/20 text-white text-sm"
              />
              <div className="flex gap-1">
                <button
                  onClick={addStation}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded flex-1 text-sm"
                >
                  Добавить
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded flex-1 text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <select value={themeId} onChange={e => setThemeId(e.target.value)} className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20" style={{ color: colors.text }}>
            {Object.entries(THEMES).map(([id, theme]) => <option key={id} value={id}>{theme.name}</option>)}
            <option value="custom">Свой фон</option>
          </select>
          {themeId === 'custom' && (
            <div className="flex gap-1 flex-wrap">
              <input type="text" placeholder="URL изображения" value={customBackground.startsWith('http') ? customBackground : ''} onChange={e => setCustomBackground(e.target.value)} className="px-1.5 py-1 rounded text-xs w-24 sm:w-32 bg-white/10 border border-white/20" style={{ color: colors.text }} />
              <label className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20 cursor-pointer" style={{ color: colors.text }}>
                Загрузить
                <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = ev => setCustomBackground(ev.target.result); reader.readAsDataURL(file); } }} className="hidden" />
              </label>
            </div>
          )}
          <select value={visualizerType} onChange={e => setVisualizerType(e.target.value)} className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20" style={{ color: colors.text }}>
            <option value="bars">Столбики</option>
            <option value="waveform">Волна</option>
            <option value="circular">Круг</option>
          </select>
          <div className="flex bg-white/10 rounded-full p-0.5 border border-white/20">
            <button className={`px-2 py-0.5 text-xs ${layoutMode === 'compact' ? 'bg-emerald-600 text-white' : ''}`} onClick={() => setLayoutMode('compact')}>Компакт</button>
            <button className={`px-2 py-0.5 text-xs ${layoutMode === 'expanded' ? 'bg-emerald-600 text-white' : ''}`} onClick={() => setLayoutMode('expanded')}>Крупный</button>
          </div>
        </div>
        <audio ref={audioRef} preload="none" />
        <footer className="mt-4 text-center text-xs opacity-60" style={{ color: colors.text }}>
          Chill Radio by kurt • Учись, слушай, записывай
        </footer>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
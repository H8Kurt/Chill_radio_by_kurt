// src/components/Player.jsx
import React, { useEffect, useRef, useCallback } from 'react';

const Player = ({ audioRef, canvasRef, analyserRef, audioCtxRef, animationRef, isPlaying, onPlayPause, onStop, onPrev, onNext, volume, onVolumeChange, visualizerType, themeId, nowPlaying, recognitionResult, isRecognizing, onRecognize, auddApiKey, onSetAuddApiKey, colors, GENRE_ICONS, formatTime }) => {
  const [currentTrackInfo, setCurrentTrackInfo] = useState('');

  useEffect(() => {
    if (nowPlaying) {
      setCurrentTrackInfo(nowPlaying.name);
    }
  }, [nowPlaying]);

  // --- Визуализатор ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioCtxRef.current) {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ac;
        const source = ac.createMediaElementSource(audio);
        const analyser = ac.createAnalyser();
        analyser.fftSize = visualizerType === 'circular' ? 1024 : 256;
        source.connect(analyser);
        analyser.connect(ac.destination);
        analyserRef.current = analyser;
      } catch (e) {
        return;
      }
    }
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
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
  }, [nowPlaying, visualizerType, themeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = 100 * devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className={`w-full ${layoutMode === 'compact' ? 'max-w-lg' : 'max-w-2xl'} bg-white/10 rounded-2xl p-5 transition-all duration-300`} style={{ backgroundColor: colors.bgPanel }}>
      <div className="text-center mb-5">
        <div className="text-lg sm:text-xl font-light mb-1 min-h-[2rem]" style={{ color: colors.text }}>
          {recognitionResult?.error ? (
            <span className="text-red-300 text-sm">
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
              <div className="text-sm opacity-80">{nowPlaying.genre}</div>
            </>
          ) : (
            <span className="opacity-70">Выберите станцию</span>
          )}
        </div>
      </div>
      <div className="mb-5">
        <canvas ref={canvasRef} className="w-full bg-black/10 rounded" />
      </div>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={onPrev}
          className="w-12 h-12 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
          style={{
            borderColor: colors.text + '40',
            backgroundColor: 'transparent',
            color: colors.text,
          }}
        >
          ⏪
        </button>
        <button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 hover:shadow-lg active:scale-95 transform hover:-translate-y-0.5"
          style={{
            borderColor: isPlaying ? '#ef4444' : colors.primary,
            backgroundColor: 'transparent',
            color: isPlaying ? '#ef4444' : colors.primary,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={onStop}
          className="w-12 h-12 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
          style={{
            borderColor: colors.text + '40',
            backgroundColor: 'transparent',
            color: colors.text,
          }}
        >
          ⏹
        </button>
        <button
          onClick={onNext}
          className="w-12 h-12 rounded border-2 flex items-center justify-center transition-all duration-300 hover:shadow hover:bg-white/5 active:scale-95"
          style={{
            borderColor: colors.text + '40',
            backgroundColor: 'transparent',
            color: colors.text,
          }}
        >
          ⏩
        </button>
        <button
          onClick={onRecognize}
          disabled={!auddApiKey || !nowPlaying || isRecognizing}
          className={`w-10 h-10 rounded border-2 flex items-center justify-center text-sm transition-all duration-300 ${
            !auddApiKey || !nowPlaying
              ? 'border-gray-700/40 text-gray-500'
              : isRecognizing
              ? 'border-yellow-600 bg-yellow-600/20 animate-pulse'
              : 'border-purple-600 text-purple-400 hover:bg-purple-600/20'
          }`}
        >
          {isRecognizing ? '...' : '❓'}
        </button>
      </div>
      <div className="w-full max-w-xs mx-auto mb-2 px-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={e => onVolumeChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: colors.primary }}
        />
      </div>
      <div className="mt-3 text-xs opacity-70">
        <input
          type="password"
          placeholder="AudD API Key"
          value={auddApiKey}
          onChange={e => onSetAuddApiKey(e.target.value)}
          className="w-full p-1.5 rounded text-xs bg-white/10 border border-white/20"
          style={{ color: colors.text }}
        />
      </div>
    </div>
  );
};

export default Player;
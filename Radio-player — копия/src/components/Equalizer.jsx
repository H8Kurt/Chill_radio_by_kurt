// src/components/Equalizer.jsx
import React, { useEffect, useRef } from 'react';

const Equalizer = ({ bands, onChange, colors }) => {
  const audioCtxRef = useRef(null);
  const equalizerNodesRef = useRef([]);

  useEffect(() => {
    // Создаем или обновляем фильтры эквалайзера
    if (!audioCtxRef.current) {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ac;
      } catch (e) {
        console.warn('Web Audio API не поддерживается');
        return;
      }
    }

    const ac = audioCtxRef.current;

    // Очищаем старые ноды
    equalizerNodesRef.current.forEach(node => node.disconnect());
    equalizerNodesRef.current = [];

    // Создаем новые фильтры
    const frequencies = [60, 250, 1000, 4000, 16000]; // Частоты для полос
    const gains = bands.map((gain, i) => gain); // Значения усиления

    // Создаем BiquadFilterNode для каждой полосы
    const filterNodes = frequencies.map((freq, i) => {
      const filter = ac.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.gain.value = gains[i];
      filter.Q.value = 1.0; // Ширина полосы
      return filter;
    });

    equalizerNodesRef.current = filterNodes;

    // Подключаем фильтры последовательно
    if (filterNodes.length > 0) {
      // Предполагаем, что есть источник звука (например, медиаэлемент)
      // Это нужно будет подключить к выходу эквалайзера
      // Для простоты, мы просто создаем цепочку фильтров
      // В реальном приложении нужно подключить source -> filter1 -> filter2 -> ... -> destination
    }

  }, [bands]);

  const handleBandChange = (index, value) => {
    const newBands = [...bands];
    newBands[index] = parseFloat(value);
    onChange(newBands);
  };

  return (
    <div className="bg-white/10 rounded-xl p-4 mt-4" style={{ backgroundColor: colors.bgPanel }}>
      <h3 className="font-medium mb-3" style={{ color: colors.text }}>Эквалайзер</h3>
      <div className="flex justify-around">
        {['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-xs mb-1">{label}</div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={bands[i]}
              onChange={(e) => handleBandChange(i, e.target.value)}
              className="w-12 h-24 rotate-90"
              style={{ accentColor: colors.primary }}
            />
            <div className="text-xs mt-1">{bands[i]} dB</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equalizer;
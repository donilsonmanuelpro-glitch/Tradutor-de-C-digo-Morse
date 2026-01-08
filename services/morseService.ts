
import { MORSE_DICT, REVERSE_MORSE_DICT, PORTUGUESE_MAP } from '../constants';

export const translateToMorse = (text: string): string => {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      // Handle Portuguese accents
      const normalizedChar = PORTUGUESE_MAP[char] || char;
      return MORSE_DICT[normalizedChar] || '';
    })
    .filter(code => code !== '')
    .join(' ');
};

export const translateToText = (morse: string): string => {
  return morse
    .trim()
    .split(' ')
    .map(code => {
      if (code === '/') return ' ';
      return REVERSE_MORSE_DICT[code] || '?';
    })
    .join('');
};

export const playMorseAudio = async (morse: string) => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const unit = 0.1; // dot length in seconds
  const frequency = 600;

  const playSignal = (duration: number, startTime: number) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gain.gain.linearRampToValueAtTime(1, startTime + duration - 0.01);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  let currentTime = audioCtx.currentTime;

  for (const char of morse) {
    if (char === '.') {
      playSignal(unit, currentTime);
      currentTime += unit * 2;
    } else if (char === '-') {
      playSignal(unit * 3, currentTime);
      currentTime += unit * 4;
    } else if (char === ' ') {
      currentTime += unit * 3;
    } else if (char === '/') {
      currentTime += unit * 7;
    }
  }
};

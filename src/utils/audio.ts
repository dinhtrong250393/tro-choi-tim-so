import { Howl } from 'howler';

let correctSound: Howl | null = null;
let wrongSound: Howl | null = null;

if (typeof window !== 'undefined') {
  // Khởi tạo Howler với file âm thanh mp3
  correctSound = new Howl({
    src: ['/correct.mp3'],
    preload: true,
    volume: 1.0,
  });

  wrongSound = new Howl({
    src: ['/wrong.mp3'],
    preload: true,
    volume: 1.0,
  });
}

// Hàm phát âm thanh dự phòng (tự tạo ra tiếng bíp bíp) trong trường hợp lỗi mạng không tải được file
const playSynthesizedSound = (type: 'correct' | 'wrong') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  } else {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
  }
};

export const playCorrectSound = () => {
  try {
    if (correctSound && correctSound.state() === 'loaded') {
      correctSound.play();
    } else {
      playSynthesizedSound('correct');
    }
  } catch (error) {
    console.error('Lỗi khi phát âm thanh đúng', error);
  }
};

export const playWrongSound = () => {
  try {
    if (wrongSound && wrongSound.state() === 'loaded') {
      wrongSound.play();
    } else {
      playSynthesizedSound('wrong');
    }
  } catch (error) {
    console.error('Lỗi khi phát âm thanh sai', error);
  }
};

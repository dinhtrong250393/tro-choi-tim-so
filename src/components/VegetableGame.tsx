import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Star, Sparkles, X } from 'lucide-react';
import { playCorrectSound, playWrongSound } from '../utils/audio';

interface VegetableItem {
  id: string;
  value: string;
  found: boolean;
  wrong?: boolean;
}

const VEGETABLES = ['🥕', '🥔', '🍅', '🌽', '🥦', '🍄', '🧅', '🧄', '🍆', '🥒', '🌶️', '🥬'];

export default function VegetableGame() {
  const [targetVeggie, setTargetVeggie] = useState<string>('🥕');
  const [items, setItems] = useState<VegetableItem[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const initGame = useCallback(() => {
    // Random target veggie
    const targetIdx = Math.floor(Math.random() * VEGETABLES.length);
    const newTarget = VEGETABLES[targetIdx];
    setTargetVeggie(newTarget);
    
    // We need 3 targets
    let newItems: string[] = [newTarget, newTarget, newTarget];
    
    // And 5 other distinct or random veggies
    const others = VEGETABLES.filter(v => v !== newTarget);
    for(let i = 0; i < 5; i++) {
        newItems.push(others[Math.floor(Math.random() * others.length)]);
    }
    
    // Shuffle
    newItems.sort(() => Math.random() - 0.5);
    
    setItems(newItems.map((val, idx) => ({
      id: `${idx}-${val}-${Date.now()}`,
      value: val,
      found: false,
      wrong: false
    })));
    setGameState('playing');
    setWrongCount(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#A3E635', '#FBBF24', '#EF4444', '#F97316', '#8B5CF6']
    });
  };

  const handleItemClick = (id: string, value: string, found: boolean, wrong?: boolean) => {
    if (found || gameState !== 'playing' || wrong) return;

    if (value === targetVeggie) {
      triggerSmallConfetti();
      playCorrectSound();
      
      const newItems = items.map(item => 
        item.id === id ? { ...item, found: true } : item
      );
      setItems(newItems);
      
      const unFoundTargets = newItems.filter(item => item.value === targetVeggie && !item.found);
      if (unFoundTargets.length === 0) {
        setGameState('won');
        triggerConfetti();
        setTimeout(() => {
          initGame();
        }, 3000);
      }
    } else {
      playWrongSound();
      const newItems = items.map(item => 
        item.id === id ? { ...item, wrong: true } : item
      );
      setItems(newItems);
      
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      if (newWrongCount >= 3) {
        setGameState('lost');
        setTimeout(() => {
          initGame();
        }, 3000);
      } else {
        setShakeId(id);
        setTimeout(() => setShakeId(null), 500); 
      }
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#A3E635', '#FBBF24', '#EF4444', '#F97316', '#8B5CF6']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#A3E635', '#FBBF24', '#EF4444', '#F97316', '#8B5CF6']
      });
    }, 250);
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-lime-100 via-green-100 to-emerald-200 flex flex-col items-center pt-16 pb-2 md:pt-24 md:pb-10 px-2 md:px-4 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-4 md:left-10 text-lime-200/50 text-6xl md:text-9xl rotate-[-20deg] pointer-events-none">🥬</div>
      <div className="absolute bottom-20 right-4 md:right-10 text-emerald-200/50 text-6xl md:text-9xl rotate-[15deg] pointer-events-none">🥕</div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-2 md:p-8 mb-2 md:mb-8 border-4 border-white text-center max-w-2xl w-full z-10 shrink-0"
      >
        <h1 className="text-xl md:text-5xl font-black text-lime-600 mb-1 md:mb-2 flex flex-wrap items-center justify-center gap-1 md:gap-3">
          <Star className="text-yellow-400 fill-yellow-400 hidden md:block" size={40} />
          Bé hãy tìm các loại
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl md:text-6xl mx-1 md:mx-2 drop-shadow-md bg-lime-50 px-3 md:px-4 py-0 md:py-2 rounded-xl md:rounded-3xl border-2 md:border-4 border-lime-100"
          >
            {targetVeggie}
          </motion.div>
          nhé!
          <Star className="text-yellow-400 fill-yellow-400 hidden md:block" size={40} />
        </h1>
      </motion.div>

      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center min-h-0 py-0 md:py-4 z-10">
        <div className="grid grid-cols-4 gap-2 md:gap-8 w-full px-1 md:px-4 max-w-[95vw] md:max-w-3xl mx-auto h-full max-h-[50vh] md:max-h-[60vh] content-center justify-items-center">
          <AnimatePresence>
            {items.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  shakeId === item.id 
                    ? { x: [-10, 10, -10, 10, 0], scale: 1 } 
                    : { scale: 1, opacity: 1 }
                }
                whileHover={!item.found ? { scale: 1.08, rotate: Math.random() * 10 - 5 } : {}}
                whileTap={!item.found ? { scale: 0.95 } : {}}
                onClick={() => handleItemClick(item.id, item.value, item.found, item.wrong)}
                transition={shakeId === item.id ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.found || item.wrong || gameState !== 'playing'}
                className={`
                  relative aspect-square w-[18vw] max-w-[120px] md:w-full md:max-w-[160px] rounded-[1rem] md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-7xl font-black border-4 md:border-8 transition-all
                  ${item.found 
                    ? 'bg-lime-100 border-lime-300 scale-90 shadow-inner opacity-80' 
                    : item.wrong
                      ? 'bg-rose-50 border-rose-200 opacity-80 scale-95 shadow-inner'
                      : 'bg-white border-lime-200 shadow-[0_4px_0_0_rgba(190,242,100,1)] md:shadow-[0_8px_0_0_rgba(190,242,100,1)] hover:shadow-[0_12px_0_0_rgba(190,242,100,1)] hover:-translate-y-1 md:hover:-translate-y-2 active:translate-y-1 md:active:translate-y-2 active:shadow-none cursor-pointer'
                  }
                  ${shakeId === item.id ? 'bg-red-100 border-red-300 shadow-[0_4px_0_0_rgba(252,165,165,1)] md:shadow-[0_8px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                {item.wrong ? (
                  <X size={40} className="text-red-400 drop-shadow-sm md:w-16 md:h-16" strokeWidth={5} />
                ) : (
                  <span className="drop-shadow-sm">{item.value}</span>
                )}
                {item.found && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full relative"
                    >
                      <Sparkles className="absolute -top-2 md:-top-4 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 drop-shadow-md w-4 h-4 md:w-8 md:h-8" />
                      <Sparkles className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 text-lime-400 fill-lime-400 drop-shadow-md w-4 h-4 md:w-8 md:h-8" />
                      <Sparkles className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 text-emerald-400 fill-emerald-400 drop-shadow-md w-4 h-4 md:w-8 md:h-8" />
                      <Sparkles className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 text-green-400 fill-green-400 drop-shadow-md w-4 h-4 md:w-8 md:h-8" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-2xl border-4 border-yellow-300 z-50 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black text-lime-500 mb-2 drop-shadow-sm">Hoan hô!</h2>
            <p className="text-xl md:text-3xl font-bold text-gray-700">Chúc mừng bé đã hoàn thành!</p>
          </motion.div>
        )}
        
        {gameState === 'lost' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-2xl border-4 border-red-300 z-50 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black text-red-500 mb-2 drop-shadow-sm">Ôi không!</h2>
            <p className="text-xl md:text-3xl font-bold text-gray-700">Bé đã thua rồi!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'won' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initGame}
            className="mt-2 mb-2 md:mt-12 bg-gradient-to-b from-lime-400 to-lime-600 text-white font-black text-lg md:text-3xl px-6 md:px-10 py-2 md:py-5 rounded-full shadow-[0_4px_0_0_rgba(101,163,13,1)] md:shadow-[0_8px_0_0_rgba(101,163,13,1)] hover:shadow-[0_12px_0_0_rgba(101,163,13,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-2 md:gap-4 border-2 md:border-4 border-lime-300 z-10"
          >
            <RotateCcw size={20} className={`md:w-8 md:h-8 animate-spin`} />
            ĐỔI LOẠI KHÁC!
          </motion.button>
        )}
      </AnimatePresence>
      
      {gameState !== 'won' && (
         <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
          className="mt-2 mb-2 md:mt-12 bg-white text-lime-600 font-bold text-base md:text-xl px-4 md:px-8 py-1 md:py-3 rounded-full shadow-sm hover:shadow-md flex items-center gap-2 border-2 border-lime-100 z-10"
        >
          <RotateCcw size={16} className={`md:w-5 md:h-5 ${gameState === 'lost' ? "animate-spin" : ""}`} />
          Đổi loại khác
        </motion.button>
      )}
    </div>
  );
}

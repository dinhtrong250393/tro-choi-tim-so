import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Star, Sparkles, X } from 'lucide-react';
import { playCorrectSound, playWrongSound } from '../utils/audio';

interface NumberItem {
  id: string;
  value: number;
  found: boolean;
  wrong?: boolean;
}

export default function NumberGame() {
  const [targetNumber, setTargetNumber] = useState<number>(1);
  const [items, setItems] = useState<NumberItem[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const initGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 5) + 1;
    setTargetNumber(newTarget);
    
    let newItems: number[] = [newTarget, newTarget, newTarget];
    
    const others = [1, 2, 3, 4, 5].filter(n => n !== newTarget);
    for(let i = 0; i < 5; i++) {
        newItems.push(others[Math.floor(Math.random() * others.length)]);
    }
    
    newItems.sort(() => Math.random() - 0.5);
    
    setItems(newItems.map((val, idx) => ({
      id: `${idx}-${val}-${Date.now()}`,
      value: val,
      found: false,
      wrong: false
    })));
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC700', '#FF0000', '#2E3192', '#1BA1E2', '#00A300']
    });
  };

  const handleItemClick = (id: string, value: number, found: boolean, wrong?: boolean) => {
    if (found || isWon || wrong) return;

    if (value === targetNumber) {
      triggerSmallConfetti();
      playCorrectSound();
      
      const newItems = items.map(item => 
        item.id === id ? { ...item, found: true } : item
      );
      setItems(newItems);
      
      const unFoundTargets = newItems.filter(item => item.value === targetNumber && !item.found);
      if (unFoundTargets.length === 0) {
        setIsWon(true);
        triggerConfetti();
      }
    } else {
      playWrongSound();
      const newItems = items.map(item => 
        item.id === id ? { ...item, wrong: true } : item
      );
      setItems(newItems);
      
      setShakeId(id);
      setTimeout(() => setShakeId(null), 500); 
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
        colors: ['#FFC700', '#FF0000', '#2E3192', '#1BA1E2', '#00A300']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFC700', '#FF0000', '#2E3192', '#1BA1E2', '#00A300']
      });
    }, 250);
  };

  return (
    <div className="h-full bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 flex flex-col items-center pt-20 pb-4 md:pt-24 md:pb-10 px-2 md:px-4 overflow-y-auto hide-scrollbar">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl p-4 md:p-8 mb-4 md:mb-8 border-4 border-white text-center max-w-2xl w-full"
      >
        <h1 className="text-2xl md:text-5xl font-black text-indigo-600 mb-1 md:mb-2 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <Star className="text-yellow-400 fill-yellow-400 hidden md:block" size={40} />
          Bé hãy tìm các số
          <span className="text-pink-500 text-4xl md:text-6xl mx-1 bg-pink-100 rounded-2xl px-4 py-1 border-4 border-pink-200 shadow-inner">
            {targetNumber}
          </span>
          nhé!
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
        </h1>
      </motion.div>

      <div className="w-full max-w-3xl flex-1 min-h-0 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full px-2 md:px-4">
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
                whileHover={!item.found ? { scale: 1.05 } : {}}
                whileTap={!item.found ? { scale: 0.95 } : {}}
                onClick={() => handleItemClick(item.id, item.value, item.found, item.wrong)}
                transition={shakeId === item.id ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.found || item.wrong || isWon}
                className={`
                  relative aspect-square rounded-full flex items-center justify-center text-5xl md:text-7xl font-black border-4 md:border-8 transition-colors
                  ${item.found 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-500 scale-95 shadow-inner' 
                    : item.wrong
                      ? 'bg-red-50 border-red-200 text-red-400 opacity-80 scale-95 shadow-inner'
                      : 'bg-white border-blue-200 text-blue-500 shadow-[0_8px_0_0_rgba(191,219,254,1)] hover:shadow-[0_12px_0_0_rgba(191,219,254,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none cursor-pointer'
                  }
                  ${shakeId === item.id ? 'bg-red-100 border-red-300 text-red-500 shadow-[0_8px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                {item.wrong ? (
                  <X size={64} className="text-red-500 drop-shadow-sm" strokeWidth={4} />
                ) : (
                  item.value
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
                      <Sparkles className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-pink-400 fill-pink-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute top-1/2 -left-4 -translate-y-1/2 text-cyan-400 fill-cyan-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute top-1/2 -right-4 -translate-y-1/2 text-orange-400 fill-orange-400 drop-shadow-md" size={32} />
                    </motion.div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={initGame}
        className="mt-6 md:mt-12 bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-xl md:text-3xl px-8 md:px-10 py-3 md:py-5 rounded-full shadow-[0_8px_0_0_rgba(194,65,12,1)] hover:shadow-[0_12px_0_0_rgba(194,65,12,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-3 md:gap-4 border-4 border-orange-300"
      >
        <RotateCcw size={24} className={isWon ? "animate-spin" : ""} />
        {isWon ? 'CHƠI TIẾP NÀO!' : 'ĐỔI SỐ KHÁC'}
      </motion.button>
    </div>
  );
}

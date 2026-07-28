import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Star, Sparkles, X } from 'lucide-react';
import { playCorrectSound, playWrongSound } from '../utils/audio';

interface AnimalItem {
  id: string;
  value: string;
  found: boolean;
  wrong?: boolean;
}

const ANIMALS = ['🐕', '🐈', '🐇', '🐅', '🐄', '🐖', '🐘', '🦒', '🐎', '🦘', '🦌', '🐪'];

export default function AnimalGame() {
  const [targetAnimal, setTargetAnimal] = useState<string>('🐕');
  const [items, setItems] = useState<AnimalItem[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const initGame = useCallback(() => {
    // Random target animal
    const targetIdx = Math.floor(Math.random() * ANIMALS.length);
    const newTarget = ANIMALS[targetIdx];
    setTargetAnimal(newTarget);
    
    // We need 3 targets
    let newItems: string[] = [newTarget, newTarget, newTarget];
    
    // And 5 other distinct or random animals
    const others = ANIMALS.filter(a => a !== newTarget);
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
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#34D399', '#FBBF24', '#60A5FA', '#F472B6', '#A78BFA']
    });
  };

  const handleItemClick = (id: string, value: string, found: boolean, wrong?: boolean) => {
    if (found || isWon || wrong) return;

    if (value === targetAnimal) {
      triggerSmallConfetti();
      playCorrectSound();
      
      const newItems = items.map(item => 
        item.id === id ? { ...item, found: true } : item
      );
      setItems(newItems);
      
      const unFoundTargets = newItems.filter(item => item.value === targetAnimal && !item.found);
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
        colors: ['#34D399', '#FBBF24', '#60A5FA', '#F472B6', '#A78BFA']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#34D399', '#FBBF24', '#60A5FA', '#F472B6', '#A78BFA']
      });
    }, 250);
  };

  return (
    <div className="h-full bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-200 flex flex-col items-center pt-20 pb-4 md:pt-24 md:pb-10 px-2 md:px-4 relative overflow-y-auto hide-scrollbar">
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-4 md:left-10 text-emerald-200/50 text-6xl md:text-9xl rotate-[-20deg] pointer-events-none">🌿</div>
      <div className="absolute bottom-20 right-4 md:right-10 text-cyan-200/50 text-6xl md:text-9xl rotate-[15deg] pointer-events-none">🍃</div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl p-4 md:p-8 mb-4 md:mb-8 border-4 border-white text-center max-w-2xl w-full z-10"
      >
        <h1 className="text-2xl md:text-5xl font-black text-teal-600 mb-1 md:mb-2 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <Star className="text-yellow-400 fill-yellow-400 hidden md:block" size={40} />
          Bé hãy tìm các bạn
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl md:text-6xl mx-1 md:mx-2 drop-shadow-md bg-teal-50 px-3 md:px-4 py-1 md:py-2 rounded-2xl md:rounded-3xl border-4 border-teal-100"
          >
            {targetAnimal}
          </motion.div>
          nhé!
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
        </h1>
      </motion.div>

      <div className="w-full max-w-3xl flex-1 min-h-0 flex flex-col items-center justify-center z-10">
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
                whileHover={!item.found ? { scale: 1.08, rotate: Math.random() * 10 - 5 } : {}}
                whileTap={!item.found ? { scale: 0.95 } : {}}
                onClick={() => handleItemClick(item.id, item.value, item.found, item.wrong)}
                transition={shakeId === item.id ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.found || item.wrong || isWon}
                className={`
                  relative aspect-square rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl font-black border-4 md:border-8 transition-all
                  ${item.found 
                    ? 'bg-emerald-100 border-emerald-300 scale-90 shadow-inner opacity-80' 
                    : item.wrong
                      ? 'bg-rose-50 border-rose-200 opacity-80 scale-95 shadow-inner'
                      : 'bg-white border-teal-200 shadow-[0_8px_0_0_rgba(153,246,228,1)] hover:shadow-[0_12px_0_0_rgba(153,246,228,1)] hover:-translate-y-2 active:translate-y-2 active:shadow-none cursor-pointer'
                  }
                  ${shakeId === item.id ? 'bg-red-100 border-red-300 shadow-[0_8px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                {item.wrong ? (
                  <X size={72} className="text-red-400 drop-shadow-sm" strokeWidth={5} />
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
                      <Sparkles className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-teal-400 fill-teal-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute top-1/2 -left-4 -translate-y-1/2 text-emerald-400 fill-emerald-400 drop-shadow-md" size={32} />
                      <Sparkles className="absolute top-1/2 -right-4 -translate-y-1/2 text-green-400 fill-green-400 drop-shadow-md" size={32} />
                    </motion.div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initGame}
            className="mt-6 md:mt-12 bg-gradient-to-b from-teal-400 to-teal-600 text-white font-black text-xl md:text-3xl px-8 md:px-10 py-3 md:py-5 rounded-full shadow-[0_8px_0_0_rgba(15,118,110,1)] hover:shadow-[0_12px_0_0_rgba(15,118,110,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-3 md:gap-4 border-4 border-teal-300 z-10"
          >
            <RotateCcw size={24} className="animate-spin" />
            ĐỔI BẠN KHÁC!
          </motion.button>
        )}
      </AnimatePresence>
      
      {!isWon && (
         <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
          className="mt-6 md:mt-12 bg-white text-teal-500 font-bold text-lg md:text-xl px-6 md:px-8 py-2 md:py-3 rounded-full shadow-sm hover:shadow-md flex items-center gap-2 border-2 border-teal-100 z-10"
        >
          <RotateCcw size={20} />
          Đổi bạn khác
        </motion.button>
      )}
    </div>
  );
}


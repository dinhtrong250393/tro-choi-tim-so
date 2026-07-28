import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Star, Sparkles, Utensils } from 'lucide-react';
import { playCorrectSound, playWrongSound } from '../utils/audio';

const PAIRS = [
  { animal: '🐕', food: '🦴' },
  { animal: '🐈', food: '🐟' },
  { animal: '🐇', food: '🥕' },
  { animal: '🐁', food: '🧀' },
  { animal: '🐒', food: '🍌' },
];

interface GameItem {
  id: string;
  emoji: string;
  matched: boolean;
}

export default function FeedGame() {
  const [animals, setAnimals] = useState<GameItem[]>([]);
  const [foods, setFoods] = useState<GameItem[]>([]);
  
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  
  const [shakeAnimal, setShakeAnimal] = useState<string | null>(null);
  const [shakeFood, setShakeFood] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(() => {
    const shuffledAnimals = [...PAIRS].sort(() => Math.random() - 0.5).map(p => ({
      id: `animal-${p.animal}`,
      emoji: p.animal,
      matched: false
    }));
    
    const shuffledFoods = [...PAIRS].sort(() => Math.random() - 0.5).map(p => ({
      id: `food-${p.food}`,
      emoji: p.food,
      matched: false
    }));

    setAnimals(shuffledAnimals);
    setFoods(shuffledFoods);
    setSelectedAnimal(null);
    setSelectedFood(null);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFC700', '#FF0000', '#2E3192', '#1BA1E2', '#00A300']
    });
  };

  const triggerWinConfetti = () => {
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
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    if (selectedAnimal && selectedFood) {
      const pair = PAIRS.find(p => p.animal === selectedAnimal);
      if (pair && pair.food === selectedFood) {
        // Match
        triggerSmallConfetti();
        playCorrectSound();
        setAnimals(prev => prev.map(a => a.emoji === selectedAnimal ? { ...a, matched: true } : a));
        setFoods(prev => prev.map(f => f.emoji === selectedFood ? { ...f, matched: true } : f));
        setSelectedAnimal(null);
        setSelectedFood(null);
      } else {
        // Wrong
        playWrongSound();
        setShakeAnimal(selectedAnimal);
        setShakeFood(selectedFood);
        setTimeout(() => {
          setShakeAnimal(null);
          setShakeFood(null);
          setSelectedAnimal(null);
          setSelectedFood(null);
        }, 600);
      }
    }
  }, [selectedAnimal, selectedFood]);

  useEffect(() => {
    if (animals.length > 0 && animals.every(a => a.matched)) {
      setIsWon(true);
      triggerWinConfetti();
    }
  }, [animals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200 flex flex-col items-center pt-24 pb-10 px-4 relative">
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 text-orange-200/50 text-9xl rotate-[-20deg] pointer-events-none">🦴</div>
      <div className="absolute bottom-20 right-10 text-rose-200/50 text-9xl rotate-[15deg] pointer-events-none">🥕</div>
      <div className="absolute top-40 right-20 text-amber-200/40 text-7xl rotate-[30deg] pointer-events-none">🍎</div>

      {/* Title */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl p-6 md:p-8 mb-8 border-4 border-white text-center max-w-2xl w-full z-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-orange-500 mb-2 flex flex-wrap items-center justify-center gap-3">
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
          Bé hãy cho các bạn ăn nhé!
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
        </h1>
        <p className="text-lg md:text-xl font-bold text-orange-400 mt-2 bg-orange-50 inline-block px-4 py-2 rounded-full border-2 border-orange-100">
          Chọn một bạn động vật và món ăn tương ứng
        </p>
      </motion.div>

      {/* Game Board */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="flex w-full justify-between gap-4 md:gap-12 px-2 md:px-8">
          
          {/* Animals Column */}
          <div className="flex flex-col gap-4 w-1/2 items-center">
            {animals.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  shakeAnimal === item.emoji 
                    ? { x: [-10, 10, -10, 10, 0], scale: 1 } 
                    : { scale: 1, opacity: 1 }
                }
                whileHover={!item.matched ? { scale: 1.05, rotate: -3 } : {}}
                whileTap={!item.matched ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (!item.matched && !shakeAnimal) setSelectedAnimal(item.emoji);
                }}
                transition={shakeAnimal === item.emoji ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.matched || isWon || shakeAnimal !== null}
                className={`
                  relative w-full aspect-[2/1] md:aspect-[3/1] max-w-[200px] rounded-[2rem] flex items-center justify-center text-6xl md:text-7xl font-black border-4 transition-all
                  ${item.matched 
                    ? 'bg-emerald-100 border-emerald-300 scale-90 opacity-60 shadow-inner' 
                    : selectedAnimal === item.emoji
                      ? 'bg-orange-100 border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)] scale-110 z-20 ring-4 ring-orange-300 ring-offset-2 ring-offset-orange-100'
                      : 'bg-white border-orange-200 shadow-[0_6px_0_0_rgba(253,186,116,1)] hover:shadow-[0_8px_0_0_rgba(253,186,116,1)] hover:-translate-y-1'
                  }
                  ${shakeAnimal === item.emoji ? 'bg-red-100 border-red-300 shadow-[0_6px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                <motion.span 
                  className="drop-shadow-sm"
                  animate={selectedAnimal === item.emoji ? { y: [-5, 5, -5] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item.emoji}
                </motion.span>
                {item.matched && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 bg-emerald-400 rounded-full p-2 border-4 border-white text-white shadow-lg z-30"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Foods Column */}
          <div className="flex flex-col gap-4 w-1/2 items-center">
            {foods.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  shakeFood === item.emoji 
                    ? { x: [-10, 10, -10, 10, 0], scale: 1 } 
                    : { scale: 1, opacity: 1 }
                }
                whileHover={!item.matched ? { scale: 1.05, rotate: 3 } : {}}
                whileTap={!item.matched ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (!item.matched && !shakeFood) setSelectedFood(item.emoji);
                }}
                transition={shakeFood === item.emoji ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.matched || isWon || shakeFood !== null}
                className={`
                  relative w-full aspect-[2/1] md:aspect-[3/1] max-w-[200px] rounded-[2rem] flex items-center justify-center text-6xl md:text-7xl font-black border-4 transition-all
                  ${item.matched 
                    ? 'bg-emerald-100 border-emerald-300 scale-90 opacity-60 shadow-inner' 
                    : selectedFood === item.emoji
                      ? 'bg-rose-100 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.6)] scale-110 z-20 ring-4 ring-rose-300 ring-offset-2 ring-offset-rose-100'
                      : 'bg-white border-rose-200 shadow-[0_6px_0_0_rgba(254,205,211,1)] hover:shadow-[0_8px_0_0_rgba(254,205,211,1)] hover:-translate-y-1'
                  }
                  ${shakeFood === item.emoji ? 'bg-red-100 border-red-300 shadow-[0_6px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                <motion.span 
                  className="drop-shadow-sm"
                  animate={selectedFood === item.emoji ? { y: [-5, 5, -5] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item.emoji}
                </motion.span>
                {item.matched && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -left-2 -top-2 bg-emerald-400 rounded-full p-2 border-4 border-white text-white shadow-lg z-30"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

        </div>
      </div>

      {/* Restart Button */}
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
            className="mt-10 bg-gradient-to-b from-orange-400 to-red-500 text-white font-black text-2xl md:text-3xl px-10 py-5 rounded-full shadow-[0_8px_0_0_rgba(194,65,12,1)] hover:shadow-[0_12px_0_0_rgba(194,65,12,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-4 border-4 border-orange-300 z-10"
          >
            <RotateCcw size={32} className="animate-spin" />
            CHƠI LẠI NÀO!
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
          className="mt-12 bg-white text-orange-400 font-bold text-xl px-8 py-3 rounded-full shadow-sm hover:shadow-md flex items-center gap-2 border-2 border-orange-100 z-10"
        >
          <RotateCcw size={20} />
          Chơi lại
        </motion.button>
      )}
    </div>
  );
}

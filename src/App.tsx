/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star, Sparkles } from 'lucide-react';

interface NumberItem {
  id: string;
  value: number;
  found: boolean;
}

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(1);
  const [items, setItems] = useState<NumberItem[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Khởi tạo trò chơi mới
  const initGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 5) + 1; // Số ngẫu nhiên từ 1 đến 5
    setTargetNumber(newTarget);
    
    // Tạo danh sách số: Số mục tiêu xuất hiện 3 lần
    let newItems: number[] = [newTarget, newTarget, newTarget];
    
    // Các số còn lại được lấy ngẫu nhiên từ 1-5 (khác số mục tiêu)
    const others = [1, 2, 3, 4, 5].filter(n => n !== newTarget);
    for(let i = 0; i < 5; i++) {
        newItems.push(others[Math.floor(Math.random() * others.length)]);
    }
    
    // Xáo trộn vị trí các số
    newItems.sort(() => Math.random() - 0.5);
    
    setItems(newItems.map((val, idx) => ({
      id: `${idx}-${val}-${Date.now()}`,
      value: val,
      found: false
    })));
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Tải danh sách giọng đọc của trình duyệt để đảm bảo tìm thấy giọng Tiếng Việt
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Hàm phát âm thanh sử dụng Web Speech API
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Hủy giọng đọc cũ nếu đang đọc
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN'; // Giọng Tiếng Việt
        utterance.rate = 0.9;     // Đọc chậm rãi hơn một chút cho bé dễ nghe
        utterance.pitch = 1.3;    // Tông giọng cao, vui nhộn

        // Ưu tiên tìm giọng đọc Tiếng Việt cụ thể từ hệ thống
        const viVoice = voices.find(voice => 
            voice.lang.toLowerCase().includes('vi') || 
            voice.name.toLowerCase().includes('vietnamese') ||
            voice.name.toLowerCase().includes('tiếng việt')
        );
        
        if (viVoice) {
            utterance.voice = viVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
  };

  // Xử lý khi bé click vào một số
  const handleItemClick = (id: string, value: number, found: boolean) => {
    if (found || isWon) return; // Bỏ qua nếu đã tìm thấy hoặc đã thắng

    if (value === targetNumber) {
      speak('Bé đã chọn đúng rồi');
      
      // Đánh dấu số này đã được tìm thấy
      const newItems = items.map(item => 
        item.id === id ? { ...item, found: true } : item
      );
      setItems(newItems);
      
      // Kiểm tra xem bé đã tìm hết chưa
      const unFoundTargets = newItems.filter(item => item.value === targetNumber && !item.found);
      if (unFoundTargets.length === 0) {
        setIsWon(true);
        triggerConfetti();
        setTimeout(() => {
            speak('Tuyệt vời! Bé đã tìm được hết rồi!');
        }, 1200);
      }
    } else {
      speak('Chưa đúng rồi, con chọn lại đi nào');
      // Kích hoạt hiệu ứng rung lắc (shake) cho số bị chọn sai
      setShakeId(id);
      setTimeout(() => setShakeId(null), 500); 
    }
  };

  // Hàm bắn pháo giấy khi chiến thắng
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 font-nunito flex flex-col items-center py-10 px-4">
      
      {/* Tiêu đề trò chơi */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl p-6 md:p-8 mb-8 border-4 border-white text-center max-w-2xl w-full"
      >
        <h1 className="text-3xl md:text-5xl font-black text-indigo-600 mb-2 flex flex-wrap items-center justify-center gap-3">
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
          Bé hãy tìm các số
          <span className="text-pink-500 text-5xl md:text-6xl mx-1 bg-pink-100 rounded-2xl px-5 py-1 border-4 border-pink-200 shadow-inner">
            {targetNumber}
          </span>
          nhé!
          <Star className="text-yellow-400 fill-yellow-400" size={40} />
        </h1>
        <p className="text-lg md:text-xl font-bold text-slate-500 flex items-center justify-center gap-2 mt-6 bg-slate-100 w-fit mx-auto px-4 py-2 rounded-full">
          <Volume2 size={24} className="text-blue-500"/>
          Hãy bật âm thanh để nghe máy nói nhé
        </p>
      </motion.div>

      {/* Lưới chứa các con số */}
      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full px-4">
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
                onClick={() => handleItemClick(item.id, item.value, item.found)}
                transition={shakeId === item.id ? { duration: 0.4 } : { type: 'spring', bounce: 0.5 }}
                disabled={item.found || isWon}
                className={`
                  relative aspect-square rounded-full flex items-center justify-center text-6xl md:text-7xl font-black border-8 transition-colors
                  ${item.found 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-500 scale-95 shadow-inner' 
                    : 'bg-white border-blue-200 text-blue-500 shadow-[0_8px_0_0_rgba(191,219,254,1)] hover:shadow-[0_12px_0_0_rgba(191,219,254,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none cursor-pointer'
                  }
                  ${shakeId === item.id ? 'bg-red-100 border-red-300 text-red-500 shadow-[0_8px_0_0_rgba(252,165,165,1)]' : ''}
                `}
              >
                {item.value}
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

      {/* Nút Chơi Lại */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={initGame}
        className="mt-12 bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-2xl md:text-3xl px-10 py-5 rounded-full shadow-[0_8px_0_0_rgba(194,65,12,1)] hover:shadow-[0_12px_0_0_rgba(194,65,12,1)] hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-4 border-4 border-orange-300"
      >
        <RotateCcw size={32} className={isWon ? "animate-spin" : ""} />
        {isWon ? 'CHƠI TIẾP NÀO!' : 'ĐỔI SỐ KHÁC'}
      </motion.button>
    </div>
  );
}

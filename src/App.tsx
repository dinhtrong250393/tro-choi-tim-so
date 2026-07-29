/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Hash, Utensils, Carrot } from 'lucide-react';
import NumberGame from './components/NumberGame';
import AnimalGame from './components/AnimalGame';
import FeedGame from './components/FeedGame';
import VegetableGame from './components/VegetableGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<'number' | 'animal' | 'feed' | 'vegetable'>('number');

  return (
    <div className="relative font-nunito h-[100dvh] overflow-hidden">
      {/* Navigation Bar overlay at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 md:p-6 pointer-events-none">
         <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg p-1 md:p-2 flex gap-1 md:gap-2 border-[3px] md:border-4 border-white pointer-events-auto overflow-x-auto max-w-[95vw] md:max-w-full hide-scrollbar">
            <button 
              onClick={() => setActiveTab('number')}
              className={`
                flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-sm md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'number' 
                  ? 'bg-blue-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <Hash size={18} className="md:w-6 md:h-6" strokeWidth={3} />
              Tìm Số
            </button>
            <button 
              onClick={() => setActiveTab('animal')}
              className={`
                flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-sm md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'animal' 
                  ? 'bg-teal-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <PawPrint size={18} className="md:w-6 md:h-6" strokeWidth={3} />
              Tìm Con Vật
            </button>
            <button 
              onClick={() => setActiveTab('feed')}
              className={`
                flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-sm md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'feed' 
                  ? 'bg-orange-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <Utensils size={18} className="md:w-6 md:h-6" strokeWidth={3} />
              Cho Ăn
            </button>
            <button 
              onClick={() => setActiveTab('vegetable')}
              className={`
                flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-sm md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'vegetable' 
                  ? 'bg-lime-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <Carrot size={18} className="md:w-6 md:h-6" strokeWidth={3} />
              Tìm Rau Củ
            </button>
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full overflow-hidden"
        >
          {activeTab === 'number' && <NumberGame />}
          {activeTab === 'animal' && <AnimalGame />}
          {activeTab === 'feed' && <FeedGame />}
          {activeTab === 'vegetable' && <VegetableGame />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

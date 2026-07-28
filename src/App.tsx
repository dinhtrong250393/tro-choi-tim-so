/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Hash, Utensils } from 'lucide-react';
import NumberGame from './components/NumberGame';
import AnimalGame from './components/AnimalGame';
import FeedGame from './components/FeedGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<'number' | 'animal' | 'feed'>('number');

  return (
    <div className="relative font-nunito min-h-screen overflow-hidden">
      {/* Navigation Bar overlay at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
         <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg p-2 flex gap-2 border-4 border-white pointer-events-auto overflow-x-auto max-w-full hide-scrollbar">
            <button 
              onClick={() => setActiveTab('number')}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-base md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'number' 
                  ? 'bg-blue-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <Hash strokeWidth={3} />
              Tìm Số
            </button>
            <button 
              onClick={() => setActiveTab('animal')}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-base md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'animal' 
                  ? 'bg-teal-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <PawPrint strokeWidth={3} />
              Tìm Con Vật
            </button>
            <button 
              onClick={() => setActiveTab('feed')}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-base md:text-xl transition-all whitespace-nowrap
                ${activeTab === 'feed' 
                  ? 'bg-orange-500 text-white shadow-inner scale-100' 
                  : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:scale-105'
                }
              `}
            >
              <Utensils strokeWidth={3} />
              Cho Ăn
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
          className="h-full"
        >
          {activeTab === 'number' && <NumberGame />}
          {activeTab === 'animal' && <AnimalGame />}
          {activeTab === 'feed' && <FeedGame />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

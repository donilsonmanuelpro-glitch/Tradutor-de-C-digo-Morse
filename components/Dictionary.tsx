
import React from 'react';
import { MORSE_DICT } from '../constants';

const Dictionary: React.FC = () => {
  const letters = Object.entries(MORSE_DICT).filter(([k]) => /^[A-Z]$/.test(k));
  const numbers = Object.entries(MORSE_DICT).filter(([k]) => /^[0-9]$/.test(k));

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold mb-6 text-blue-300">Dicionário de Referência</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Letras</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {letters.map(([char, code]) => (
              <div key={char} className="flex flex-col items-center bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <span className="text-xs font-bold text-slate-500">{char}</span>
                <span className="text-sm mono font-bold text-blue-400">{code}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Números</h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {numbers.map(([char, code]) => (
              <div key={char} className="flex flex-col items-center bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <span className="text-xs font-bold text-slate-500">{char}</span>
                <span className="text-sm mono font-bold text-emerald-400">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
